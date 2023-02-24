const options = {
  containerWidth: 700,
  itemWidth: 700,
  transform: '0.25s ease',
};
const $sliderContainer = document.querySelector('.slider-container');
const $sliderWrapper = document.querySelector('.slider-wrapper');
const lastIndex = $sliderWrapper.children.length + 1;

let isStart = false;
let startX;
let currentIndex = 1;

const setSlide = (index = 1, transformOption = '0s linear') => {
  currentIndex = +index;
  $sliderWrapper.style.transition = `transform ${transformOption}`;
  $sliderWrapper.style.transform = `translateX(${-options.itemWidth * currentIndex}px)`;

  $sliderWrapper.querySelectorAll('.active').forEach((el) => el.classList.remove('active'));
  $sliderWrapper.querySelector(`[data-item-index="${currentIndex}"]`).classList.add('active');
};

const init = (() => {
  // appened cloneNodes to the parent element.
  const $clonedFirstChild = $sliderWrapper.firstElementChild.cloneNode(true);
  const $clonedLastChild = $sliderWrapper.lastElementChild.cloneNode(true);
  $sliderWrapper.insertBefore($clonedLastChild, $sliderWrapper.firstElementChild);
  $sliderWrapper.appendChild($clonedFirstChild);

  const $slideItems = document.querySelectorAll('.slide-item');
  $slideItems.forEach((el, i) => {
    el.setAttribute('data-item-index', i);
    if (el.querySelector('a')) el.classList.add('is-link');
  });

  setSlide();
})();

const startSlider = (e) => {
  e.preventDefault();
  isStart = true;

  // if clicked outside '.slider-wrapper', reset current slide.
  const $slideItem = e.target.closest('.slide-item');
  if (!$slideItem) {
    setSlide(1, options.transform);
    isStart = false;
    return;
  }

  // set currentIndex for infinite scroll
  currentIndex = +$slideItem.getAttribute('data-item-index');
  if (currentIndex === lastIndex) setSlide(1);
  else if (currentIndex === 0) setSlide(lastIndex - 1);

  // check desktop or mobile
  startX = e.clientX ? e.clientX : e.touches[0].screenX;
  $sliderContainer.addEventListener(e.clientX ? 'mousemove' : 'touchmove', moveSlider, {
    passive: false,
  });
};

const moveSlider = (e) => {
  if (!isStart) return;
  e.preventDefault();

  let currentX = e.clientX || e.touches[0].screenX;

  $sliderWrapper.style.transition = 'transform 0s linear';
  $sliderWrapper.style.transform = `translateX(${
    currentX - startX - options.itemWidth * currentIndex
  }px)`;
};

const endSlider = (e) => {
  if (!isStart) return;

  isStart = false;
  const dist = (e.clientX || e.changedTouches[0].screenX) - startX || 0;

  if (dist > 50) currentIndex--;
  else if (dist < -50) currentIndex++;
  else if (Math.abs(dist) < 3) {
    // if slide has anchor tag, redirect
    const curr = $sliderWrapper.querySelector(`[data-item-index="${currentIndex}"]`);
    if (curr.classList.contains('is-link')) {
      window.location.href = curr.querySelector('a').getAttribute('href');
    }
  }
  setSlide(currentIndex, options.transform);
};

// * when mousedown or touchstart
$sliderContainer.addEventListener('mousedown', startSlider);
$sliderContainer.addEventListener('touchstart', startSlider, { passive: false });

// * when mouseup or touchend
window.addEventListener('mouseup', endSlider);
window.addEventListener('touchend', endSlider);
