BEGIN;
CREATE TABLE IF NOT EXISTS public.school_unit_exercises (
 class_level text NOT NULL CHECK(class_level IN ('CP','CE2','CM1')),
 unit_id text NOT NULL, game text NOT NULL, exercise text NOT NULL,
 PRIMARY KEY(class_level,unit_id,game,exercise)
);
ALTER TABLE public.school_unit_exercises ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.school_unit_exercises FROM anon,authenticated;
INSERT INTO public.school_unit_exercises(class_level,unit_id,game,exercise) VALUES
('CP','unit-1','School supplies','Picture pairs'),
('CP','unit-1','School supplies','What’s missing?'),
('CP','unit-1','My daily routine','Picture pairs'),
('CP','unit-1','My daily routine','What’s missing?'),
('CP','unit-1','There is / There are','Choose the sentence'),
('CE2','unit-1','Rhyming Words','Rhyming words'),
('CE2','unit-1','Rhyming Words','Picture clues'),
('CE2','unit-1','Imperative Verbs','Sort sentences'),
('CE2','unit-1','Imperative Verbs','Choose a sentence'),
('CE2','unit-1','Feelings','Picture matching'),
('CE2','unit-1','Feelings','Build a sentence'),
('CE2','unit-1','Feelings','Sentences and situations'),
('CE2','unit-1','Verb to Be','affirmative'),
('CE2','unit-1','Verb to Be','negative'),
('CE2','unit-1','Verb to Be','interrogative'),
('CE2','unit-1','Verb to Be','mixed'),
('CM1','unit-1','CM1 · Capitalization and Punctuation','Capitalize and Punctuate'),
('CM1','unit-1','CM1 · Capitalization and Punctuation','Full Stop or Question Mark?'),
('CM1','unit-1','CM1 · London Landmarks','Guess the Landmark'),
('CM1','unit-1','CM1 · London Landmarks','Who or What Am I?'),
('CM1','unit-1','CM1 · London Landmarks','Match the Landmark'),
('CM1','unit-1','CM1 · Family Tree','Family Tree Quiz'),
('CM1','unit-1','CM1 · Family Tree','Choose the Relationship'),
('CM1','unit-1','CM1 · Subject Pronouns','Replace the Subject'),
('CM1','unit-1','CM1 · Subject Pronouns','Pronoun Challenge'),
('CM1','unit-1','CM1 · Object Pronouns','Replace the Object'),
('CM1','unit-1','CM1 · Object Pronouns','Subject or Object Pronoun?'),
('CM1','unit-1','CM1 · Verb to Be','Am / Is / Are'),
('CM1','unit-1','CM1 · Verb to Be','Make It Negative'),
('CM1','unit-1','CM1 · Verb to Be','Make a Question'),
('CM1','unit-1','CM1 · Prepositions of Place','Where is it?'),
('CM1','unit-1','CM1 · Prepositions of Place','Choose the Correct Sentence')
ON CONFLICT DO NOTHING;
CREATE TABLE IF NOT EXISTS public.school_certificates (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 class_level text NOT NULL CHECK(class_level IN ('CP','CE2','CM1')),
 student_key text NOT NULL,
 student_name text NOT NULL CHECK(length(student_name) BETWEEN 1 AND 100),
 class_section text NOT NULL CHECK(class_section IN ('CP C','CP F','CE2 A','CE2 D','CM1 A','CM1 D')),
 unit_id text NOT NULL DEFAULT 'unit-1',
 awarded_at timestamptz NOT NULL DEFAULT now(), opened_at timestamptz,
 CHECK(split_part(class_section,' ',1)=class_level),
 UNIQUE(class_level,student_key,class_section,unit_id)
);
ALTER TABLE public.school_certificates ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.school_certificates FROM anon,authenticated;
GRANT SELECT ON public.school_certificates TO authenticated;
DROP POLICY IF EXISTS school_teacher_read_certificates ON public.school_certificates;
CREATE POLICY school_teacher_read_certificates ON public.school_certificates FOR SELECT TO authenticated USING(auth.uid()='eb3a0fce-6c14-48df-bdd5-0b1bcdbee4c9'::uuid);
CREATE OR REPLACE FUNCTION public.school_student_key(p_name text) RETURNS text LANGUAGE sql IMMUTABLE SET search_path='' AS $$ SELECT lower(regexp_replace(trim(p_name),'\s+',' ','g')) $$;
CREATE OR REPLACE FUNCTION public.school_send_gift(p_name text,p_section text,p_level text)
RETURNS SETOF public.school_certificates LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE normalized text:=public.school_student_key(p_name); display_name text:=regexp_replace(trim(p_name),'\s+',' ','g');
BEGIN
 IF auth.uid() IS DISTINCT FROM 'eb3a0fce-6c14-48df-bdd5-0b1bcdbee4c9'::uuid THEN RAISE EXCEPTION 'Teacher access required'; END IF;
 IF normalized IS NULL OR length(normalized) NOT BETWEEN 1 AND 100 OR p_section IS NULL OR p_section NOT IN ('CP C','CP F','CE2 A','CE2 D','CM1 A','CM1 D') OR p_level IS DISTINCT FROM split_part(p_section,' ',1) THEN RAISE EXCEPTION 'Invalid student'; END IF;
 IF NOT EXISTS(SELECT 1 FROM public.school_unit_exercises e WHERE e.class_level=p_level AND e.unit_id='unit-1') OR EXISTS (
 SELECT 1 FROM public.school_unit_exercises e WHERE e.class_level=p_level AND e.unit_id='unit-1' AND NOT EXISTS (
 SELECT 1 FROM public.student_results r WHERE public.school_student_key(r.student_name)=normalized AND r.class_section=p_section AND r.game=e.game AND r.exercise=e.exercise AND r.total>0 AND r.score>=0)) THEN RAISE EXCEPTION 'Finish every Unit 1 exercise first'; END IF;
 INSERT INTO public.school_certificates(class_level,student_key,student_name,class_section) VALUES(p_level,normalized,display_name,p_section) ON CONFLICT(class_level,student_key,class_section,unit_id) DO NOTHING;
 RETURN QUERY SELECT c.* FROM public.school_certificates c WHERE c.class_level=p_level AND c.student_key=normalized AND c.class_section=p_section AND c.unit_id='unit-1';
