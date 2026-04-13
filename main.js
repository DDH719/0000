// 기본 세팅
const scene = new THREE.Scene();

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

// 텍스처 로드
const loader = new THREE.TextureLoader();

// 이미지 배열
const images = [
  "image1.jpg",
  "image2.jpg",
  "image3.jpg",
  "image4.jpg",
  "image5.jpg",
  "image6.jpg"
];

const meshes = [];

// 이미지 생성
images.forEach((img, i) => {
  const texture = loader.load(img);

  const geometry = new THREE.PlaneGeometry(4, 3);
  const material = new THREE.MeshBasicMaterial({ map: texture });

  const mesh = new THREE.Mesh(geometry, material);

  // 위치 설정 (핵심)
  mesh.position.z = -i * 4; // 깊이
  mesh.position.x = (Math.random() - 0.5) * 2; // 좌우 랜덤

  scene.add(mesh);
  meshes.push(mesh);
});

// 마우스
let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

// 스크롤
let scrollY = 0;

window.addEventListener("wheel", (e) => {
  scrollY += e.deltaY * 0.002;
});

// 애니메이션
function animate() {
  requestAnimationFrame(animate);

  // 카메라 부드럽게 이동
  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (-mouseY - camera.position.y) * 0.05;

  // 스크롤 이동
  camera.position.z = 5 + scrollY;

  // 이미지 살짝 떠다니는 느낌
  meshes.forEach((mesh, i) => {
    mesh.rotation.z += 0.0005;
    mesh.position.y += Math.sin(Date.now() * 0.001 + i) * 0.001;
  });

  renderer.render(scene, camera);
}

animate();

// 반응형
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});