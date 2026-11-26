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
 if(!THREE){showError('Браузер не смог получить библиотеку Three.js с CDN. Откройте страницу через интернет и обновите её.');console.error('Three.js import failed',importError);}
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
