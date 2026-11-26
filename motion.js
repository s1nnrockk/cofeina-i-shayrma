const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduceMotion){
 const bar=document.createElement('div');bar.className='reading-progress';document.body.appendChild(bar);
 let ticking=false;const update=()=>{const max=document.documentElement.scrollHeight-innerHeight;bar.style.transform='scaleX('+ (max>0?scrollY/max:0)+')';ticking=false;};
 addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(update);ticking=true;}},{passive:true});update();
 const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('motion-in');reveal.unobserve(e.target);}}),{threshold:.12});
 document.querySelectorAll('main section,.menu-card,.info-panel,.visit-card,.map-card,.cta-panel,.story-visual,.story-copy').forEach(el=>{el.classList.add('motion-reveal');reveal.observe(el);});
 document.querySelectorAll('.menu-card,.visit-card,.info-panel').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.setProperty('--tilt-x',(-y*2)+'deg');el.style.setProperty('--tilt-y',(x*2)+'deg');});el.addEventListener('pointerleave',()=>{el.style.setProperty('--tilt-x','0deg');el.style.setProperty('--tilt-y','0deg');});});
}
