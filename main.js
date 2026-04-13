import * as THREE from "https://cdn.skypack.dev/three@0.158";

// ===== 기본 =====
const scene = new THREE.Scene();

const camera = new THREE.OrthographicCamera(
  -1, 1, 1, -1, 0.1, 10
);
camera.position.z = 1;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ===== 텍스처 =====
const loader = new THREE.TextureLoader();

const tex1 = loader.load("./image1.jpg");
const tex2 = loader.load("./image2.jpg");

// ===== 쉐이더 =====
const material = new THREE.ShaderMaterial({
  uniforms: {
    uTexture1: { value: tex1 },
    uTexture2: { value: tex2 },
    uProgress: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) }
  },

  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,

  fragmentShader: `
    varying vec2 vUv;

    uniform sampler2D uTexture1;
    uniform sampler2D uTexture2;
    uniform float uProgress;
    uniform vec2 uMouse;

    void main() {
      vec2 uv = vUv;

      // 마우스 기반 왜곡
      float dist = distance(uv, uMouse);
      uv += (uMouse - uv) * 0.2 * (1.0 - dist);

      // 물결 느낌
      uv.y += sin(uv.x * 10.0 + uProgress * 5.0) * 0.02;

      vec4 img1 = texture2D(uTexture1, uv);
      vec4 img2 = texture2D(uTexture2, uv);

      // 전환
      vec4 final = mix(img1, img2, uProgress);

      gl_FragColor = final;
    }
  `
});

// ===== 화면 =====
const geometry = new THREE.PlaneGeometry(2, 2);
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// ===== 마우스 =====
window.addEventListener("mousemove", (e) => {
  material.uniforms.uMouse.value.x = e.clientX / window.innerWidth;
  material.uniforms.uMouse.value.y = 1 - e.clientY / window.innerHeight;
});

// ===== 스페이스 HOLD =====
let holding = false;

window.addEventListener("keydown", (e) => {
  if (e.code === "Space") holding = true;
});

window.addEventListener("keyup", (e) => {
  if (e.code === "Space") holding = false;
});

// ===== 애니메이션 =====
function animate() {
  requestAnimationFrame(animate);

  if (holding) {
    material.uniforms.uProgress.value += 0.02;
    if (material.uniforms.uProgress.value > 1) {
      material.uniforms.uProgress.value = 0;

      // 이미지 교체
      material.uniforms.uTexture1.value = tex2;
    }
  }

  renderer.render(scene, camera);
}

animate();