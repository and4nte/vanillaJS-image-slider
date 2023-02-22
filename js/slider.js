// ! 700 값은 하드코딩. width값 가져와야함.
const options = {
  containerWidth: 700,
  itemWidth: 700,
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
};

const init = (() => {
  // appened cloneNodes to the parent element.
  const $clonedFirstChild = $sliderWrapper.firstElementChild.cloneNode(true);
  const $clonedLastChild = $sliderWrapper.lastElementChild.cloneNode(true);
  $sliderWrapper.insertBefore($clonedLastChild, $sliderWrapper.firstElementChild);
  $sliderWrapper.appendChild($clonedFirstChild);

  const $slideItems = document.querySelectorAll('.slide-item');
  $slideItems.forEach((el, i) => el.setAttribute('data-item-index', i));

  // show start slide
  setSlide();

  // todo: add class 'is-selected', 'next', 'prev'
})();

// * when mousedown
$sliderContainer.addEventListener('mousedown', (e) => {
  e.preventDefault();
  isStart = true;

  // if clicked outside '.slider-wrapper', reset current slide.
  const $slideItem = e.target.closest('.slide-item');
  if (!$slideItem) {
    // show start slide
    setSlide(1, '0.25s ease');
    isStart = false;
    return;
  }

  // set currentIndex for infinite scroll
  currentIndex = +$slideItem.getAttribute('data-item-index');
  if (currentIndex === lastIndex) currentIndex = 1;
  else if (currentIndex === 0) currentIndex = lastIndex - 1;

  startX = e.pageX - $sliderContainer.offsetLeft;
  // console.log('>>> current:', $slideItem);
});

// * when mouseup
window.addEventListener('mouseup', (e) => {
  if (!isStart) return;

  isStart = false;
  const dist = e.pageX - startX - $sliderContainer.offsetLeft || 0;

  if (dist > 50) currentIndex--;
  else if (dist < -50) currentIndex++;

  setSlide(currentIndex, '0.25s ease');
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
