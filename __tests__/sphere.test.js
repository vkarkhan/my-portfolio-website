const { JSDOM } = require('jsdom');
const { initSphereAnimation } = require('../script.js');

describe('spinning sphere', () => {
  let originalObserver;

  beforeEach(() => {
    originalObserver = global.IntersectionObserver;
  });

  afterEach(() => {
    global.IntersectionObserver = originalObserver;
    if (global.window) {
      delete global.window.IntersectionObserver;
    }
    delete global.window;
    delete global.document;
  });

  test('adds spin class on intersection', () => {
    const dom = new JSDOM(`<!DOCTYPE html><img id="spinningSphere">`);
    const { window } = dom;
    global.window = window;
    global.document = window.document;

    let capturedCb;
    class MockObserver {
      constructor(cb) { capturedCb = cb; }
      observe() {}
      unobserve() {}
    }
    window.IntersectionObserver = MockObserver;
    global.IntersectionObserver = MockObserver;

    const { sphere } = initSphereAnimation();
    capturedCb([{ isIntersecting: true, target: sphere }]);
    expect(sphere.classList.contains('spin')).toBe(true);
  });

  test('toggles spin class on click', () => {
    const dom = new JSDOM(`<!DOCTYPE html><img id="spinningSphere" class="spin">`);
    const { window } = dom;
    global.window = window;
    global.document = window.document;
    class MockObserver { constructor(){} observe(){} unobserve(){} }
    window.IntersectionObserver = MockObserver;
    global.IntersectionObserver = MockObserver;

    const { sphere } = initSphereAnimation();
    sphere.dispatchEvent(new window.Event('click'));
    expect(sphere.classList.contains('spin')).toBe(false);
  });
});
