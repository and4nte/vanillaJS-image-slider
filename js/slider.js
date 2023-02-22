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

// * when mousedown
$sliderContainer.addEventListener('mousedown', (e) => {
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

  startX = e.pageX - $sliderContainer.offsetLeft;
});

// * when mouseup
window.addEventListener('mouseup', (e) => {
  if (!isStart) return;

  isStart = false;
  const dist = e.pageX - startX - $sliderContainer.offsetLeft || 0;

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
});

// * when mouseMove
$sliderContainer.addEventListener('mousemove', (e) => {
  if (!isStart) return;
  e.preventDefault();

  $sliderWrapper.style.transition = 'transform 0s linear';
  $sliderWrapper.style.transform = `translateX(${
    e.pageX - $sliderContainer.offsetLeft - startX - options.itemWidth * currentIndex
  }px)`;
});
