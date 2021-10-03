// sets the radio to 'annuity' when the page is reloaded
document.getElementById('annuity_type').checked = true;

let sliderSwitch = function(direction){
    let radioTop = document.getElementById('annuity_type');
    let sliderBody = document.getElementsByClassName('slider_body')[0];

    if(direction === 'top'){
        radioTop.checked = true;
    }
    else if(direction === 'down'){
        radioTop.checked = false;
    }
    else{
        radioTop.checked = !radioTop.checked;
    }

    if(radioTop.checked){
        sliderBody.style.top = '0';
    }
    else{
        sliderBody.style.top = '55%';
    }
}

let setButtonBorderChanging = function() {
    let submitButton = document.getElementsByClassName('submit_button')[0];
    let excelButton = document.getElementsByClassName('excel_button')[0];
    excelButton.onmouseover = function () {
        submitButton.style.borderRadius = '0px 8px 8px 8px';
    }
    excelButton.onmouseleave = function () {
        submitButton.style.borderRadius = '8px 8px 8px 8px';
    }

    let formulasButton = document.getElementsByClassName('formulas_button')[0];
    formulasButton.onmouseover = function () {
        submitButton.style.borderRadius = '8px 0px 8px 8px';
    }
    formulasButton.onmouseleave = function () {
        submitButton.style.borderRadius = '8px 8px 8px 8px';
    }

    submitButton.onmouseover = function () {
        submitButton.style.borderRadius = '8px 8px 0 0';
    }

    submitButton.onmouseleave = function () {
        submitButton.style.borderRadius = '8px 8px 8px 8px';
    }

}

setButtonBorderChanging();