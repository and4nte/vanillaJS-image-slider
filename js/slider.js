const $sliderContainer = document.querySelector('.slider-container');
const $sliderWrapper = document.querySelector('.slider-wrapper');

let isStart = false;
let startX;
let currentIndex = 1;

const init = (() => {
  // appened cloneNodes to the parent element.
  const $clonedFirstChild = $sliderWrapper.firstElementChild.cloneNode(true);
  const $clonedLastChild = $sliderWrapper.lastElementChild.cloneNode(true);
  $sliderWrapper.insertBefore($clonedLastChild, $sliderWrapper.firstElementChild);
  $sliderWrapper.appendChild($clonedFirstChild);

  const $slideItems = document.querySelectorAll('.slide-item');
  $slideItems.forEach((el, i) => el.setAttribute('data-item-index', i));

  // show start slide
  $sliderWrapper.style.transform = `translateX(${-700 * currentIndex}px)`;

  // todo: add class 'is-selected', 'next', 'prev'
})();

// * when mousedown
$sliderContainer.addEventListener('mousedown', (e) => {
  // if (!e.target.classList.contains('is-selected')) return;
  e.preventDefault();

  isStart = true;
  currentIndex = +e.target.getAttribute('data-item-index');
  startX = e.pageX - $sliderContainer.offsetLeft;
  console.log(e.target, currentIndex);
  // console.log(`startX: ${startX} / pageX: ${e.pageX}, offsetLeft: ${$sliderContainer.offsetLeft}`);
});

// * when mouseup
window.addEventListener('mouseup', (e) => {
  if (!isStart) return;

  isStart = false;
  const dist = e.pageX - startX - $sliderContainer.offsetLeft || 0;
  console.log(`dist: ${dist}px`);

  $sliderWrapper.style.transition = 'transform 0.25s ease';

  // ! 700 값은 하드코딩. width값 가져와야함.
  // todo: max index면 되돌아가서 infinite 되도록 하기
  if (dist > 50) {
    // <<<<<<
    $sliderWrapper.style.transform = `translateX(${-700 * (currentIndex - 1)}px)`;
    console.log(`translateX(${-700 * (currentIndex - 1)}px)`);
  } else if (dist < -50) {
    // >>>>>>
    $sliderWrapper.style.transform = `translateX(${-700 * (currentIndex + 1)}px)`;
    console.log(`translateX(${-700 * (currentIndex + 1)}px)`);
  } else {
    // current
    $sliderWrapper.style.transform = `translateX(${-700 * currentIndex}px)`;
    console.log('dont move');
  }
});

// * when mouseMove
$sliderContainer.addEventListener('mousemove', (e) => {
  if (!isStart) return;
  e.preventDefault();

  $sliderWrapper.style.transition = 'transform 0s linear';
  $sliderWrapper.style.transform = `translateX(${
    // ! 700 값은 하드코딩. width값 가져와야함.
    e.pageX - $sliderContainer.offsetLeft - startX - 700 * currentIndex
  }px)`;
});
