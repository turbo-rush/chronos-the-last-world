import * as THREE from 'three';
import './style.css';

const mount = document.querySelector('#world');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa9b6b6);
scene.fog = new THREE.FogExp2(0xa9b6b6, 0.008);
const camera = new THREE.PerspectiveCamera(58, innerWidth / innerHeight, 0.1, 350);
camera.position.set(0, 5.5, 10);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.38;
mount.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xe3f1ef, 0x665b4c, 2.8));
const sun = new THREE.DirectionalLight(0xffdfb6, 4.0);
sun.position.set(-35, 55, 24); sun.castShadow = true;
sun.shadow.mapSize.set(2048,2048); sun.shadow.camera.left=-65; sun.shadow.camera.right=65; sun.shadow.camera.top=65; sun.shadow.camera.bottom=-65;
scene.add(sun);
const fill = new THREE.DirectionalLight(0xa3d5e0, 1.8); fill.position.set(30,18,-35); scene.add(fill);

function seeded(n){const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x)}
function material(color, roughness=1, extra={}){return new THREE.MeshStandardMaterial({color,roughness,...extra})}
const groundMat=material(0x969487);
const groundGeo=new THREE.PlaneGeometry(240,240,110,110); groundGeo.rotateX(-Math.PI/2);
const pos=groundGeo.attributes.position;
for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getZ(i);pos.setY(i,Math.sin(x*.07)*.55+Math.cos(z*.08)*.45+Math.sin((x+z)*.035)*.7+seeded(i)*.16)}
groundGeo.computeVertexNormals();
const ground=new THREE.Mesh(groundGeo,groundMat);ground.receiveShadow=true;scene.add(ground);

const world=new THREE.Group();scene.add(world);
function rock(x,z,s=1,color=0x666b68){const g=new THREE.IcosahedronGeometry(s,1);const p=g.attributes.position;for(let i=0;i<p.count;i++){const k=seeded(i+Math.round(x*9+z*5));p.setXYZ(i,p.getX(i)*(0.78+k*.42),p.getY(i)*(0.72+k*.45),p.getZ(i)*(0.8+k*.4))}g.computeVertexNormals();const m=new THREE.Mesh(g,material(color));m.position.set(x,s*.45,z);m.rotation.set(seeded(x+4)*.4,seeded(z+8)*6,seeded(x+z)*.3);m.scale.set(1,.8,1.25);m.castShadow=true;m.receiveShadow=true;world.add(m);return m}
function pine(x,z,s=1){const tree=new THREE.Group();const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.16*s,.27*s,2.2*s,7),material(0x493e35));trunk.position.y=1.1*s;trunk.castShadow=true;tree.add(trunk);for(let i=0;i<3;i++){const crown=new THREE.Mesh(new THREE.ConeGeometry((1.25-i*.22)*s,2.5*s,7),material(i===0?0x35433e:0x435248));crown.position.y=(2.1+i*.72)*s;crown.castShadow=true;tree.add(crown)}tree.position.set(x,0,z);world.add(tree)}
function deadTree(x,z,s=1){const g=new THREE.Group();const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.12*s,.25*s,3.8*s,7),material(0x50443b));trunk.position.y=1.9*s;trunk.rotation.z=-.12;trunk.castShadow=true;g.add(trunk);for(let i=0;i<3;i++){const b=new THREE.Mesh(new THREE.CylinderGeometry(.055*s,.1*s,1.7*s,6),material(0x50443b));b.position.set((i-1)*.42*s,2.6*s,.02);b.rotation.z=(i-1)*-.65;g.add(b)}g.position.set(x,0,z);world.add(g)}
for(let i=0;i<125;i++){let x=(seeded(i*2)-.5)*145,z=(seeded(i*3+1)-.5)*145;if(Math.hypot(x,z)<12)continue;if(i%3===0)pine(x,z,.7+seeded(i+9)*.8);else if(i%3===1)deadTree(x,z,.65+seeded(i+5)*.9);else rock(x,z,.5+seeded(i+7)*1.5)}
// Distant broken monoliths frame the playable valley.
for(let i=0;i<13;i++){const a=i/13*Math.PI*2,r=48+seeded(i+90)*18,x=Math.cos(a)*r,z=Math.sin(a)*r;const h=5+seeded(i+120)*13;const pillar=new THREE.Mesh(new THREE.CylinderGeometry(1.3,2.1,h,5,1),material(0x555d5c));pillar.position.set(x,h/2,z);pillar.rotation.z=(seeded(i+5)-.5)*.18;pillar.castShadow=true;world.add(pillar)}
// Ruined stone arch and a small camp made from crafted meshes.
const ruin=new THREE.Group();const stone=material(0x77776e);for(const [x,y,z,sx,sy,sz] of [[-2.8,2.5,-8,.7,5,.8],[2.8,2.5,-8,.7,5,.8],[0,5,-8,3.5,.65,.8]]){const b=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),stone);b.position.set(x,y,z);b.rotation.z=(seeded(x+8)-.5)*.08;b.castShadow=true;ruin.add(b)}scene.add(ruin);
const camp=new THREE.Group();const tentMat=material(0x79624b);const tent=new THREE.Mesh(new THREE.ConeGeometry(2.5,3.3,4),tentMat);tent.position.set(0,1.65,0);tent.rotation.y=Math.PI/4;tent.castShadow=true;camp.add(tent);const fireBase=new THREE.Mesh(new THREE.TorusGeometry(.8,.12,6,14),material(0x4d4a43));fireBase.rotation.x=Math.PI/2;fireBase.position.set(3,.12,1);camp.add(fireBase);const flame=new THREE.Mesh(new THREE.ConeGeometry(.35,1.1,7),new THREE.MeshBasicMaterial({color:0xff9b43}));flame.position.set(3,.65,1);camp.add(flame);const fireLight=new THREE.PointLight(0xff8c43,5,13);fireLight.position.set(3,1,1);camp.add(fireLight);camp.position.set(-7,0,5);scene.add(camp);

