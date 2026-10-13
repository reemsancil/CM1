window.UnitProgress = (() => {
 const normalize=name=>String(name).trim().replace(/\s+/g,' ').toLowerCase();
 const key=(name,section)=>JSON.stringify([normalize(name),section]);
 const requiredFor=section=>GiftConfig.catalog[section.split(' ')[0]]||[];
 function students(rows){const groups=new Map();for(const row of rows){if(!GiftConfig.allSections.includes(row.class_section))continue;const id=key(row.student_name,row.class_section);if(!groups.has(id))groups.set(id,{name:row.student_name.trim(),section:row.class_section,completed:new Set(),required:requiredFor(row.class_section)});const student=groups.get(id);const index=student.required.findIndex(r=>row.game===r.game&&row.exercise===r.exercise);if(index>=0&&Number(row.total)>0&&Number(row.score)>=0)student.completed.add(index);}return [...groups.values()].map(s=>({...s,count:s.completed.size,total:s.required.length,eligible:s.required.length>0&&s.completed.size===s.required.length}));}
 return {normalize,key,requiredFor,students};
})();
