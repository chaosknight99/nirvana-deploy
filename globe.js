(async function(){
  let manifest = [];
  try{
    manifest = await (await fetch('./manifest.json')).json();
  }catch(e){
    document.getElementById('globeStage').innerHTML = '<p style="color:#c99">Could not load manifest.json</p>';
    return;
  }

  const globe = document.getElementById('globe');
  const R = 190;
  const N = manifest.length;
  const nodes = manifest.map((rm, i) => {
    // Fibonacci sphere distribution
    const y = 1 - (i/(N-1||1))*2;
    const radiusAtY = Math.sqrt(1-y*y);
    const theta = 2.399963 * i;
    const x = Math.cos(theta)*radiusAtY, z = Math.sin(theta)*radiusAtY;
    const el = document.createElement('div');
    el.className = 'node';
    el.innerHTML = `<div class="dot" style="--c:${rm.color||'#57e0c9'}"></div><div class="label">${rm.title}</div>`;
    el.addEventListener('click', () => location.href = `roadmap.html?src=roadmaps/${rm.file}`);
    globe.appendChild(el);
    return {el, x:x*R, y:y*R, z:z*R};
  });

  let rotY = 0, rotX = -10, velX = 0, velY = 0.08;
  let dragging = false, lastX=0, lastY=0;
  const stage = document.getElementById('globeStage');

  stage.addEventListener('mousedown', e => { dragging=true; lastX=e.clientX; lastY=e.clientY; velY=0; });
  window.addEventListener('mouseup', () => { dragging=false; });
  window.addEventListener('mousemove', e => {
    if(!dragging) return;
    velY = (e.clientX - lastX) * 0.3;
    velX = (e.clientY - lastY) * 0.3;
    rotY += velY; rotX -= velX;
    lastX=e.clientX; lastY=e.clientY;
  });
  stage.addEventListener('touchstart', e => { dragging=true; lastX=e.touches[0].clientX; lastY=e.touches[0].clientY; velY=0; });
  window.addEventListener('touchend', () => dragging=false);
  window.addEventListener('touchmove', e => {
    if(!dragging) return;
    const t = e.touches[0];
    velY = (t.clientX-lastX)*0.3; velX=(t.clientY-lastY)*0.3;
    rotY += velY; rotX -= velX; lastX=t.clientX; lastY=t.clientY;
  });

  function frame(){
    if(!dragging){ rotY += velY; velY *= 0.995; if(Math.abs(velY) < 0.05) velY = 0.08; }
    const rad = deg => deg*Math.PI/180;
    nodes.forEach(n => {
      const cosY = Math.cos(rad(rotY)), sinY = Math.sin(rad(rotY));
      const x1 = n.x*cosY - n.z*sinY, z1 = n.x*sinY + n.z*cosY;
      const cosX = Math.cos(rad(rotX)), sinX = Math.sin(rad(rotX));
      const y1 = n.y*cosX - z1*sinX, z2 = n.y*sinX + z1*cosX;
      const scale = 420/(420 - z2);
      n.el.style.transform = `translate3d(${x1}px, ${y1}px, 0) scale(${scale})`;
      n.el.style.zIndex = Math.round(z2 + 1000);
      n.el.style.opacity = 0.35 + 0.65*((z2 + R)/(2*R));
    });
    requestAnimationFrame(frame);
  }
  frame();
})();
