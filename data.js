const LANDMARKS = [
['Buckingham Palace','I am where the British monarch lives and works.','A palace where the monarch lives.', 'palace'],
['London Eye','I am a giant wheel. You can see London from me.','A giant wheel above London.','wheel'],
['The Gherkin','I am a glass building shaped like a long, round vegetable.','A round glass building.','gherkin'],
['Tower of London','I am a historic castle that keeps royal treasures.','A castle with royal treasures.','castle'],
['Tower Bridge','I cross the River Thames. My two towers stand above the water.','A bridge with two towers.','bridge'],
['Royal Guards','We wear red coats and tall black hats. We protect the monarch.','Guards in red coats.','guard'],
['The Shard','I am a very tall glass building with a pointed top.','A tall, pointed glass building.','shard'],
['Beefeaters','We wear dark uniforms with red details. We guard the Tower of London.','Guards at the Tower of London.','beefeater'],
['King Charles III','I am the British king. My first name is Charles.','The British king.','king'],
['Saint Paul Cathedral','I am a cathedral with a huge round dome.','A cathedral with a large dome.','dome'],
['Westminster Abbey','I am a church where British kings and queens are crowned.','A church for royal coronations.','abbey'],
['Big Ben','I am the nickname of the Great Bell.','The famous Great Bell.','clock']
];
const TOPICS=[
{id:'capitalization',title:'Capitalization and Punctuation',section:'Grammar',icon:'A?',desc:'Use capital letters, full stops and question marks.',learn:`<ul class="lesson-rules"><li><strong>Start a sentence with a capital letter.</strong> The dog ran away.</li><li><strong>Capitalize proper nouns.</strong> Alice, Paris, Microsoft.</li><li><strong>Capitalize days and months.</strong> Monday, October.</li><li><strong>Capitalize languages and nationalities.</strong> English, Spanish, French.</li><li><strong>Capitalize historical events and periods.</strong> World War II.</li><li><strong>Capitalize the main words in book, movie and song titles.</strong> Harry Potter and the Sorcerer's Stone.</li><li><strong>Capitalize a person's title before a name.</strong> President Lincoln, Doctor Smith, Aunt Lisa.</li><li><strong>Always capitalize I.</strong> I like to read.</li><li><strong>End a statement with a full stop (.).</strong> I like to play soccer.</li><li><strong>End a question with a question mark (?).</strong> What is your favorite color?</li></ul>`},
{id:'london',title:'London Landmarks',section:'Vocabulary',icon:'♜',desc:'Take a little trip around London.',learn:LANDMARKS.map(x=>x[0]).join(' · ')},
{id:'family',title:'Family Tree',section:'Vocabulary',icon:'♧',desc:'Meet the family. Find the connections.',learn:'mother · father · parents · son · daughter · brother · sister · husband · wife · grandfather · grandmother · grandparents · uncle · aunt · cousin'},
{id:'subject',title:'Subject Pronouns',section:'Grammar',icon:'We',desc:'I, you, he… who is it?',learn:'I · you · he · she · it · we · they'},
{id:'object',title:'Object Pronouns',section:'Grammar',icon:'us',desc:'Practice me, him, her and more.',learn:'me · you · him · her · it · us · them'},
{id:'be',title:'Verb to Be',section:'Grammar',icon:'am',desc:'Small words. Lots of possibilities!',learn:'I am · you are · he is · she is · it is · we are · they are<br>Negative: am not · is not / isn’t · are not / aren’t<br>Questions: Am I? · Are you? · Is he? · Is she? · Is it? · Are we? · Are they?'},
{id:'place',title:'Prepositions of Place',section:'Grammar',icon:'↔',desc:'Where is it? Look and discover.',learn:'in · on · under · next to · between · behind · in front of · opposite'}
];
function Q(prompt,answer,choices,visual){return {prompt,answer,choices,visual};}
function rows(list,pool){return list.map(([p,a])=>Q(p,a,pool));}
const SUBJECT=['I','you','he','she','it','we','they'],OBJECT=['me','you','him','her','it','us','them'];
const SENTENCE_PRACTICE=[
['maria is from spain and she speaks spanish','Maria is from Spain and she speaks Spanish.'],
['did you know that canada is very cold in january','Did you know that Canada is very cold in January?'],
['we are going to france in september','We are going to France in September.'],
['are you australian or from new zealand','Are you Australian or from New Zealand?'],
['i will meet my italian friends on saturday','I will meet my Italian friends on Saturday.'],
['mr. lee teaches us about chinese history','Mr. Lee teaches us about Chinese history.'],
['my cousin is visiting from brazil in may','My cousin is visiting from Brazil in May.'],
['i love japanese food','I love Japanese food.'],
['will david come to the meeting on tuesday','Will David come to the meeting on Tuesday?'],
['my family and i are traveling to mexico in december','My family and I are traveling to Mexico in December.'],
['olivia is learning french','Olivia is learning French.'],
['did you know that the cat in the hat was written by dr. seuss','Did you know that The Cat in the Hat was written by Dr. Seuss?'],
['i will visit australia in march','I will visit Australia in March.'],
['we are visiting canada in november','We are visiting Canada in November.'],
['are you going to the birthday party on friday','Are you going to the birthday party on Friday?'],
['my friend sophia is visiting from italy in august','My friend Sophia is visiting from Italy in August.'],
['the olympics will be held in france next july','The Olympics will be held in France next July.'],
['mr. jones gave us homework today','Mr. Jones gave us homework today.'],
['we are in september','We are in September.'],
['we went to the beach with aunt lisa on sunday','We went to the beach with Aunt Lisa on Sunday.']
];
const GAMES=[
{id:'fix-sentence',topic:'capitalization',title:'Capitalize and Punctuate',desc:'Read the sentence. Choose the version with correct capital letters and the correct ending.',questions:SENTENCE_PRACTICE.map(([prompt,answer])=>Q(prompt,answer,[answer,answer[0].toLowerCase()+answer.slice(1),answer.slice(0,-1)+(answer.endsWith('?')?'.':'?')]))},
{id:'sentence-ending',topic:'capitalization',title:'Full Stop or Question Mark?',desc:'Does the sentence tell you something or ask a question? Choose its ending.',questions:rows([
['I like to play soccer___','.'],['What is your favorite color___','?'],['The dog is barking___','.'],['Will David come on Tuesday___','?'],['We are in September___','.'],['Are you going to the party on Friday___','?'],['Olivia is learning French___','.'],['Did you know that Canada is cold in January___','?'],['My cousin is visiting in May___','.'],['Is this your English book___','?']],['.','?'])},
{id:'guess',topic:'london',title:'Guess the Landmark',desc:'Look at the picture. Choose its name.',questions:LANDMARKS.map(x=>Q('Which landmark, person or group is this?',x[0],LANDMARKS.map(l=>l[0]),'landmark:'+x[3]))},
{id:'who',topic:'london',title:'Who or What Am I?',desc:'Read a clue. Solve the mystery.',questions:LANDMARKS.map(x=>Q('“'+x[1]+'”',x[0],LANDMARKS.map(l=>l[0])))},
{id:'match',topic:'london',title:'Match the Landmark',desc:'Match each name to its description.',type:'match',questions:LANDMARKS.map(x=>Q(x[0],x[2],[]))},
{id:'tree',topic:'family',title:'Family Tree Quiz',desc:'Use the family tree to find the answer.',questions:[
Q('Who is Emma’s brother?','Tom',['Tom','Jack','Peter'],'tree'),Q('Who is Tom’s mother?','Anna',['Anna','Emily','Lily'],'tree'),Q('Anna is Peter’s ___.','wife',['wife','sister','daughter'],'tree'),Q('Jack is Emily’s ___.','husband',['husband','brother','son'],'tree'),Q('Who is Emma’s father?','Peter',['Peter','Jack','George'],'tree'),Q('Lily is Tom’s ___.','cousin',['cousin','sister','mother'],'tree'),Q('George is Emma’s ___.','grandfather',['grandfather','father','uncle'],'tree'),Q('Mary is Tom’s ___.','grandmother',['grandmother','mother','aunt'],'tree'),Q('Emily is Emma’s ___.','aunt',['aunt','sister','grandmother'],'tree'),Q('Jack is Tom’s ___.','uncle',['uncle','father','brother'],'tree'),Q('Emma is Anna’s ___.','daughter',['daughter','son','mother'],'tree'),Q('Tom is Peter’s ___.','son',['son','daughter','father'],'tree')]},
{id:'relationship',topic:'family',title:'Choose the Relationship',desc:'Read the clue. Find the family word.',questions:[
Q('My mother’s father is my ___.','grandfather',['grandfather','brother','cousin']),Q('My father’s sister is my ___.','aunt',['aunt','daughter','grandmother']),Q('My aunt’s son is my ___.','cousin',['cousin','uncle','brother']),Q('My mother and father are my ___.','parents',['parents','grandparents','cousin']),Q('My parents’ daughter is my ___.','sister',['sister','aunt','mother']),Q('My parents’ son is my ___.','brother',['brother','uncle','father']),Q('My father’s brother is my ___.','uncle',['uncle','son','husband']),Q('My father’s mother is my ___.','grandmother',['grandmother','sister','aunt']),Q('My grandfather and grandmother are my ___.','grandparents',['grandparents','parents','cousin']),Q('My mother is my father’s ___.','wife',['wife','daughter','sister'])]},
{id:'replace-subject',topic:'subject',title:'Replace the Subject',desc:'Choose a pronoun to replace the subject.',questions:rows([
['Peter is my brother. → ___ is my brother.','he'],['The book is interesting. → ___ is interesting.','it'],['Jack and I are at home. → ___ are at home.','we'],['My friends are here. → ___ are here.','they'],['Miss Smith is a teacher. → ___ is a teacher.','she'],['Tom is at school. → ___ is at school.','he'],['Emma is happy. → ___ is happy.','she'],['The dog is here. → ___ is here.','it'],['The boys are on the bus. → ___ are on the bus.','they'],['Mom and I are in London. → ___ are in London.','we']],SUBJECT)},
{id:'pronoun',topic:'subject',title:'Pronoun Challenge',desc:'Choose the pronoun for each person or group.',questions:rows([
['Sarah','she'],['Tom','he'],['the dog','it'],['Tom and Sam','they'],['Mom and I','we'],['the books','they'],['Emma','she'],['Peter','he'],['Speaking about myself','I'],['Speaking directly to a friend','you']],SUBJECT)},
{id:'replace-object',topic:'object',title:'Replace the Object',desc:'Choose the pronoun after the verb.',questions:rows([
['Emma is helping Tom. → Emma is helping ___.','him'],['Can you see Elsa? → Can you see ___?','her'],['Look at the boys. → Look at ___.','them'],['The girl is reading the letter. → The girl is reading ___.','it'],['Mom loves you and me. → Mom loves ___.','us'],['I can see the dog. → I can see ___.','it'],['Dad is helping Emma. → Dad is helping ___.','her'],['Anna is talking to Peter. → Anna is talking to ___.','him'],['The teacher helps the children. → The teacher helps ___.','them'],['Tom helps Emma and me. → Tom helps ___.','us'],['Mom is helping me. → Mom is helping ___.','me'],['I am talking to you. → I am talking to ___.','you']],OBJECT)},
{id:'subject-object',topic:'object',title:'Subject or Object Pronoun?',desc:'Look carefully. Which pronoun fits?',questions:[
Q('Peter is my friend. ___ is funny.','He',['He','Him']),Q('I can see Peter. I can see ___.','him',['he','him']),Q('Sarah is here. ___ is happy.','She',['She','Her']),Q('I am talking to Sarah. I am talking to ___.','her',['she','her']),Q('Tom and I are here. ___ are happy.','We',['We','Us']),Q('Mom helps Tom and me. Mom helps ___.','us',['we','us']),Q('The boys are at school. ___ are here.','They',['They','Them']),Q('I can see the boys. I can see ___.','them',['they','them']),Q('___ am from London.','I',['I','Me']),Q('Can you help ___?','me',['I','me'])]},
{id:'am-is-are',topic:'be',title:'Am / Is / Are',desc:'Fill the gap with am, is or are.',questions:rows([
['London ___ the capital of England.','is'],['I ___ from London.','am'],['They ___ on the bus.','are'],['She ___ happy.','is'],['We ___ at school.','are'],['You ___ in our class.','are'],['He ___ my brother.','is'],['It ___ a book.','is'],['I ___ tired.','am'],['The children ___ here.','are']],['am','is','are'])},
{id:'negative',topic:'be',title:'Make It Negative',desc:'Choose the correct negative sentence.',questions:[
Q('He is hungry.','He isn’t hungry.',['He isn’t hungry.','He aren’t hungry.','He am not hungry.']),Q('They are at school.','They aren’t at school.',['They aren’t at school.','They isn’t at school.','They am not at school.']),Q('I am tired.','I am not tired.',['I am not tired.','I isn’t tired.','I aren’t tired.']),Q('She is happy.','She is not happy.',['She is not happy.','She are not happy.','She am not happy.']),Q('We are on the bus.','We are not on the bus.',['We are not on the bus.','We is not on the bus.','We am not on the bus.']),Q('You are here.','You aren’t here.',['You aren’t here.','You isn’t here.','You am not here.']),Q('It is a book.','It isn’t a book.',['It isn’t a book.','It aren’t a book.','It am not a book.']),Q('Tom is from London.','Tom is not from London.',['Tom is not from London.','Tom are not from London.','Tom am not from London.']),Q('The boys are happy.','The boys aren’t happy.',['The boys aren’t happy.','The boys isn’t happy.','The boys am not happy.']),Q('I am at home.','I am not at home.',['I am not at home.','I is not at home.','I are not at home.'])]},
{id:'question',topic:'be',title:'Make a Question',desc:'Choose the correct question.',questions:[
Q('She is from Wales.','Is she from Wales?',['Is she from Wales?','Are she from Wales?','Am she from Wales?']),Q('They are from England.','Are they from England?',['Are they from England?','Is they from England?','Am they from England?']),Q('You are in our class.','Are you in our class?',['Are you in our class?','Is you in our class?','Am you in our class?']),Q('The teacher is British.','Is the teacher British?',['Is the teacher British?','Are the teacher British?','Am the teacher British?']),Q('I am happy.','Am I happy?',['Am I happy?','Is I happy?','Are I happy?']),Q('He is at home.','Is he at home?',['Is he at home?','Are he at home?','Am he at home?']),Q('It is a dog.','Is it a dog?',['Is it a dog?','Are it a dog?','Am it a dog?']),Q('We are at school.','Are we at school?',['Are we at school?','Is we at school?','Am we at school?']),Q('Tom is here.','Is Tom here?',['Is Tom here?','Are Tom here?','Am Tom here?']),Q('The books are on the table.','Are the books on the table?',['Are the books on the table?','Is the books on the table?','Am the books on the table?'])]},
{id:'where',topic:'place',title:'Where is it?',desc:'Look at the scene. Find the right place word.',questions:['in','on','under','next to','between','behind','in front of','opposite'].map(a=>Q(a==='between'?'The ball is ___ the two boxes.':a==='opposite'?'The ball is ___ the box, across the gap.':'The ball is ___ the box.',a,['in','on','under','next to','between','behind','in front of','opposite'],'position:'+a))},
{id:'position-sentences',topic:'place',title:'Choose the Correct Sentence',desc:'Look at the picture. Choose the sentence that describes the ball.',questions:[
Q('Which sentence describes the picture?','The ball is in the box.',['The ball is in the box.','The ball is on the box.','The ball is under the box.'],'position:in'),
Q('Which sentence describes the picture?','The ball is on the box.',['The ball is on the box.','The ball is in the box.','The ball is next to the box.'],'position:on'),
Q('Which sentence describes the picture?','The ball is under the box.',['The ball is under the box.','The ball is on the box.','The ball is in front of the box.'],'position:under'),
Q('Which sentence describes the picture?','The ball is next to the box.',['The ball is next to the box.','The ball is in the box.','The ball is on the box.'],'position:next to'),
Q('Which sentence describes the picture?','The ball is between the two boxes.',['The ball is between the two boxes.','The ball is on a box.','The ball is in a box.'],'position:between'),
Q('Which sentence describes the picture?','The ball is behind the box.',['The ball is behind the box.','The ball is in front of the box.','The ball is next to the box.'],'position:behind'),
Q('Which sentence describes the picture?','The ball is in front of the box.',['The ball is in front of the box.','The ball is behind the box.','The ball is under the box.'],'position:in front of'),
Q('Which sentence describes the picture?','The ball is opposite the box, across the gap.',['The ball is opposite the box, across the gap.','The ball is in the box.','The ball is on the box.'],'position:opposite'),
Q('Is the ball in or on the box?','The ball is in the box.',['The ball is in the box.','The ball is on the box.','The ball is under the box.'],'position:in'),
Q('Is the ball behind or in front of the box?','The ball is in front of the box.',['The ball is in front of the box.','The ball is behind the box.','The ball is between two boxes.'],'position:in front of')]}

];
if(typeof module!=='undefined')module.exports={LANDMARKS,TOPICS,GAMES};