END $$;
CREATE OR REPLACE FUNCTION public.school_check_gifts(p_name text,p_section text,p_level text)
RETURNS TABLE(id uuid,class_level text,student_name text,class_section text,unit_id text,awarded_at timestamptz,opened_at timestamptz)
LANGUAGE sql SECURITY DEFINER STABLE SET search_path='' AS $$
 SELECT c.id,c.class_level,c.student_name,c.class_section,c.unit_id,c.awarded_at,c.opened_at FROM public.school_certificates c
 WHERE c.student_key=public.school_student_key(p_name) AND c.class_section=p_section AND c.class_level=p_level AND length(public.school_student_key(p_name)) BETWEEN 1 AND 100 ORDER BY c.awarded_at DESC
$$;
CREATE OR REPLACE FUNCTION public.school_open_gift(p_name text,p_section text,p_id uuid,p_level text)
RETURNS TABLE(id uuid,class_level text,student_name text,class_section text,unit_id text,awarded_at timestamptz,opened_at timestamptz)
LANGUAGE sql SECURITY DEFINER SET search_path='' AS $$
 UPDATE public.school_certificates c SET opened_at=coalesce(c.opened_at,now()) WHERE c.id=p_id AND c.student_key=public.school_student_key(p_name) AND c.class_section=p_section AND c.class_level=p_level
 RETURNING c.id,c.class_level,c.student_name,c.class_section,c.unit_id,c.awarded_at,c.opened_at
$$;
REVOKE ALL ON FUNCTION public.school_student_key(text),public.school_send_gift(text,text,text),public.school_check_gifts(text,text,text),public.school_open_gift(text,text,uuid,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.school_send_gift(text,text,text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.school_check_gifts(text,text,text),public.school_open_gift(text,text,uuid,text) TO anon,authenticated;
NOTIFY pgrst,'reload schema';
COMMIT;
