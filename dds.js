const dropDownButton = document.querySelector('.dropdown-button');
const dropDownContent = document.querySelector('.dropdown-content');

dropDownButton.addEventListener('click', function() {
    dropDownContent.classList.toggle('show');
});
