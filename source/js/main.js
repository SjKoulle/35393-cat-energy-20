var navMain = document.querySelector('.main-nav');
var navToggle = document.querySelector('.main-nav__toggle');
var mapYa = document.querySelector('.map__ya');
var mapW = document.querySelector('.map__wrapper');

navMain.classList.remove('main-nav--nojs');

mapYa.classList.remove('map__ya--nojs');

mapW.classList.remove('map__wrapper--nojs');

navToggle.addEventListener('click', function() {
  if (navMain.classList.contains('main-nav--closed')) {
    navMain.classList.remove('main-nav--closed');
    navMain.classList.add('main-nav--opened');
  } else {
    navMain.classList.add('main-nav--closed');
    navMain.classList.remove('main-nav--opened');
  }
});
