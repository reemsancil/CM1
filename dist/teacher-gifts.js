window.TeacherGifts=(()=>{
 let awards=[],available=false,generation=0;
 const status=()=>document.querySelector('#gift-teacher-status');
 function clear(){generation++;awards=[];available=false;if(status())status().textContent='';}
 async function load(token){const run=++generation;available=false;try{const data=await ResultsAPI.teacherGifts(token);if(run!==generation)return;awards=data;available=true;status().textContent='';}catch{if(run!==generation)return;awards=[];status().textContent='Gift service unavailable. The certificate database may still need setup.';}}
 function button(name,section,rows,getToken){const student=UnitProgress.students(rows).find(s=>UnitProgress.key(s.name,s.section)===UnitProgress.key(name,section));if(!student?.eligible)return null;
 const holder=document.createElement('span');holder.className='teacher-gift';
 const award=awards.find(a=>UnitProgress.key(a.student_name,a.class_section)===UnitProgress.key(name,section));
 if(award){holder.textContent=award.opened_at?'🏅 Certificate collected':'🎁 Gift sent';return holder;}
 const b=document.createElement('button');b.type='button';b.className='send-gift';b.textContent='Send gift 🎁';b.disabled=!available;holder.append(b);
 b.onclick=async event=>{event.preventDefault();event.stopPropagation();const run=generation;b.disabled=true;status().textContent='Sending gift…';try{const token=await getToken();if(run!==generation||!token)return;const sent=await ResultsAPI.sendGift(name,section,token);if(run!==generation)return;awards.push(sent);holder.textContent='🎁 Gift sent';status().textContent=`Gift sent to ${name}!`;}
 catch{if(run===generation){b.disabled=false;status().textContent='Could not send the gift. Refresh results and try again.';}}};return holder;}
 function renderList(rows,getToken){const list=document.querySelector('#gift-students');list.replaceChildren();for(const student of UnitProgress.students(rows)){const row=document.createElement('div');row.className='gift-student';const label=document.createElement('span');label.textContent=`${student.name} · ${student.section} · ${student.count} / ${student.total} games`;row.append(label);const action=button(student.name,student.section,rows,getToken);if(action)row.append(action);list.append(row);}}
 return {load,clear,button,renderList};
})();
