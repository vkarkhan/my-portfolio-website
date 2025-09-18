// Global site functionality
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    if (window.VanillaTilt) {
      VanillaTilt.init(document.querySelectorAll('.project-card'), {
        max: 15,
        speed: 400,
        glare: true,
        'max-glare': 0.2
      });
    }

    if (window.AOS && AOS.init) {
      AOS.init({ once: true });
    }

    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });

    const counters = document.querySelectorAll('.pub-number');
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(c => io.observe(c));

    const moleculeContainer = document.getElementById('moleculeContainer');
    if (moleculeContainer) {
      const moleculeSection = document.querySelector('#publications') || moleculeContainer;
      let moleculeControls = null;
      let visibilityObserver = null;

      const setupVisibilityObserver = () => {
        if (visibilityObserver || !moleculeControls) return;
        visibilityObserver = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              moleculeControls.start?.();
            } else {
              moleculeControls.stop?.();
            }
          });
        }, { threshold: 0.1 });

        visibilityObserver.observe(moleculeContainer);
      };

      const initializeThree = () => {
        if (moleculeControls || typeof THREE === 'undefined') return;
        moleculeControls = initThree();
        if (moleculeControls) {
          setupVisibilityObserver();
        }
      };

      const handleLoad = () => {
        initializeThree();
        window.removeEventListener('load', handleLoad);
      };

      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          if (document.readyState === 'complete') {
            initializeThree();
          } else {
            window.addEventListener('load', handleLoad);
          }

          observer.disconnect();
        });
      }, { threshold: 0.25 });

      observer.observe(moleculeSection);
    }

    initSphereAnimation();
  });
}

function animateCounter(el) {
  const target = +el.dataset.target;
  let value = 0;
  const step = target / 60;
  function update() {
    value += step;
    if (value < target) {
      el.textContent = Math.floor(value);
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }
  requestAnimationFrame(update);
}

function initThree() {
  const container = document.getElementById('moleculeContainer');
  if (!container || typeof THREE === 'undefined') return null;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  const ambient = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambient);
  const dir = new THREE.DirectionalLight(0xffffff, 0.5);
  dir.position.set(2, 2, 5);
  scene.add(dir);

  const sphereGeom = new THREE.SphereGeometry(0.4, 32, 32);
  const sphereMat = new THREE.MeshStandardMaterial({ color: 0x87cefa });
  const h1 = new THREE.Mesh(sphereGeom, sphereMat);
  const h2 = new THREE.Mesh(sphereGeom, sphereMat);
  h1.position.x = -0.9;
  h2.position.x = 0.9;

  const cylGeom = new THREE.CylinderGeometry(0.1, 0.1, 1.6, 32);
  const cylMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
  const bond = new THREE.Mesh(cylGeom, cylMat);
  bond.rotation.z = Math.PI / 2;

  scene.add(h1, h2, bond);

  let last = 0;
  let frameId = null;
  let running = false;

  function animate(time) {
    if (!running) return;

    if (time - last > 33) { // ~30 fps
      h1.rotation.y += 0.01;
      h2.rotation.y += 0.01;
      bond.rotation.y += 0.01;
      renderer.render(scene, camera);
      last = time;
    }

    frameId = requestAnimationFrame(animate);
  }

  function start() {
    if (running) return;
    running = true;
    frameId = requestAnimationFrame(animate);
  }

  function stop() {
    running = false;
    if (frameId !== null) {
      cancelAnimationFrame(frameId);
      frameId = null;
    }
  }

  start();

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  return { start, stop };
}

function initSphereAnimation() {
  const sphere = document.getElementById('spinningSphere');
  if (!sphere) return;

  sphere.addEventListener('click', () => {
    sphere.classList.toggle('spin');
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        sphere.classList.add('spin');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(sphere);

  return { observer, sphere };
}

if (typeof module !== 'undefined') {
  module.exports = { initSphereAnimation };
}
