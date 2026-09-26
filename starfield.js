function initStarfield(){
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let w,h,stars=[],shooting=[];
  function resize(){ w=canvas.width=innerWidth; h=canvas.height=innerHeight;
    stars = Array.from({length:220}, () => ({
      x:Math.random()*w, y:Math.random()*h, r:Math.random()*1.5+0.3,
      phase:Math.random()*Math.PI*2, speed:0.3+Math.random()*0.9,
      hue: Math.random()<0.15 ? '190,220,255' : '255,255,255'
    }));
  }
  window.addEventListener('resize', resize); resize();
  function maybeShoot(){
    if(Math.random() < 0.005 && shooting.length < 2){
      shooting.push({x:Math.random()*w*0.6, y:Math.random()*h*0.35, len:0,
        angle:Math.PI/4+Math.random()*0.3, alpha:1});
    }
  }
  let t=0;
  function tick(){
    t += 0.016;
    ctx.clearRect(0,0,w,h);
    stars.forEach(s => {
      const tw = 0.5 + 0.5*Math.sin(t*s.speed + s.phase);
      ctx.fillStyle = `rgba(${s.hue},${(0.2 + tw*0.7).toFixed(2)})`;
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
    });
    maybeShoot();
    shooting.forEach(sh => {
      sh.len += 9; sh.alpha -= 0.018;
      const x2 = sh.x + Math.cos(sh.angle)*sh.len, y2 = sh.y + Math.sin(sh.angle)*sh.len;
      const grad = ctx.createLinearGradient(sh.x,sh.y,x2,y2);
      grad.addColorStop(0,'rgba(255,255,255,0)');
      grad.addColorStop(1,`rgba(255,235,250,${Math.max(sh.alpha,0)})`);
      ctx.strokeStyle = grad; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(sh.x,sh.y); ctx.lineTo(x2,y2); ctx.stroke();
    });
    shooting = shooting.filter(sh => sh.alpha > 0);
    requestAnimationFrame(tick);
  }
  tick();
}
document.addEventListener('DOMContentLoaded', initStarfield);
