const rainbowCheckBox = document.getElementById('rainbow-checkbox');
const rainbowTexts = document.getElementsByClassName('rainbow-text');

rainbowCheckBox.addEventListener('change', function() {
    if (rainbowCheckBox.checked) {
        /* add id to the element */
        for (let i = 0; i < rainbowTexts.length; i++) {
            rainbowTexts[i].id = 'rainbow-text';
        }
    } else {
        /* remove id from the element */
        for (let i = 0; i < rainbowTexts.length; i++) {
            rainbowTexts[i].removeAttribute('id');
        }
    }
});
