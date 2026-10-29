// Original practice activities based on the language in the uploaded worksheets.
TOPICS.find(t=>t.id==='directions').locked=false;
const directionWords=['turn left','turn right','go straight on','stop','make a U-turn','cross the road','go past','go round the roundabout'];
GAMES.push(
{id:'directions-signs',topic:'directions',title:'Direction Detectives',desc:'Look at the sign or clue. Choose the direction.',questions:[
...['turn left','turn right','go straight on','stop','make a U-turn'].map((a,i)=>Q('What should you do?',a,directionWords,'direction:'+['↰','↱','↑','STOP','↶'][i])),
Q('Walk from one side of the road to the other.','cross the road',directionWords),
Q('Continue beyond the school without stopping there.','go past',directionWords),
Q('Follow the circular road around the island.','go round the roundabout',directionWords),
Q('Turn into the second street on your left.','take the second left',['take the second left','take the first left','take the second right']),
Q('Leave the roundabout at exit number two.','take the second exit',['take the second exit','make a U-turn','take the third left']),
Q('Walk on the path beside the road.','the pavement',['the pavement','a bridge','a roundabout']),
Q('Use the marked black-and-white crossing.','a zebra crossing',['a zebra crossing','a bridge','a roundabout'])]},
{id:'directions-words',topic:'directions',title:'Complete the Directions',desc:'Choose the missing word.',questions:rows([
['Go ___ on.','straight'],['___ past the traffic lights.','Go'],['The library is ___ the left.','on'],['___ the roundabout, turn left.','At'],['___ the first left onto Green Street.','Take'],['Go ___ the school without stopping.','past'],['Take the ___ right: pass the first street and turn at the next one.','second'],['Use the zebra crossing to ___ the road.','cross'],['Go ___ the tunnel to the other side.','through'],['Make a U-turn and go ___.','back']
],['straight','Go','on','At','Take','past','second','cross','through','back'])},
{id:'directions-route',topic:'directions',title:'Town Trail',desc:'Use our practice map. Start at START for every question. Up is north; begin facing north.',questions:[
Q('Go straight on. Stop at the first junction. Where are you?','Library',['Library','School','Park'],'direction-map'),
Q('Go straight on. At the first junction, turn left. Go to the end.','School',['School','Park','Museum'],'direction-map'),
Q('Go straight on. At the first junction, turn right. Go to the end.','Park',['Park','School','Museum'],'direction-map'),
Q('Go straight past the library. Stop at the next junction.','Museum',['Museum','Library','School'],'direction-map'),
Q('Go straight past the library. At the museum junction, turn left. Go to the end.','Sports centre',['Sports centre','Theatre','Park'],'direction-map'),
Q('Go straight past the library. At the museum junction, turn right. Go to the end.','Theatre',['Theatre','Sports centre','School'],'direction-map'),
Q('How do you get to the park from START?','Turn right at the first junction.',['Turn right at the first junction.','Turn left at the first junction.','Turn left at the second junction.'],'direction-map'),
Q('How do you get to the sports centre from START?','Turn left at the second junction.',['Turn left at the second junction.','Turn right at the first junction.','Turn right at the second junction.'],'direction-map')]
});
