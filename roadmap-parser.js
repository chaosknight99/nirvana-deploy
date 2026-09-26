/* Roadmap markdown convention:
---
title: My Roadmap
slug: my-roadmap
color: #57e0c9
accent: #b98bf0
tagline: A short subtitle
ranks: Beginner | Practitioner | Specialist | Expert | Master
---
## Milestone Name
One-line description of the milestone.
- Subtopic Name: subtopic description
- Another Subtopic: description
## Next Milestone
...
(The LAST ## milestone is treated as the capstone.)
*/
async function loadRoadmap(url){
  const res = await fetch(url);
  if(!res.ok) throw new Error('Could not load roadmap: ' + url);
  const text = await res.text();
  let meta = {}, body = text;
  const fm = text.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?/);
  if(fm){
    body = text.slice(fm[0].length);
    fm[1].split(/\r?\n/).forEach(line => {
      const m = line.match(/^(\w+):\s*(.+)$/);
      if(m) meta[m[1].trim()] = m[2].trim();
    });
  }
  const milestones = [];
  let current = null;
  body.split(/\r?\n/).forEach(line => {
    const h2 = line.match(/^##\s+(.+)/);
    const bullet = line.match(/^-\s+(.+?):\s*(.+)/);
    if(h2){ current = {name:h2[1].trim(), desc:'', children:[]}; milestones.push(current); }
    else if(bullet && current){ current.children.push({name:bullet[1].trim(), desc:bullet[2].trim()}); }
    else if(current && line.trim() && !current.desc){ current.desc = line.trim(); }
  });
  if(milestones.length) milestones[milestones.length-1].capstone = true;
  return {meta, milestones};
}

/* Auto-layout: places milestones along a rising, zigzagging path so any
   roadmap length lays out sensibly without hand-placed coordinates. */
function layoutRoadmap(milestones){
  const N = milestones.length || 1;
  const marginX = 80, spanX = 1000 - marginX*2;
  milestones.forEach((m,i) => {
    const t = N > 1 ? i/(N-1) : 0;
    m.x = marginX + t*spanX;
    m.y = 480 - t*280 + Math.sin(i*1.7)*55;
    m.children.forEach((c,ci) => {
      const baseAngle = (i*53) % 360;
      const angle = (baseAngle + ci*(360/m.children.length) + 20) * Math.PI/180;
      const r = 44;
      c.x = m.x + Math.cos(angle)*r;
      c.y = m.y + Math.sin(angle)*r;
      c.parent = m;
    });
  });
}