// The survivor is a sculpted low-poly character, not a placeholder primitive.
const player=new THREE.Group();scene.add(player);
const coat=material(0x343e43),cloth=material(0x9a7859),skin=material(0xb98c70),metal=material(0x747d7b),dark=material(0x20282b);
function part(geo,mat,x,y,z,group=player){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;group.add(m);return m}
part(new THREE.CapsuleGeometry(.48,.9,5,8),coat,0,1.25,0);
part(new THREE.SphereGeometry(.36,10,8),skin,0,2.15,-.02);
part(new THREE.SphereGeometry(.4,9,7),cloth,0,2.42,.03).scale.set(1,.38,1);
part(new THREE.BoxGeometry(.9,.35,.5),dark,0,1.05,.04);
for(const side of [-1,1]){part(new THREE.CapsuleGeometry(.16,.65,4,6),coat,side*.55,1.35,0).rotation.z=side*.18;part(new THREE.CapsuleGeometry(.19,.65,4,6),dark,side*.25,.42,0)}
part(new THREE.BoxGeometry(.13,.9,.13),metal,.56,1.4,-.05).rotation.z=-.4;
player.position.set(0,0,1.8);
const playerRim = new THREE.PointLight(0xb8dce2, 1.7, 8); playerRim.position.set(0,2.5,1.2); player.add(playerRim);

