ymaps.ready(function () {
  var myMap = new ymaps.Map('map', {
      center: [59.938635, 30.323118],
      controls: ['zoomControl'],
      zoom: 14
    }),

    myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
      // Опции.
      // Необходимо указать данный тип макета.
      iconLayout: 'default#image',
      // Своё изображение иконки метки.
      iconImageHref: '../img/map-pin.png',
      // Размеры метки.
      iconImageSize: [57, 53]
      // Смещение левого верхнего угла иконки относительно
      // её "ножки" (точки привязки).
      // iconImageOffset: [-5, -38]
    });

  myMap.behaviors.disable('scrollZoom');

  myMap.geoObjects
    .add(myPlacemark);
});
