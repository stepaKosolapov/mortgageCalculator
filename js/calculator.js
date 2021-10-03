let inputData = {
    creditAmount: 0,
    percentage: 0,
    periodType: 'years', //years/months
    creditPeriod: 0,
    paymentType: 'annuity', //annuity/differentiated
    startTime: new Date(),
}

let monthsInfo = [];
let countResults = {
    overpayment: 0,
    total: 0,
    credit: 0,
}

let validateForm = function (inputData) {
    if (isNaN(inputData.creditAmount) || 0 >= inputData.creditAmount) {
        alert ( "Please, input correct credit amount!" );
        return false;
    }
    if (isNaN(inputData.creditPeriod) || 0 >= inputData.creditPeriod || inputData.creditPeriod > 500) {
        alert ( "Please, input correct period!" );
        return false;
    }
    if (isNaN(inputData.percentage) || 0 >= inputData.percentage || inputData.percentage > 999.99) {
        alert ( "Please, input correct percentage!" );
        return false;
    }
    return true;
}

let getAllInputs = function () {
    inputData.creditAmount = parseInt(document.getElementById('credit_amount').value);
    inputData.periodType = document.getElementById('period_type').value;
    inputData.creditPeriod = parseInt(document.getElementById('credit_period').value)
        * (inputData.periodType === 'years' ? 12 : 1);
    inputData.percentage = parseFloat(document.getElementById('credit_percentage').value);
    inputData.paymentType = (document.getElementById('annuity_type').checked ? 'annuity' : 'differentiated');
    inputData.startTime = new Date(Date.now());
}

let getAnnuityMonths = function () {
    let monthlyPercent = inputData.percentage / 12 / 100;
    let totalPercent = (1 + monthlyPercent) ** inputData.creditPeriod;
    let monthlyPayment = inputData.creditAmount * monthlyPercent * totalPercent / (totalPercent - 1);
    let creditRemains = inputData.creditAmount;

    let startMonth = inputData.startTime.getMonth();
    for(let i = 0; i < inputData.creditPeriod; i++){
        let percentPart = creditRemains * monthlyPercent;
        let creditPart =  monthlyPayment - percentPart;
        let month = {
            monthIndex: startMonth + i,
            percentPart: percentPart,
            creditPart: creditPart,
            creditRemains: Math.abs(creditRemains-creditPart),
        }
        monthsInfo.push(month);
        creditRemains -= creditPart;
    }
    let overpayment = monthlyPayment * inputData.creditPeriod - inputData.creditAmount;
    let total = inputData.creditAmount + overpayment;
    countResults.overpayment = overpayment;
    countResults.total = total;
    countResults.credit = inputData.creditAmount;
}

let getDiffMonths = function () {
    let monthlyPercent = inputData.percentage / 12 / 100;
    let creditPart = inputData.creditAmount / inputData.creditPeriod;
    let creditRemains = inputData.creditAmount;
    let overpayment = 0;
    let startMonth = inputData.startTime.getMonth();
    for (let i = 0; i < inputData.creditPeriod; i++) {
        let percentPart = creditRemains * monthlyPercent;
        overpayment += percentPart;
        let month = {
            monthIndex: startMonth + i,
            percentPart: percentPart,
            creditPart: creditPart,
            creditRemains: Math.abs(creditRemains-creditPart),
        }
        monthsInfo.push(month);
        creditRemains -= creditPart;
    }
    let total = inputData.creditAmount + overpayment;
    countResults.overpayment = overpayment;
    countResults.total = total;
    countResults.credit = inputData.creditAmount;
}

let calculate = function () {

    getAllInputs();
    if (!validateForm(inputData)) return;
    monthsInfo = [];
    inputData.paymentType === 'annuity' ? getAnnuityMonths() : getDiffMonths();
    printGraphics(inputData, monthsInfo, countResults);
    writeDataToWorkbook();
    return false;
}