const resourceNodes=[];
function resource(x,z,type){const group=new THREE.Group();if(type==='wood'){const log=new THREE.Mesh(new THREE.CylinderGeometry(.2,.24,2.1,7),material(0x876044));log.rotation.z=Math.PI/2;log.position.y=.24;log.castShadow=true;group.add(log);const end=new THREE.Mesh(new THREE.CircleGeometry(.2,8),material(0xc49a6c));end.rotation.y=Math.PI/2;end.position.set(1.06,.24,0);group.add(end)}else if(type==='stone'){const mesh=new THREE.Mesh(new THREE.DodecahedronGeometry(.72,1),material(0x8a9290));mesh.scale.set(1,.7,1.1);mesh.position.y=.45;mesh.castShadow=true;group.add(mesh)}else{const crystal=new THREE.Mesh(new THREE.OctahedronGeometry(.8,0),new THREE.MeshStandardMaterial({color:0x75c9c1,metalness:.55,roughness:.22,emissive:0x1b6969,emissiveIntensity:.65}));crystal.scale.set(.7,1.5,.7);crystal.position.y=1;crystal.castShadow=true;group.add(crystal);const glow=new THREE.PointLight(0x62d5c8,1.2,5);glow.position.y=1;group.add(glow)}group.position.set(x,0,z);world.add(group);resourceNodes.push({group,type,taken:false,baseY:0})}
[[-5,-4,'wood'],[5,-3,'wood'],[8,7,'wood'],[-11,-2,'wood'],[13,1,'stone'],[-13,8,'stone'],[4,13,'stone'],[16,-9,'shard'],[-16,-8,'shard']].forEach(v=>resource(...v));

const keys={};let started=false,mouseDown=false,yaw=0,pitch=.18,health=100,wood=0,stoneCount=0,shards=0,elapsed=0,last=performance.now(),toastTimer=0;
const timerEl=document.querySelector('#timer'),toast=document.querySelector('#toast'),interaction=document.querySelector('#interaction');
function notify(message){toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2200)}
function updateHud(){document.querySelector('#wood').textContent=wood;document.querySelector('#stone').textContent=stoneCount;document.querySelector('#shards').textContent=shards;document.querySelector('#healthText').textContent=health+'%';document.querySelector('#healthFill').style.width=health+'%';document.querySelector('#objectiveHint').textContent=wood<3?'Собери '+(3-wood)+' ед. древесины':'Материалы собраны · исследуй руины'}
function nearest(){let best=null,d=3.1;for(const n of resourceNodes){if(n.taken)continue;const dist=Math.hypot(n.group.position.x-player.position.x,n.group.position.z-player.position.z);if(dist<d){d=dist;best=n}}return best}
function collect(){const n=nearest();if(!n)return;if(n.type==='wood')wood++;if(n.type==='stone')stoneCount++;if(n.type==='shard')shards++;n.taken=true;world.remove(n.group);updateHud();notify(n.type==='wood'?'ДРЕВЕСИНА +1':n.type==='stone'?'КАМЕНЬ +1':'ХРОНО-ОСКОЛОК +1');if(wood>=3){document.querySelector('#objective').textContent='Убежище готово к строительству';document.querySelector('#objectiveHint').textContent='Исследуй древние руины и найди хроно-осколки'} }
function begin(){started=true;document.querySelector('#startScreen').classList.add('hidden');notify('ЦИКЛ 001 НАЧАЛСЯ. ВЫЖИВАЙ.');if(innerWidth>700)renderer.domElement.requestPointerLock?.()}
document.querySelector('#startBtn').addEventListener('click',begin);
document.addEventListener('keydown',e=>{keys[e.code]=true;if(e.code==='KeyE'&&started)collect()});
document.addEventListener('keyup',e=>keys[e.code]=false);
document.addEventListener('mousemove',e=>{if(document.pointerLockElement===renderer.domElement){yaw-=e.movementX*.002;pitch=Math.max(-.15,Math.min(.55,pitch+e.movementY*.0012))}});
let lookPointer=null,lastTouchX=0,lastTouchY=0;renderer.domElement.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'&&started){lookPointer=e.pointerId;lastTouchX=e.clientX;lastTouchY=e.clientY}});renderer.domElement.addEventListener('pointermove',e=>{if(e.pointerType==='touch'&&e.pointerId===lookPointer){yaw-=(e.clientX-lastTouchX)*.006;pitch=Math.max(-.12,Math.min(.5,pitch+(e.clientY-lastTouchY)*.003));lastTouchX=e.clientX;lastTouchY=e.clientY}});['pointerup','pointercancel'].forEach(type=>renderer.domElement.addEventListener(type,e=>{if(e.pointerId===lookPointer)lookPointer=null}));
renderer.domElement.addEventListener('click',()=>{if(started&&document.pointerLockElement!==renderer.domElement)renderer.domElement.requestPointerLock?.()});
document.querySelector('#soundBtn').addEventListener('click',()=>notify('ЗВУКОВОЙ СЛОЙ БУДЕТ ДОБАВЛЕН В СЛЕДУЮЩЕМ ЭТАПЕ'));
const stick=document.querySelector('#stick'),stickKnob=document.querySelector('#stickKnob');let stickPointer=null,stickX=0,stickY=0;function setStick(e){const r=stick.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let dx=e.clientX-cx,dy=e.clientY-cy;const max=r.width*.34,len=Math.hypot(dx,dy);if(len>max){dx=dx/len*max;dy=dy/len*max}stickX=dx/max;stickY=dy/max;stickKnob.style.left=(50+stickX*34)+'%';stickKnob.style.top=(50+stickY*34)+'%'}stick.addEventListener('pointerdown',e=>{e.preventDefault();stickPointer=e.pointerId;stick.setPointerCapture(e.pointerId);setStick(e)});stick.addEventListener('pointermove',e=>{if(e.pointerId===stickPointer)setStick(e)});function resetStick(){stickPointer=null;stickX=0;stickY=0;stickKnob.style.left='50%';stickKnob.style.top='50%'}['pointerup','pointercancel','lostpointercapture'].forEach(ev=>stick.addEventListener(ev,resetStick));document.querySelector('#collectBtn').addEventListener('pointerdown',e=>{e.preventDefault();if(started)collect()});
function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)}addEventListener('resize',resize);

