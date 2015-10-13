var gridToggler = document.querySelector('.vertical-rhythm-toggler');
var grid = document.querySelector('.vertical-rhythm-guidelines');

gridToggler.addEventListener('click', function () {
    gridToggler.classList.toggle('vertical-rhythm-toggler_enabled');
    gridToggler.classList.toggle('vertical-rhythm-toggler_disabled');
    grid.classList.toggle('vertical-rhythm-guidelines_enabled');
    grid.classList.toggle('vertical-rhythm-guidelines_disabled');
});



var body = document.body;
var demoItemsButton = document.querySelector('.demo-items__button');
var demoItemsList = document.querySelector('.demo-items__list');
var openedClass = 'demo-items__list_state_show';

demoItemsButton.addEventListener('click', function (e) {
    e.stopPropagation();
    demoItemsList.classList.toggle(openedClass);
});

demoItemsList.addEventListener('click', function (e) {
    e.stopPropagation();
    if (e.target.classList.contains('demo-items__list-link')) {
        demoItemsList.classList.remove(openedClass);
    }
});

body.addEventListener('click', function () {
    if (demoItemsList.classList.contains(openedClass)) {
        demoItemsList.classList.remove(openedClass);
    }
});
