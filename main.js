// ===== 기본 세팅 =====
const scene = new THREE.Scene();

scene.background = new THREE.Color(0x0a0a0a);
scene.fog = new THREE.Fog(0x000000, 5, 25);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ===== 텍스처 로드 =====
const loader = new THREE.TextureLoader();

const images = [
  "./image1.jpg",
  "./image2.jpg",
  "./image3.jpg",
  "./image4.jpg",
  "./image5.jpg",
  "./image6.jpg"
];

const meshes = [];

// ===== 이미지 생성 =====
images.forEach((img, i) => {
  const texture = loader.load(img);

  const size = 3 + Math.random() * 1.5;
  const geometry = new THREE.PlaneGeometry(size, size * 0.75);

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
  });

  const mesh = new THREE.Mesh(geometry, material);

  // 🎯 핵심: 연출된 배치
  mesh.position.z = -i * 5;

  if (i % 2 === 0) {
    mesh.position.x = -1.5;
  } else {
    mesh.position.x = 1.5;
  }

  mesh.position.y = (Math.random() - 0.5) * 1.5;

  scene.add(mesh);
  meshes.push(mesh);
});

// ===== ✏️ 흰색 드로잉 (병맛 핵심) =====
const createDrawing = (x, y, z) => {
  const points = [];

  points.push(new THREE.Vector3(-0.5, 0.5, 0));
  points.push(new THREE.Vector3(0.5, 0.5, 0));
  points.push(new THREE.Vector3(0.3, 0, 0));
  points.push(new THREE.Vector3(-0.3, 0, 0));
  points.push(new THREE.Vector3(-0.5, 0.5, 0));

  const geo = new THREE.BufferGeometry().setFromPoints(points);

  const mat = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.9,
  });

  const line = new THREE.Line(geo, mat);

  line.position.set(x, y, z);

  scene.add(line);
  return line;
};

const drawings = [];

meshes.forEach((mesh, i) => {
  const d = createDrawing(
    mesh.position.x + (Math.random() > 0.5 ? 1 : -1),
    mesh.position.y + 0.5,
    mesh.position.z + 0.5
  );
  drawings.push(d);
});

// ===== 마우스 =====
let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

// ===== 스크롤 =====
let scrollY = 0;

window.addEventListener("wheel", (e) => {
  scrollY += e.deltaY * 0.002;
});

// ===== 애니메이션 =====
function animate() {
  requestAnimationFrame(animate);

  // 카메라 부드럽게 이동
  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (-mouseY - camera.position.y) * 0.05;

  camera.position.z = 5 + scrollY;

  // 이미지 움직임
  meshes.forEach((mesh, i) => {
    mesh.rotation.z += 0.0005;
    mesh.position.y += Math.sin(Date.now() * 0.001 + i * 2) * 0.0015;
  });

  // 드로잉 움직임 (병맛 포인트)
  drawings.forEach((d, i) => {
    d.rotation.z += 0.01;
    d.position.x += Math.sin(Date.now() * 0.002 + i) * 0.002;
  });

  renderer.render(scene, camera);
}

animate();

// ===== 반응형 =====
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});