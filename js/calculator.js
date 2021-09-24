let inputData = {
    creditAmount: 0,
    percentage: 0,
    periodType: 'years', //years/months
    creditPeriod: 0,
    paymentType: 'annuity', //annuity/differentiated
    startTime: new Date(),
    showInfo: function(){
        console.log('CreditAmount:', this.creditAmount);
        console.log('Percentage:', this.percentage);
        console.log('PeriodType:', this.periodType);
        console.log('Months:', this.creditPeriod);
        console.log('PaymentType:', this.paymentType);
    }
}

let monthsInfo = [];

let getAllInputs = function(){
    inputData.creditAmount = document.getElementById('credit_amount').value;
    inputData.periodType = document.getElementById('period_type').value;
    inputData.creditPeriod = document.getElementById('credit_period').value
        * (inputData.periodType === 'years' ? 12 : 1);
    inputData.percentage = document.getElementById('credit_percentage').value;
    inputData.paymentType = (document.getElementById('annuity_type').checked ? 'annuity' : 'differentiated');
    inputData.startTime = new Date(Date.now());
}

let getAnnuityMonths = function(){
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
        }
        monthsInfo.push(month);
        creditRemains -= creditPart;
    }
}

let getDiffMonths = function(){

}

let calculate = function () {
    getAllInputs();
    monthsInfo = [];
    inputData.paymentType === 'annuity' ? getAnnuityMonths() : getDiffMonths();
    print_chart();
    return false;
}


// d3 printing charts
let getParent = function() {return this.parentElement};

let CHART_WIDTH = 800,
    CHART_HEIGHT = 300;

let hint = d3
    .select('body')
    .append('div')
    .classed('floating_hint', true)
    .append('p')
        .text('Дата')
    .classed('hint_date', true)
    .select(getParent)
    .append('p')
    .text('Проценты')
    .classed('hint_percent', true)
    .select(getParent)
    .append('p')
    .text('Кредит')
    .classed('hint_credit', true)
    .select(getParent)
;

let chart_area = d3
    .select('body')
    .append('div')
    .classed('chart_area', true)
    .style('width', CHART_WIDTH + 'px')
    .style('height', CHART_HEIGHT + 'px')
;

let hAxis_area =
    d3
        .select("body")
        .append('div')
        .classed('hAxis_area', true)
        .style('position', 'absolute')
;

const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

let print_chart = function() {
    let marginScale = d3.scaleLinear()
        .domain([1/200, 1/100, 1])
        .range([0, 1, 5])
        .clamp(true)
    ;
    let heightScale = d3.scaleLinear()
        .domain([
            d3.min(monthsInfo, (d) => {return d.percentPart + d.creditPart;}),
            d3.max(monthsInfo, (d) => {return d.percentPart + d.creditPart;}),
        ])
        .range([0, CHART_HEIGHT])
        .nice()
    ;
    let margins = Math.floor(marginScale(1/inputData.creditPeriod));
    let column_width = Math.max(Math.round(CHART_WIDTH / inputData.creditPeriod - margins), 2); //taking into account margins
    let chart = chart_area
        .selectChildren()
        .data(monthsInfo)
    ;
    // enter
    chart
        .enter()
        .append('div')
        .classed('month_column', true)
        .style('height', (d) => {
            return (inputData.paymentType === 'annuity' ? CHART_HEIGHT : heightScale(d.creditPart + d.percentPart)).toString() + 'px';
        })
        .style('width', column_width.toString() + 'px')
        .style('margin-right', (margins).toString()+'px')
        .append('div')
        .classed('month_percent', true)
        .style('height', (d) => {return Math.round(100 * d.percentPart / (d.percentPart + d.creditPart)).toString() + '%';})
        .select(getParent)
        .append('div')
        .classed('month_credit', true)
        .style('height', (d) => {return Math.round(100 * d.creditPart / (d.percentPart + d.creditPart)).toString() + '%';})
    ;
    // update
    chart
        .style('height', (d) => {
            return (inputData.paymentType === 'annuity' ? CHART_HEIGHT : heightScale(d.creditPart + d.percentPart)).toString() + 'px';})
        .style('width', column_width.toString() + 'px')
        .style('margin-right', (margins).toString()+'px')
        .select('.month_percent')
        .style('height', (d) => {return Math.round(100 * d.percentPart / (d.percentPart + d.creditPart)).toString() + '%';})
        .select(getParent)
        .select('.month_credit')
        .style('height', (d) => {return Math.round(100 * d.creditPart / (d.percentPart + d.creditPart)).toString() + '%';})
    ;
    d3.select('.chart_area')
        .selectChildren()
        .data(monthsInfo)
        .on('mouseover', function(mouseover, d) {
            let month = d.monthIndex;
            let year = inputData.startTime.getFullYear() + Math.floor(month/12);
            month %= 12;
            let monthName = monthNames[month];
            hint
                .select('.hint_date')
                .text(
                    monthName + ' ' + year + ' года'
                )
            ;
        })
        .on('mousemove', function(mousemove, d) {
            let x = mousemove.layerX - 245;
            let y = mousemove.layerY - 70;
            //let year = inputData.startTime.getFullYear();
            // console.log(mousemove);
            // console.log(year);
            // console.log(i);
            // console.log(d);
            hint
                .style('left', x + 'px')
                .style('top', y + 'px')
                .style('display', 'block')
                .select('.hint_percent')
                .text('Проценты: ' + Math.round(d.percentPart))
                .select(getParent)
                .select('.hint_credit')
                .text('Долг: '+ Math.round(d.creditPart))
            ;
        })
        .on('mouseleave', function(mouseleave, d) {
            hint
                .style('display', 'none')
            ;
        })
    ;
    // exit
    chart
        .exit()
        .remove()
    ;
}
