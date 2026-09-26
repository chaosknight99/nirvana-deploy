(async function(){
  const params = new URLSearchParams(location.search);
  const src = params.get('src') || 'roadmaps/ai-engineering.md';
  let meta, milestones;
  try{
    ({meta, milestones} = await loadRoadmap(src));
  }catch(e){
    document.getElementById('rmTitle').textContent = 'Roadmap not found';
    document.getElementById('rmTagline').textContent = src;
    return;
  }
  layoutRoadmap(milestones);
  const allChildren = milestones.flatMap(m => m.children);
  const allNodes = [...milestones, ...allChildren];
  const nodeId = (n) => n.id || (n.id = (n.parent ? n.parent.name : n.name).replace(/\W+/g,'-').toLowerCase() + (n.parent ? '-' + n.name.replace(/\W+/g,'-').toLowerCase() : ''));
  allNodes.forEach(nodeId);

  document.title = (meta.title || 'Roadmap') + ' — ATLAS Conquest';
  document.getElementById('rmTitle').textContent = meta.title || 'Untitled Roadmap';
  document.getElementById('rmTagline').textContent = meta.tagline || '';
  document.getElementById('pageTitle').textContent = meta.title || '';
  const accent = meta.color || '#57e0c9', accent2 = meta.accent || '#b98bf0';
  document.documentElement.style.setProperty('--accent', accent);
  document.documentElement.style.setProperty('--accent2', accent2);
  const ranks = (meta.ranks || 'Beginner|Practitioner|Specialist|Expert|Master').split('|').map(s=>s.trim());

  const STORAGE_KEY = 'conquest:' + (meta.slug || src);
  const load = () => new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
  const save = (s) => localStorage.setItem(STORAGE_KEY, JSON.stringify([...s]));
  let conquered = load();
  let selectedId = null;

  const svg = document.getElementById('map');
  const ns = 'http://www.w3.org/2000/svg';
  const byId = (id) => allNodes.find(n => nodeId(n) === id);

  function render(){
    svg.innerHTML = '';
    milestones.forEach((m,i) => {
      if(i === 0) return;
      const prev = milestones[i-1];
      const line = document.createElementNS(ns,'line');
      line.setAttribute('x1',prev.x); line.setAttribute('y1',prev.y);
      line.setAttribute('x2',m.x); line.setAttribute('y2',m.y);
      line.setAttribute('class','conline' + (conquered.has(nodeId(prev)) && conquered.has(nodeId(m)) ? ' on':''));
      svg.appendChild(line);
    });
    milestones.forEach(m => m.children.forEach(c => {
      const line = document.createElementNS(ns,'line');
      line.setAttribute('x1',m.x); line.setAttribute('y1',m.y);
      line.setAttribute('x2',c.x); line.setAttribute('y2',c.y);
      line.setAttribute('class','childline' + (conquered.has(nodeId(c)) ? ' on':''));
      svg.appendChild(line);
    }));
    allNodes.forEach(n => {
      const isSub = !!n.parent;
      const id = nodeId(n);
      const g = document.createElementNS(ns,'g');
      g.setAttribute('class','starnode' + (isSub?' sub':'') + (conquered.has(id)?' on':'') + (n.capstone?' capstone':'') + (id===selectedId?' selected':''));
      const glow = document.createElementNS(ns,'circle');
      glow.setAttribute('class','glow'); glow.setAttribute('cx',n.x); glow.setAttribute('cy',n.y);
      glow.setAttribute('r', n.capstone?34:(isSub?10:20));
      const core = document.createElementNS(ns,'circle');
      core.setAttribute('class','core'); core.setAttribute('cx',n.x); core.setAttribute('cy',n.y);
      core.setAttribute('r', n.capstone?9:(isSub?3.2:6));
      const label = document.createElementNS(ns,'text');
      label.textContent = n.name;
      label.setAttribute('x',n.x); label.setAttribute('y', n.y - (n.capstone?18:(isSub?9:13)));
      label.setAttribute('text-anchor','middle');
      g.appendChild(glow); g.appendChild(core); g.appendChild(label);
      g.addEventListener('click', () => selectStar(id));
      svg.appendChild(g);
    });
    updateStats();
  }

  function selectStar(id){
    selectedId = id;
    const n = byId(id);
    document.getElementById('detailName').textContent = n.name;
    document.getElementById('detailDesc').textContent = n.desc || '';
    document.getElementById('toggleBtn').textContent = conquered.has(id) ? 'Unconquer' : 'Mark Conquered';
    render();
  }

  document.getElementById('toggleBtn').addEventListener('click', () => {
    if(!selectedId) return;
    conquered.has(selectedId) ? conquered.delete(selectedId) : conquered.add(selectedId);
    save(conquered); selectStar(selectedId);
  });
  document.getElementById('resetBtn').addEventListener('click', () => {
    if(confirm('Reset progress for this roadmap?')){
      conquered = new Set(); save(conquered); selectedId = null;
      document.getElementById('detailName').textContent = 'Select a star';
      document.getElementById('detailDesc').textContent = "Click any star to see what it represents.";
      render();
    }
  });

  const RING_CIRC = 326.7;
  function updateStats(){
    const total = allNodes.length, count = conquered.size, pct = total ? count/total : 0;
    document.getElementById('conqueredCount').textContent = count;
    document.getElementById('totalCount').textContent = total;
    document.getElementById('ringFill').style.strokeDashoffset = (RING_CIRC * (1-pct)).toFixed(1);
    const rankIdx = Math.min(ranks.length-1, Math.floor(pct * ranks.length));
    document.getElementById('rankTitle').textContent = conquered.has(nodeId(milestones[milestones.length-1])) ? ranks[ranks.length-1] + ' ★' : ranks[rankIdx];
    document.documentElement.style.setProperty('--aura', pct.toFixed(3));
  }

  render();

  const wrap = document.getElementById('mapWrap'), map = document.getElementById('map');
  wrap.addEventListener('mousemove', (e) => {
    const r = wrap.getBoundingClientRect();
    const px = (e.clientX-r.left)/r.width - 0.5, py=(e.clientY-r.top)/r.height - 0.5;
    map.style.transform = `rotateY(${px*6}deg) rotateX(${-py*6}deg)`;
  });
  wrap.addEventListener('mouseleave', () => map.style.transform = 'rotateY(0) rotateX(0)');
})();
