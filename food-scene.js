// Resilient 3D food showcase. Try multiple public ESM CDNs so one blocked host does not blank the scene.
let THREE;
const moduleSources=[
 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js',
 'https://unpkg.com/three@0.160.0/build/three.module.js',
 'https://esm.sh/three@0.160.0'
];
let importError;
for(const source of moduleSources){try{THREE=await import(source);break;}catch(error){importError=error;}}
const root=document.querySelector('[data-food-scene]');
if(root){
 const status=root.querySelector('[data-scene-status]');
 const showError=message=>{if(status){status.hidden=false;status.innerHTML='Не удалось загрузить 3D-модель.<span>'+message+'</span>';status.style.color='#9b3829';}};
 if(!THREE){
  // Offline-safe illustrated 3D fallback: works even when every external CDN is blocked.
  const canvas=root.querySelector('canvas'),ctx=canvas.getContext('2d');
  if(!ctx){showError('Браузер не смог создать графическую сцену.');}
  else{
    const products=[{name:'Шаурма',desc:'Объёмная демонстрационная модель шаурмы.'},{name:'Капучино',desc:'Объёмная демонстрационная модель чашки кофе.'},{name:'Картофель фри',desc:'Объёмная демонстрационная модель картофеля фри.'}];
    let active=0,angle=0,drag=false,lastX=0;
    function resize(){const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.max(1,Math.round(r.width*d));canvas.height=Math.max(1,Math.round(r.height*d));}
    if('ResizeObserver'in window)new ResizeObserver(resize).observe(canvas);else addEventListener('resize',resize);resize();
    function ellipse(x,y,rx,ry,fill){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill();}
    function rounded(x,y,w,h,r,fill){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill();}
    function drawShawarma(cx,cy,scale){
      ctx.save();ctx.translate(cx,cy);ctx.rotate(Math.sin(angle)*.18);
      ctx.shadowColor='#59412a55';ctx.shadowBlur=28;ctx.shadowOffsetY=20;
      const wrap=ctx.createLinearGradient(-90,0,90,0);wrap.addColorStop(0,'#a85e2d');wrap.addColorStop(.22,'#f1c77f');wrap.addColorStop(.65,'#dca45b');wrap.addColorStop(1,'#92502a');
      ctx.beginPath();ctx.moveTo(-92,-142);ctx.quadraticCurveTo(-78,-168,0,-162);ctx.quadraticCurveTo(84,-165,94,-130);ctx.lineTo(72,137);ctx.quadraticCurveTo(0,177,-76,132);ctx.closePath();ctx.fillStyle=wrap;ctx.fill();
      ctx.shadowColor='transparent';ctx.fillStyle='#f7d99a';ctx.beginPath();ctx.ellipse(0,-143,88,23,0,0,Math.PI*2);ctx.fill();
      for(let i=0;i<18;i++){const x=Math.sin(i*12.7)*58,y=-143+(i%4)*13;ctx.fillStyle=['#6c8c42','#bd4932','#f2e8c9','#8b542e'][i%4];ctx.beginPath();ctx.ellipse(x,y,10,5,Math.sin(i)*.6,0,Math.PI*2);ctx.fill();}
      ctx.strokeStyle='#9c5a2c';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(-72,-85);ctx.quadraticCurveTo(-25,-55,62,-75);ctx.stroke();
      ctx.restore();
    }
    function drawCoffee(cx,cy){
      ctx.save();ctx.translate(cx,cy);ctx.rotate(Math.sin(angle)*.12);
      ctx.shadowColor='#59412a55';ctx.shadowBlur=25;ctx.shadowOffsetY=18;
      const cup=ctx.createLinearGradient(-75,0,75,0);cup.addColorStop(0,'#b9a58a');cup.addColorStop(.22,'#fff8e9');cup.addColorStop(.72,'#e9dcc6');cup.addColorStop(1,'#a18c70');
      ctx.beginPath();ctx.moveTo(-70,-95);ctx.lineTo(-53,115);ctx.quadraticCurveTo(0,137,53,115);ctx.lineTo(70,-95);ctx.closePath();ctx.fillStyle=cup;ctx.fill();
      ctx.shadowColor='transparent';ctx.strokeStyle='#fff9ed';ctx.lineWidth=15;ctx.beginPath();ctx.ellipse(0,-93,72,17,0,0,Math.PI*2);ctx.stroke();
      ctx.fillStyle='#4b281b';ctx.beginPath();ctx.ellipse(0,-93,58,12,0,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='#d9a46c';ctx.lineWidth=5;ctx.beginPath();ctx.arc(-5,-94,20,0,Math.PI*2);ctx.stroke();
      ctx.strokeStyle='#f8f0df';ctx.lineWidth=17;ctx.beginPath();ctx.ellipse(68,-6,32,43,-.1,-1.2,1.2);ctx.stroke();
      ctx.fillStyle='#d8c5a9';ctx.beginPath();ctx.ellipse(0,124,83,18,0,0,Math.PI*2);ctx.fill();
      ctx.restore();
      ctx.save();ctx.strokeStyle='#fff8e8aa';ctx.lineWidth=5;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(-35+i*35,-150);ctx.bezierCurveTo(-55+i*35,-190,-5+i*35,-190,-25+i*35,-225);ctx.stroke();}ctx.restore();
    }
    function drawFries(cx,cy){
      ctx.save();ctx.translate(cx,cy);ctx.rotate(Math.sin(angle)*.16);
      ctx.shadowColor='#59412a55';ctx.shadowBlur=25;ctx.shadowOffsetY=18;
      const box=ctx.createLinearGradient(-80,0,80,0);box.addColorStop(0,'#8e2922');box.addColorStop(.5,'#e14b36');box.addColorStop(1,'#a62f27');
      ctx.beginPath();ctx.moveTo(-90,-65);ctx.lineTo(-60,125);ctx.quadraticCurveTo(0,150,60,125);ctx.lineTo(90,-65);ctx.closePath();ctx.fillStyle=box;ctx.fill();
      ctx.shadowColor='transparent';
      for(let i=0;i<13;i++){const x=-67+i*11,y=-155+(i%4)*12;ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(i*8)*.16);const fry=ctx.createLinearGradient(-7,0,8,0);fry.addColorStop(0,'#b8742e');fry.addColorStop(.35,'#ffd77c');fry.addColorStop(1,'#d99a43');rounded(-7,0,14,145-(i%3)*10,7,fry);ctx.restore();}
      ctx.restore();
    }
    function draw(){const w=canvas.width,h=canvas.height,d=Math.min(devicePixelRatio||1,1.5);ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,w,h);ctx.save();ctx.scale(d,d);const cw=w/d,ch=h/d,cx=cw/2,cy=ch*.52,scale=Math.min(cw/420,ch/430,1.2);ctx.translate(cx,cy);ctx.scale(scale,scale);
      const glow=ctx.createRadialGradient(0,0,20,0,0,240);glow.addColorStop(0,'#fff9e9');glow.addColorStop(1,'#d9c5a500');ellipse(0,25,230,245,glow);ellipse(0,170,135,25,'#79604422');
      if(active===0)drawShawarma(0,0);else if(active===1)drawCoffee(0,0);else drawFries(0,0);
      ctx.restore();angle+=drag?0:.006;requestAnimationFrame(draw);}
    function setProduct(i){active=(i+products.length)%products.length;root.querySelectorAll('[data-product]').forEach((b,n)=>{b.classList.toggle('is-active',n===active);b.setAttribute('aria-pressed',String(n===active));});root.querySelector('[data-product-name]').textContent=products[active].name;root.querySelector('[data-product-description]').textContent=products[active].desc;}
    root.querySelectorAll('[data-product]').forEach((b,i)=>b.addEventListener('click',()=>setProduct(i)));
    root.querySelector('[data-prev]').addEventListener('click',()=>setProduct(active-1));root.querySelector('[data-next]').addEventListener('click',()=>setProduct(active+1));
    canvas.addEventListener('pointerdown',e=>{drag=true;lastX=e.clientX;canvas.setPointerCapture(e.pointerId);});
    canvas.addEventListener('pointermove',e=>{if(drag){angle+=(e.clientX-lastX)*.008;lastX=e.clientX;}});
    const stop=()=>drag=false;canvas.addEventListener('pointerup',stop);canvas.addEventListener('pointercancel',stop);
    setProduct(0);if(status)status.hidden=true;draw();
  }
}
 else try{
  const canvas=root.querySelector('canvas');
  const scene=new THREE.Scene();scene.background=new THREE.Color('#eadcc7');
  const camera=new THREE.PerspectiveCamera(35,1,.1,100);camera.position.set(0,.65,5.2);camera.lookAt(0,0,0);
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;
  scene.add(new THREE.HemisphereLight(0xfff3df,0x76604a,2.25));
  const key=new THREE.DirectionalLight(0xffedcf,3.4);key.position.set(-3,5,4);key.castShadow=true;key.shadow.mapSize.set(1024,1024);scene.add(key);
  const rim=new THREE.DirectionalLight(0xff7655,1.8);rim.position.set(3,2,-3);scene.add(rim);
  const fill=new THREE.PointLight(0xffffff,1.2,8);fill.position.set(2,1,3);scene.add(fill);
  const floor=new THREE.Mesh(new THREE.CircleGeometry(3.2,64),new THREE.MeshStandardMaterial({color:'#d8c8ad',roughness:.92}));floor.rotation.x=-Math.PI/2;floor.position.y=-1.05;floor.receiveShadow=true;scene.add(floor);
  const stage=new THREE.Group();scene.add(stage);
  const mat=(color,roughness=.55,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
  const bread=mat('#d7a45e',.82),toasted=mat('#9a572d',.8),cream=mat('#f3e8d2',.3),green=mat('#638044',.7),red=mat('#bd4932',.65),white=mat('#fff8e9',.22),cupMat=mat('#f8f0df',.2);
  function add(g,m,x=0,y=0,z=0,rx=0,ry=0,rz=0,parent=stage){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.rotation.set(rx,ry,rz);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
  function clear(){while(stage.children.length){const o=stage.children[0];stage.remove(o);o.traverse?.(part=>{part.geometry?.dispose();});}}
  function makeShawarma(){
   const group=new THREE.Group();stage.add(group);group.rotation.z=-.13;
   const body=add(new THREE.CylinderGeometry(.52,.38,1.95,64),bread,0,-.02,0,0,0,-.1,group);
   add(new THREE.SphereGeometry(.48,48,32),cream,0,.91,0,0,0,0,group).scale.y=.18;
   for(let i=0;i<24;i++){const a=i*2.399,r=.12+(i%4)*.085;const strip=add(new THREE.SphereGeometry(.085+(i%3)*.012,12,10),i%3===0?green:i%3===1?red:toasted,Math.cos(a)*r,.93+(i%3)*.025,Math.sin(a)*r,0,0,0,group);strip.scale.set(1.3,.45,.8);}
   for(let i=0;i<8;i++){const fold=add(new THREE.TorusGeometry(.44,.035,8,48,1.15),toasted,0,-.62+i*.17,0,Math.PI/2,i*.9,0,group);}
   add(new THREE.CylinderGeometry(.4,.27,.68,48,1,true),cream,0,-.64,0,0,0,-.1,group);
  }
  function makeCoffee(){
   add(new THREE.CylinderGeometry(.86,.82,.09,64),white,0,-.91);
   const cup=add(new THREE.LatheGeometry([[.38,-.55],[.43,-.48],[.54,.18],[.5,.28],[.39,.25],[.34,-.42]].map(p=>new THREE.Vector2(...p)),64),cupMat,0,-.25);
   add(new THREE.CircleGeometry(.43,64),mat('#4b281b',.18),0,.035,0,-Math.PI/2);
   add(new THREE.TorusGeometry(.18,.018,8,48),mat('#c78c4d',.28),-.08,.04,.05,Math.PI/2);
   add(new THREE.TorusGeometry(.27,.075,16,48),cupMat,.49,-.18,0,0,Math.PI/2);
   for(let i=0;i<3;i++){const steam=add(new THREE.TorusKnotGeometry(.045,.012,48,8,2,3),new THREE.MeshBasicMaterial({color:'#fff8e8',transparent:true,opacity:.6}),-.16+i*.16,.55+(i%2)*.12,0);steam.userData.steam=i;}
  }
  function makeFries(){
   add(new THREE.CylinderGeometry(.52,.36,1.05,5,1,true),red,0,-.48,0,0,.3);
   add(new THREE.TorusGeometry(.48,.035,10,5),white,0,.03,0,Math.PI/2);
   for(let i=0;i<15;i++){const a=i*2.4,r=.08+(i%3)*.1;const fry=add(new THREE.BoxGeometry(.12,.95+(i%4)*.09,.12),bread,Math.cos(a)*r,.45+(i%3)*.04,Math.sin(a)*r,(Math.random()-.5)*.18,0,(Math.random()-.5)*.24); }
  }
  const products=[
   {id:'shawarma',name:'Шаурма',desc:'Горячий перекус в тонком лаваше. Состав, размер и доступные варианты уточняйте у сотрудников.',make:makeShawarma},
   {id:'coffee',name:'Капучино',desc:'Кофейная пауза с мягкой молочной пеной. Объём и наличие напитка уточняйте перед заказом.',make:makeCoffee},
   {id:'fries',name:'Картофель фри',desc:'Золотистый картофель для дополнения к перекусу. Наличие и порцию подтвердит кофейня.',make:makeFries}
  ];
  let active=0,drag=false,lastX=0,lastY=0,targetX=0,targetY=0;
  function setProduct(i){active=(i+products.length)%products.length;clear();products[active].make();root.querySelectorAll('[data-product]').forEach((b,n)=>{b.classList.toggle('is-active',n===active);b.setAttribute('aria-pressed',String(n===active));});root.querySelector('[data-product-name]').textContent=products[active].name;root.querySelector('[data-product-description]').textContent=products[active].desc;}
  root.querySelectorAll('[data-product]').forEach((b,i)=>b.addEventListener('click',()=>setProduct(i)));
  root.querySelector('[data-prev]').addEventListener('click',()=>setProduct(active-1));root.querySelector('[data-next]').addEventListener('click',()=>setProduct(active+1));
  canvas.addEventListener('pointerdown',e=>{drag=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{if(!drag)return;targetY+=(e.clientX-lastX)*.012;targetX+=(e.clientY-lastY)*.008;lastX=e.clientX;lastY=e.clientY;});
  const stop=()=>drag=false;canvas.addEventListener('pointerup',stop);canvas.addEventListener('pointercancel',stop);
  canvas.addEventListener('wheel',e=>{e.preventDefault();camera.position.z=THREE.MathUtils.clamp(camera.position.z+e.deltaY*.003,3.8,6.6);},{passive:false});
  const resize=()=>{const rect=canvas.getBoundingClientRect(),w=Math.max(1,Math.round(rect.width)),h=Math.max(1,Math.round(rect.height));renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};
  if('ResizeObserver'in window)new ResizeObserver(resize).observe(canvas);else window.addEventListener('resize',resize);resize();
  setProduct(0);if(status)status.hidden=true;
  const clock=new THREE.Clock();
  function animate(){requestAnimationFrame(animate);const delta=clock.getDelta(),t=clock.elapsedTime;if(!drag)targetY+=.0025;stage.rotation.y=THREE.MathUtils.damp(stage.rotation.y,targetY,.06,delta);stage.rotation.x=THREE.MathUtils.damp(stage.rotation.x,THREE.MathUtils.clamp(targetX,-.35,.35),.06,delta);stage.position.y=Math.sin(t*1.2)*.035;stage.children.forEach(o=>o.traverse?.(part=>{if(part.userData.steam!==undefined){part.position.y=.52+Math.sin(t*2+part.userData.steam)*.08;part.material.opacity=.35+Math.sin(t*2+part.userData.steam)*.18;}}));renderer.render(scene,camera);}
  animate();
 }catch(error){console.error('3D showcase failed',error);showError('Видеокарта или браузер не смогли создать WebGL-сцену. Обновите страницу или попробуйте другой браузер.');}
}
