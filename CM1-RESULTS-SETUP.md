# CM1 review and teacher results

These changes are prepared for review, with no merge or deployment. The new Capitalization and Punctuation lesson is under Grammar and follows the supplied worksheet. Its incomplete nationality question has been corrected to “Are you Australian or from New Zealand?”

CM1 uses the same public Supabase configuration and authorized teacher account as CE2. Students enter their name and CM1 A or CM1 D after each exercise. Names and submitted results are not stored in browser storage. Scores retain CM1's first-attempt scoring. Submission retries reuse the same ID. The CM1 teacher page at `teacher.html` groups CM1 results by section, sorts names, and exports CSV. The existing CE2 dashboard is unchanged.

## Database prerequisite

CE2's documented database constraint currently accepts only CE2 A and CE2 D. The database owner must extend that constraint before live CM1 submission. The following SQL discovers the section check constraint and replaces it while preserving CE2 values. Review it in the existing Supabase project's SQL editor. No database credentials belong in this repository.

```sql
BEGIN;
DO $$
DECLARE constraint_name text;
BEGIN
  SELECT conname INTO STRICT constraint_name
  FROM pg_constraint
  WHERE conrelid = 'public.student_results'::regclass
    AND contype = 'c'
    AND pg_get_constraintdef(oid) LIKE '%class_section%';
  EXECUTE format('ALTER TABLE public.student_results DROP CONSTRAINT %I', constraint_name);
  ALTER TABLE public.student_results
    ADD CONSTRAINT student_results_class_section_check
    CHECK (class_section IN ('CE2 A', 'CE2 D', 'CM1 A', 'CM1 D'));
END $$;
COMMIT;
```

This deliberately fails if there is no single matching constraint. If the database contains an additional section restriction in an insert policy, extend that restriction with the same CM1 values. Keep teacher-only SELECT, anonymous insert permissions, server-default timestamps, and the existing RLS enabled.

## Review locally

Run `node build.cjs`, then serve `dist` with `python -m http.server 8000 --directory dist`. Open `http://localhost:8000/`, finish an exercise, and submit a test result. Open `http://localhost:8000/teacher.html`, sign in with your existing private teacher credentials, and verify the submission. Before the database prerequisite is applied, submission will show a retry message rather than claiming success.

Automated tests cover all 16 exercises and mocked API success, failure, retry, duplicate acknowledgment, and teacher grouping. Live Supabase submission and teacher authentication still require owner verification; no production test records have been inserted.
