import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/postprocessing/UnrealBloomPass.js';

const app = document.getElementById('app');
const panel = document.getElementById('map-panel');
const panelTitle = document.getElementById('panel-title');
const panelCopy = document.getElementById('panel-copy');
const panelTopics = document.getElementById('panel-topics');
const enterButton = document.getElementById('enter-roadmap');

const scene = new THREE.Scene();
scene.background = new THREE.Color('#040814');
scene.fog = new THREE.FogExp2('#040814', 0.03);

const camera = new THREE.PerspectiveCamera(52, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(0, 8, 32);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
app.appendChild(renderer.domElement);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 1.2, 0.7, 0.3);
composer.addPass(bloomPass);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.7;

const ambient = new THREE.AmbientLight('#dfe8ff', 1.2);
scene.add(ambient);

const keyLight = new THREE.PointLight('#57e0c9', 30, 100, 2);
keyLight.position.set(12, 10, 15);
scene.add(keyLight);

const rimLight = new THREE.PointLight('#b98bf0', 25, 100, 2);
rimLight.position.set(-15, 6, -10);
scene.add(rimLight);

const galaxyGroup = new THREE.Group();
scene.add(galaxyGroup);

const starsGeometry = new THREE.BufferGeometry();
const starsCount = 2200;
const starPositions = new Float32Array(starsCount * 3);
for (let i = 0; i < starsCount; i += 1) {
  const i3 = i * 3;
  starPositions[i3] = (Math.random() - 0.5) * 90;
  starPositions[i3 + 1] = (Math.random() - 0.5) * 60;
  starPositions[i3 + 2] = (Math.random() - 0.5) * 80;
}
starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

const starsMaterial = new THREE.PointsMaterial({
  color: '#dfe9ff',
  size: 0.18,
  transparent: true,
  opacity: 0.9
});

scene.add(new THREE.Points(starsGeometry, starsMaterial));

let maps = [];
let selectedMap = null;

function setPanel(map) {
  panel.classList.remove('hidden');
  panelTitle.textContent = map.title;
  panelCopy.textContent = map.tagline || 'Capability roadmap';
  panelTopics.innerHTML = '';

  map.topics.slice(0, 4).forEach((topic) => {
    const item = document.createElement('li');
    item.textContent = topic.title;
    panelTopics.appendChild(item);
  });

  enterButton.textContent = `Open ${map.title}`;
  selectedMap = map;
}

function buildGalaxy(mapList) {
  galaxyGroup.clear();

  mapList.forEach((map, index) => {
    const angle = (index / mapList.length) * Math.PI * 2;
    const orbitRadius = 15;
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(1.35, 32, 32),
      new THREE.MeshStandardMaterial({
        color: map.color,
        emissive: map.color,
        emissiveIntensity: 0.9,
        metalness: 0.2,
        roughness: 0.6
      })
    );

    mesh.position.set(
      Math.cos(angle) * orbitRadius,
      Math.sin(index * 1.4) * 3,
      Math.sin(angle) * orbitRadius
    );

    mesh.userData = map;

    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(1.8, 24, 24),
      new THREE.MeshBasicMaterial({
        color: map.color,
        transparent: true,
        opacity: 0.18,
        side: THREE.BackSide
      })
    );
    halo.position.copy(mesh.position);

    mesh.addEventListener = null;
    mesh.onPointerDown = () => setPanel(map);

    const raycastTarget = new THREE.Object3D();
    raycastTarget.userData = map;
    raycastTarget.position.copy(mesh.position);
    raycastTarget.scale.setScalar(1.15);
    mesh.userData = map;

    galaxyGroup.add(mesh);
    galaxyGroup.add(halo);
  });

  if (mapList[0]) setPanel(mapList[0]);
}

function attachClickHandlers() {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  renderer.domElement.addEventListener('pointerdown', (event) => {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(galaxyGroup.children, false);

    const hit = intersects.find((item) => item.object.type === 'Mesh');
    if (hit && hit.object.userData && hit.object.userData.title) {
      setPanel(hit.object.userData);
    }
  });
}

enterButton.addEventListener('click', () => {
  if (selectedMap) {
    window.location.href = `./roadmap.html?map=${encodeURIComponent(selectedMap.id)}`;
  }
});

async function loadMaps() {
  try {
    const response = await fetch('./maps.json');
    if (!response.ok) throw new Error('maps.json not found');
    maps = await response.json();
    buildGalaxy(maps);
    attachClickHandlers();
  } catch (error) {
    console.error(error);
    panel.classList.remove('hidden');
    panelTitle.textContent = 'Maps not ready';
    panelCopy.textContent = 'Run: node build.js';
    panelTopics.innerHTML = '<li>Generate the roadmap JSON</li>';
  }
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  galaxyGroup.rotation.y += 0.0012;
  composer.render();
}

window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  composer.setSize(innerWidth, innerHeight);
});

loadMaps();
animate();
