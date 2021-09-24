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