function animate(now){requestAnimationFrame(animate);const dt=Math.min((now-last)/1000,.04);last=now;
 if(started){elapsed+=dt;const remaining=Math.max(0,1800-elapsed);const mm=String(Math.floor(remaining/60)).padStart(2,'0'),ss=String(Math.floor(remaining%60)).padStart(2,'0');timerEl.textContent=mm+':'+ss;document.querySelector('#timerFill').style.width=(remaining/1800*100)+'%';document.querySelector('#cycleState').textContent='СТАБИЛЬНОСТЬ '+Math.floor(remaining/18)+'%';if(remaining===0&&elapsed-dt<1800){document.querySelector('#flash').classList.add('hit');notify('КОНЕЦ ЭПОХИ. МИР ПЕРЕРОЖДАЕТСЯ…');scene.fog.color.set(0x302b39);scene.fog.density=.025;sun.intensity=.7}
 const forward=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0)-stickY,side=(keys.KeyA||keys.ArrowLeft?1:0)-(keys.KeyD||keys.ArrowRight?1:0)-stickX;const moving=forward||side;if(moving){const angle=yaw;const dx=(Math.sin(angle)*forward+Math.cos(angle)*side)*dt*5;const dz=(Math.cos(angle)*forward-Math.sin(angle)*side)*dt*5;player.position.x+=dx;player.position.z+=dz;player.rotation.y=Math.atan2(dx,dz);player.position.x=THREE.MathUtils.clamp(player.position.x,-65,65);player.position.z=THREE.MathUtils.clamp(player.position.z,-65,65);player.position.y=Math.abs(Math.sin(now*.012))*.055}
 const n=nearest();interaction.classList.toggle('show',!!n);if(n)interaction.textContent='[ E ] СОБРАТЬ '+(n.type==='wood'?'ДРЕВЕСИНУ':n.type==='stone'?'КАМЕНЬ':'ХРОНО-ОСКОЛОК');
 }
 const camDist=innerWidth<=700?6.8:8.0;const target=new THREE.Vector3(player.position.x-Math.sin(yaw)*camDist,player.position.y+(innerWidth<=700?3.6:3.3)+pitch*2.4,player.position.z-Math.cos(yaw)*camDist);camera.position.lerp(target,.12);camera.lookAt(player.position.x,player.position.y+1.25,player.position.z);
 const t=now*.001;flame.scale.y=.85+Math.sin(t*9)*.2;fireLight.intensity=4.2+Math.sin(t*13)*.8;for(const n of resourceNodes){if(!n.taken&&n.type==='shard')n.group.rotation.y+=dt*.35}
 renderer.render(scene,camera)}
requestAnimationFrame(animate);
