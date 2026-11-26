import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const root=document.querySelector('[data-food-scene]');
if(root){
 const canvas=root.querySelector('canvas');
 const scene=new THREE.Scene(); scene.background=new THREE.Color('#e9dfcc');
 const camera=new THREE.PerspectiveCamera(34,1,.1,100); camera.position.set(0,1.05,5.4);
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.6)); renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 renderer.outputColorSpace=THREE.SRGBColorSpace; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.18;
 scene.add(new THREE.HemisphereLight(0xfff3df,0x76604a,2.1));
 const key=new THREE.DirectionalLight(0xffedcf,3.2); key.position.set(-3,5,4); key.castShadow=true; key.shadow.mapSize.set(1024,1024); scene.add(key);
 const rim=new THREE.DirectionalLight(0xff7655,1.7); rim.position.set(3,2,-3); scene.add(rim);
 const fill=new THREE.PointLight(0xffffff,1.4,8); fill.position.set(2,1,3); scene.add(fill);
 const floor=new THREE.Mesh(new THREE.CircleGeometry(3.2,64),new THREE.MeshStandardMaterial({color:'#d8c8ad',roughness:.92})); floor.rotation.x=-Math.PI/2; floor.position.y=-1.05; floor.receiveShadow=true; scene.add(floor);
 const stage=new THREE.Group(); scene.add(stage);
 const mat=(color,roughness=.55,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
 const bread=mat('#d7a45e',.82), toasted=mat('#9a572d',.8), cream=mat('#f3e8d2',.3), green=mat('#638044',.7), red=mat('#bd4932',.65), dark=mat('#39251d',.3), white=mat('#fff8e9',.22), cupMat=mat('#f8f0df',.2), metal=mat('#b9a58a',.28,.72);
 function mesh(g,m,x=0,y=0,z=0,rx=0,ry=0,rz=0){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.rotation.set(rx,ry,rz);o.castShadow=true;o.receiveShadow=true;stage.add(o);return o}
 function lathe(points,m,x=0,y=0,z=0){return mesh(new THREE.LatheGeometry(points.map(p=>new THREE.Vector2(...p)),64),m,x,y,z)}
 function clear(){while(stage.children.length){const o=stage.children.pop();o.geometry?.dispose();if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material?.dispose();}}
 function makeShawarma(){
   const wrap=new THREE.Group(); stage.add(wrap); wrap.rotation.z=-.16;
   const body=new THREE.Mesh(new THREE.CylinderGeometry(.52,.38,1.95,64,1,false),bread); body.rotation.z=-.1; body.position.y=-.02; body.castShadow=true;wrap.add(body);
   const top=new THREE.Mesh(new THREE.CircleGeometry(.51,64),cream);top.rotation.x=-Math.PI/2;top.position.set(0,.95,0);wrap.add(top);
   for(let i=0;i<18;i++){const a=i*2.399, r=.12+(i%4)*.085;const strip=new THREE.Mesh(new THREE.SphereGeometry(.09+Math.random()*.045,12,10),i%3===0?green:i%3===1?red:toasted);strip.scale.set(1.3,.45,.8);strip.position.set(Math.cos(a)*r,.94+Math.random()*.12,Math.sin(a)*r);wrap.add(strip);}
   for(let i=0;i<7;i++){const a=i*2.4;const fold=new THREE.Mesh(new THREE.TorusGeometry(.44,.035,8,48,1.15),toasted);fold.rotation.set(Math.PI/2,a,0);fold.position.y=-.55+i*.19;wrap.add(fold);}
   const paper=new THREE.Mesh(new THREE.CylinderGeometry(.4,.27,.68,48,1,true),cream);paper.position.y=-.62;paper.rotation.z=-.1;wrap.add(paper);
 }
 function makeCoffee(){
   const saucer=new THREE.Mesh(new THREE.CylinderGeometry(.86,.82,.09,64),white);saucer.position.y=-.91;saucer.castShadow=true;stage.add(saucer);
   const cup=new THREE.Mesh(new THREE.LatheGeometry([[.38,-.55],[.43,-.48],[.54,.18],[.5,.28],[.39,.25],[.34,-.42]],64),cupMat);cup.position.y=-.25;cup.castShadow=true;stage.add(cup);
   const coffee=new THREE.Mesh(new THREE.CircleGeometry(.43,64),mat('#4b281b',.18));coffee.rotation.x=-Math.PI/2;coffee.position.y=.035;stage.add(coffee);
   const crema=new THREE.Mesh(new THREE.TorusGeometry(.18,.018,8,48),mat('#c78c4d',.28));crema.rotation.x=Math.PI/2;crema.position.set(-.08,.04,.05);stage.add(crema);
   const handle=new THREE.Mesh(new THREE.TorusGeometry(.27,.075,16,48),cupMat);handle.position.set(.49,-.18,0);handle.rotation.y=Math.PI/2;stage.add(handle);
   for(let i=0;i<3;i++){const steam=new THREE.Mesh(new THREE.TorusKnotGeometry(.045,.012,48,8,2,3),new THREE.MeshBasicMaterial({color:'#fff8e8',transparent:true,opacity:.65}));steam.position.set(-.16+i*.16,.55+(i%2)*.12,0);steam.scale.set(.7,1.6,.7);steam.userData.steam=i;stage.add(steam);}
 }
 function makeFries(){
   const carton=new THREE.Mesh(new THREE.CylinderGeometry(.52,.36,1.05,5,1,true),red);carton.position.y=-.48;carton.rotation.y=.3;stage.add(carton);
   const rimMesh=new THREE.Mesh(new THREE.TorusGeometry(.48,.035,10,5),white);rimMesh.position.y=.03;rimMesh.rotation.x=Math.PI/2;stage.add(rimMesh);
   for(let i=0;i<13;i++){const a=i*2.4,r=.08+(i%3)*.1;const fry=new THREE.Mesh(new THREE.BoxGeometry(.12,.95+(i%4)*.09,.12),bread);fry.position.set(Math.cos(a)*r,.45+(i%3)*.04,Math.sin(a)*r);fry.rotation.z=(Math.random()-.5)*.24;fry.rotation.x=(Math.random()-.5)*.18;fry.castShadow=true;stage.add(fry);}
   for(let i=0;i<4;i++){const fleck=new THREE.Mesh(new THREE.SphereGeometry(.035,8,8),toasted);fleck.position.set((i-2)*.14,.91,.08);stage.add(fleck);}
 }
 const products=[
  {id:'shawarma',name:'Шаурма',desc:'Горячий перекус в тонком лаваше. Состав, размер и доступные варианты уточняйте у сотрудников.',make:makeShawarma},
  {id:'coffee',name:'Капучино',desc:'Кофейная пауза с мягкой молочной пеной. Объём и наличие напитка уточняйте перед заказом.',make:makeCoffee},
  {id:'fries',name:'Картофель фри',desc:'Золотистый картофель для дополнения к перекусу. Наличие и порцию подтвердит кофейня.',make:makeFries}
 ];
 let active=0,drag=false,lastX=0,lastY=0,targetX=0,targetY=0,downX=0,downY=0;
 function setProduct(i){active=(i+products.length)%products.length;clear();products[active].make();root.querySelectorAll('[data-product]').forEach((b,n)=>{b.classList.toggle('is-active',n===active);b.setAttribute('aria-pressed',String(n===active));});root.querySelector('[data-product-name]').textContent=products[active].name;root.querySelector('[data-product-description]').textContent=products[active].desc;}
 root.querySelectorAll('[data-product]').forEach((b,i)=>b.addEventListener('click',()=>setProduct(i)));
 root.querySelector('[data-prev]').addEventListener('click',()=>setProduct(active-1));root.querySelector('[data-next]').addEventListener('click',()=>setProduct(active+1));
 canvas.addEventListener('pointerdown',e=>{drag=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId);});
 canvas.addEventListener('pointermove',e=>{if(!drag)return;targetY+=(e.clientX-lastX)*.012;targetX+=(e.clientY-lastY)*.008;lastX=e.clientX;lastY=e.clientY;});
 const stop=()=>drag=false;canvas.addEventListener('pointerup',stop);canvas.addEventListener('pointercancel',stop);canvas.addEventListener('wheel',e=>{e.preventDefault();camera.position.z=THREE.MathUtils.clamp(camera.position.z+e.deltaY*.003,3.8,6.6);},{passive:false});
 const resize=()=>{const w=Math.max(1,canvas.clientWidth),h=Math.max(1,canvas.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};new ResizeObserver(resize).observe(canvas);resize();setProduct(0);
 const clock=new THREE.Clock();
 function animate(){requestAnimationFrame(animate);const delta=clock.getDelta();const t=clock.elapsedTime;if(!drag)targetY+=.0025;stage.rotation.y=THREE.MathUtils.damp(stage.rotation.y,targetY,.06,delta);stage.rotation.x=THREE.MathUtils.damp(stage.rotation.x,THREE.MathUtils.clamp(targetX,-.35,.35),.06,delta);stage.position.y=Math.sin(t*1.2)*.035;stage.children.forEach(o=>{if(o.userData.steam!==undefined){o.position.y=.52+Math.sin(t*2+o.userData.steam)*.08;o.material.opacity=.35+Math.sin(t*2+o.userData.steam)*.18;}});renderer.render(scene,camera);}
 animate();
}
