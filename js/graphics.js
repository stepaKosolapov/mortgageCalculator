let getParent = function() {return this.parentElement};

let CHART_WIDTH = 600,
    CHART_HEIGHT = 200,
    ARC_AREA_WIDTH = 300,
    ARC_AREA_HEIGHT = 300,
    ARC_BORDER_WIDTH = 3,
    ANIMATION_DURATION = 4000,
    TABLE_HEIGHT = 362
;

const arcColors = ['#9A3B98', '#00C07F', '#ff00fb', '#00ffa4'];

const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

let switchFormulas = function () {
    if (d3.select('.math_container').node().style.display === 'none') {
        d3
            .select('.math_container')
            .transition()
            .duration(ANIMATION_DURATION / 4)
            .ease(d3.easeExp)
            .style('display', 'block')
            .style('max-height', '2000px')
            .style('padding', '2% 2%')
        ;
    } else {
        d3
            .select('.math_container')
            .transition()
            .duration(ANIMATION_DURATION/4)
            .ease(d3.easeExp)
            .style('padding', '0% 2%')
            .style('max-height', '0px')
        ;
        setTimeout(()=>{
            d3
                .select('.math_container')
                .style('display', 'none')
            ;
        }, 1000);
    }
}

let makeFormulas = function() {
    let description_formulas = [
        'P = \\mathit{ПРОЦЕНТНАЯ\\ СТАВКА\\ ГОДОВЫХ}',
        'p = \\mathit{ЕЖЕМЕСЯЧНАЯ\\ СТАВКА}',
        'T = \\mathit{СРОК\\ ИПОТЕКИ\\ МЕСЯЦЕВ}',
        'S_i = \\mathit{ОСТАТОК\\ КРЕДИТА\\ МЕСЯЦА\\ i}',
        'M_i = \\mathit{ЕЖЕМЕСЯЧНЫЙ\\ ПЛАТЕЖ\\ МЕСЯЦА\\ i}',
        '\\mathit{MP}_i = \\mathit{ПРОЦЕНТНАЯ\\ ЧАСТЬ\\ МЕСЯЦА\\ i}',
        '\\mathit{MC}_i = \\mathit{КРЕДИТНАЯ\\ ЧАСТЬ\\ МЕСЯЦА\\ i}',
        '\\mathit{O} = \\mathit{ПЕРЕПЛАТА}',
    ]
    let annuity_formulas = [
        'p = \\frac {P} {12 \\cdot 100}',
        'M_i = \\frac {S \\cdot p \\cdot (1 + p)^T} {(1 + p)^T - 1}',
        '\\mathit{MP}_i = S_i \\cdot p',
        '\\mathit{MC}_i = M -\\mathit{MP}_i',
        '\\mathit{O} = M \\cdot T - S'
    ];
    let diff_formulas = [
        'p = \\frac {P} {12 \\cdot 100}',
        'M_i = \\mathit{MP}_i + \\mathit{MC}_i',
        '\\mathit{MP}_i = S_i \\cdot p',
        '\\mathit{MC}_i = \\frac {S}{T}',
        '\\mathit{O} = \\sum_{0}^{T} \\mathit{MP}_i'
    ]
    let math_container = d3
        .select('.content')
        .append('div')
        .classed('math_container', true)
        .style('display', 'none')
        .style('max-height', '0px')
        .style('padding', '0 2%')
        .on('mouseover', function(mouseover) {
            window.onclick = null;
        })
        .on('mouseleave', function(mouseleave) {
            window.onclick = function (click) {
                switchFormulas();
                window.onclick = null;
            };
        })
    ;

    math_container
        .append('h2')
        .text('Условные обозначения')
    ;

    let math_description = math_container
        .append('div')
        .classed('math_description', true)
    ;

    math_container
        .append('h2')
        .text('Формулы для аннуитетных платежей')
    ;

    let math_annuity = math_container
        .append('div')
        .classed('math_annuity', true)
    ;

    math_container
        .append('h2')
        .text('Формулы для дифференцированных платежей')
    ;

    let math_diff =  math_container
        .append('div')
        .classed('math_diff', true)
    ;

    math_description
        .selectAll('div')
        .data(description_formulas)
        .enter()
        .append('div')
        .classed('math_formula', function(d, i) {
            let element = this;
            katex.render(d, element, {throwOnError: false, strict: false});
            return true;
        })
    ;
    math_annuity
        .selectAll('div')
        .data(annuity_formulas)
        .enter()
        .append('div')
        .classed('math_formula', function(d, i) {
            let element = this;
            katex.render(d, element, {throwOnError: false, strict: false});
            return true;
        })
    ;
    math_diff
        .selectAll('div')
        .data(diff_formulas)
        .enter()
        .append('div')
        .classed('math_formula', function(d, i) {
            let element = this;
            katex.render(d, element, {throwOnError: false, strict: false});
            return true;
        })
    ;
}

makeFormulas();

let isStructureExists = false;

// the main function that starts printing all graphic elements
let printGraphics = function(inputData, monthsInfo, countResults) {
    if (!isStructureExists) {
        makeHtmlStructure();
        isStructureExists = true;
    }
    d3
        .select('.charts')
        .style('max-height', '0')
        .style('padding', '0 5%')
    ;
    d3
        .select('.charts')
        .transition()
        .duration(ANIMATION_DURATION/2)
        .ease(d3.easeExp)
        .style('max-height', '3000px')
        .style('padding', '5% 5%')
    ;
    printOutputInfo(inputData, monthsInfo, countResults);

    printArc(countResults);

    printChart(inputData, monthsInfo);

    printTable(monthsInfo);
};

// fills in the fields with information about the loan
let printOutputInfo = function (inputData, monthsInfo, countResults) {
    d3
        .select('.monthly_payment_info_output')
        .text(function () {
            let result;
            if (inputData.paymentType === 'annuity') {
                result = Math.round(monthsInfo[0].percentPart + monthsInfo[0].creditPart);
            } else {
                result = Math.round(monthsInfo[0].percentPart + monthsInfo[0].creditPart) + ' .. ' +
                    Math.round(monthsInfo[monthsInfo.length - 1].percentPart + monthsInfo[monthsInfo.length - 1].creditPart);
            }
            return result + '₽';
        })
    ;
    d3
        .select('.percent_info_output')
        .text(Math.round(countResults.overpayment) + '₽')
    ;
    d3
        .select('.total_info_output')
        .text(Math.round(countResults.total) + '₽')
    ;

}

// adds html-containers needed to show all graphics
let makeHtmlStructure = function () {
    let charts = d3.select('body')
        .append('section')
        .classed('charts', true)
        .style('overflow', 'hidden')
    ;
    charts
        .append('h2')
        .text('Общая информация о кредите')
    ;
    let credit_info = charts
        .append('div')
        .classed('credit_info', true)
    ;
    let info_text = credit_info
            .append('div')
            .classed('info_text', true)
    ;
    info_text
        .append('div')
        .classed('info_row', true)

        .append('span')
        .text('Ежемесячный платёж: ')
        .select(getParent)
        .append('span')
        .classed('monthly_payment_info_output', true)
    ;
    info_text
        .append('div')
        .classed('info_row', true)

        .append('span')
        .text('Начисленные проценты: ')
        .select(getParent)
        .append('span')
        .classed('percent_info_output', true)
    ;
    info_text
        .append('div')
        .classed('info_row', true)
        .append('span')
        .text('Долг + проценты: ')
        .select(getParent)
        .append('span')
        .classed('total_info_output', true)
    ;
    credit_info
        .append('div')
        .classed('arc_container', true)
    ;
    charts
        .append('h2')
        .text('График ежемесячных платежей')
    ;
    let months_info = charts
        .append('div')
        .classed('months_info', true)
    ;

    months_info
        .append('div')
        .classed('chart_container', true)
    ;
    charts
        .append('h2')
        .text('Таблица платежей')
    ;
    let table_container = charts
        .append('div')
        .classed('table_container', true)
    ;

    let months_table_head = table_container
        .append('table')
        .classed('months_table_header', true)
        .attr('id', 'months_table_header')
        .attr('width', (100 - 100*16/table_container.node().getBoundingClientRect().width)+'%')
    ;
    months_table_head
        .append('tr')

        .append('th') // index
        .text('№')
        .style('width', '5%')
        .select(getParent)

        .append('th') // month name
        .text('Месяц')
        .style('width', '17%')
        .select(getParent)

        .append('th') // total monthly payment
        .text('Ежемесячный платёж')
        .style('width', '21%')
        .select(getParent)

        .append('th') // credit part
        .text('Кредитная часть')
        .style('width', '19%')
        .select(getParent)

        .append('th') // percent part
        .text('Процентная часть')
        .style('width', '19%')
        .select(getParent)

        .append('th') // credit remains
        .text('Остаток долга')
        .style('width', '19%')
        .select(getParent)
    ;
    let months_table_content = table_container
        .append('div')
        .classed('months_table_content', true)
        .style('overflow-y', 'scroll')
        .style('height', TABLE_HEIGHT + 'px')
    ;
    window.months_table = months_table_content
        .append('table')
        .classed('months_table', true)
        .attr('width', '100%')
        .attr('id', 'months_table')
    ;

    window.arcArea = d3
        .select('.arc_container')
        .append('svg')
        .classed('arc_area', true)
        .attr("width", ARC_AREA_WIDTH + ARC_BORDER_WIDTH * 2)
        .attr("height", ARC_AREA_HEIGHT + ARC_BORDER_WIDTH * 2)
    ;
    window.chartArea = d3
        .select('.chart_container')
        .append('svg')
        .classed('chart_area', true)
        .attr('width', CHART_WIDTH)
        .attr('height', CHART_HEIGHT)
    ;
};

// prints arc-diagram
let printArc = function(countResults) {
    d3.select('.arc_container')
        .style('width', (ARC_AREA_WIDTH + ARC_BORDER_WIDTH * 2) + 'px')
        .style('height', (ARC_AREA_HEIGHT + ARC_BORDER_WIDTH * 2) + 'px')
    ;
    let arcTween = function () {
        return function(d) {
            let interpolate = d3.interpolate(d.startAngle, d.endAngle);
            return function(t) {
                d.endAngle = interpolate(t);
                return arc(d);
            };
        };
    };
    const data = [countResults.overpayment, countResults.credit];
    const arcs = d3.pie()(data);
    let arc = d3
        .arc()
        .innerRadius(0)
        .outerRadius(ARC_AREA_HEIGHT/2)
    ;
    // enter
    arcArea
        .selectAll("path")
        .data(arcs)
        .enter()
        .append("path")
        .attr('class', function(d, i){
            return (i === 0) ? 'arc_overpayment' : 'arc_credit';})
        .attr("transform", "translate(" + (ARC_AREA_WIDTH/2 + ARC_BORDER_WIDTH) + ',' + (ARC_AREA_HEIGHT/2 + ARC_BORDER_WIDTH) + ")")
        .attr("fill", (d, i) => {return arcColors[i];})
    ;
    // update
    arcArea
        .selectAll("path")
        .data(arcs)
        .attr("d", arc)
        .style('stroke-width', 0)
        .transition()
        .duration(ANIMATION_DURATION)
        .ease(d3.easeExp)
        .attrTween("d", arcTween())
        .style("stroke", "white")
        .style("stroke-width", ARC_BORDER_WIDTH + 'px')
    ;

    arcArea
        .selectAll("path")
        .data(arcs)
        .on('mouseover', function(mouseover, d) {
            if (d3.select(mouseover.target).classed('arc_overpayment')) {
                d3
                    .select(mouseover.target)
                    .attr("fill",  arcColors[2])
                ;
            } else {
                d3
                    .select(mouseover.target)
                    .attr("fill",  arcColors[3])
                ;
            }
            d3
                .selectAll('.floating_hint')
                .remove()
            ;
            d3
                .select('.arc_container')
                .append('div')
                .classed('floating_hint', true)
                .style('opacity', .0)
                .style('left', mouseover.offsetX + 'px')
                .style('top', mouseover.offsetY + 'px')
                .append('p')
                .text((d3.select(mouseover.target).classed('arc_overpayment') ? 'Проценты: ' : 'Кредит: ') + Math.round(d.value))
                .classed(d3.select(mouseover.target).classed('arc_overpayment') ? 'hint_percent' : 'hint_credit', true)
                .select(getParent)
                .append('p')
                .text('Доля от всех выплат: ' + Math.round(100 * d.value / countResults.total) + '%')
                .classed('hint_arc_percent', true)
            ;

        })
        .on('mousemove', function(mousemove) {
            let x = mousemove.offsetX;
            let y = mousemove.offsetY;
            d3
                .select('body')
                .select('.floating_hint')
                .style('left', x + 'px')
                .style('top', y + 'px')
                .style('opacity', .9)
            ;
        })
        .on('mouseleave', function(mouseleave) {
            if (d3.select(mouseleave.target).classed('arc_overpayment')) {
                d3
                    .select(mouseleave.target)
                    .attr("fill",  arcColors[0])
                ;
            } else {
                d3
                    .select(mouseleave.target)
                    .attr("fill",  arcColors[1])
                ;
            }
            d3
                .selectAll('.floating_hint')
                .remove()
            ;
        })
    ;

};

// prints chart
let printChart = function(inputData, monthsInfo) {
    d3.select('.chart_container')
        .style('width', CHART_WIDTH + 'px')
        .style('height', CHART_HEIGHT + 'px')
    ;
    let heightScale = d3.scaleLinear()
        .domain([
            0,
            d3.max(monthsInfo, (d) => {return d.percentPart + d.creditPart;}),
        ])
        .range([0, CHART_HEIGHT])
    ;
    let marginScale = d3.scaleLinear()
        .domain([1, 300, 600])
        .range([0, 0, 0])
    ;

    d3.select('.axes').remove();
    let x = d3.scaleLinear()
        .domain([0, inputData.creditPeriod])
        .range([0, CHART_WIDTH])
    ;
    let y = d3.scaleLinear()
        .domain([0, parseInt(monthsInfo[0].percentPart + monthsInfo[0].creditPart)])
        .range([CHART_HEIGHT, 0])
    ;
    let axes = d3.select('.chart_container')
        .append('svg')
        .classed('axes', true)
        .attr('width', CHART_WIDTH + 200)
        .attr('height', CHART_HEIGHT + 100)
        .attr("transform", "translate(-100," + (-CHART_HEIGHT -50)+ ")")
    ;
    axes
        .append("g")
        .attr("transform", "translate(100, " + (CHART_HEIGHT + 50) + ")")
        .call(d3.axisBottom(x))
        .selectAll('path')
        .attr('stroke', 'white')
        .attr('stroke-width', 2 +'px')
        .select(getParent)
        .selectAll('line')
        .attr('stroke', 'white')
        .attr('stroke-width', 2 +'px')
        .select(getParent)
        .selectAll('text')
        .style('color', 'white')
        .style('font-family', '\'Montserrat\', sans-serif')
        .style('font-size', '12px')
        .style('font-weight', '600')
    ;
    axes
        .append("g")
        .attr("transform", "translate(95, 45)")
        .call(d3.axisLeft(y))
        .selectAll('path')
        .attr('stroke', 'white')
        .attr('stroke-width', 2 +'px')
        .select(getParent)
        .selectAll('line')
        .attr('stroke', 'white')
        .attr('stroke-width', 2 +'px')
        .select(getParent)
        .selectAll('text')
        .style('color', 'white')
        .style('font-family', '\'Montserrat\', sans-serif')
        .style('font-size', '12px')
        .style('font-weight', '600')
    ;

    let margins = Math.max(marginScale(inputData.creditPeriod), 1);
    let columnWidth = Math.max(Math.round(CHART_WIDTH / inputData.creditPeriod - margins), 1); //taking into account margins
    let chart = chartArea
        .selectAll('g')
        .data(monthsInfo)
    ;
    // enter
    let monthColumn = chart
        .enter()
        .append('g')
        .classed('month_column', true)
        ;

    monthColumn
        .append('rect')
        .attr('fill', arcColors[1])
        .classed('month_credit', true)
        .select(getParent)
        .append('rect')
        .attr('fill', arcColors[0])
        .classed('month_percent', true)
    ;
    // update
    chartArea
        .selectAll('g')
        .data(monthsInfo)
        .attr("transform", function(d, i) {
            return "translate(" + (i * (columnWidth + margins)) + "," + CHART_HEIGHT + ")";
        })
        .select('.month_credit')
        .attr("transform", function(d) {
            let colHeight = heightScale(d.creditPart + d.percentPart);
            let creditHeight = (d.creditPart / (d.creditPart + d.percentPart)) * colHeight;
            return "translate(0, " + (-creditHeight) + ")";
        })
        .attr('height', 0)
        .attr('width', columnWidth)

        .select(getParent)

        .select('.month_percent')
        .attr("transform", function(d, i) {
            let colHeight = heightScale(d.creditPart + d.percentPart);
            let creditHeight = (d.creditPart / (d.creditPart + d.percentPart)) * colHeight;
            let percentHeight = (d.percentPart / (d.creditPart + d.percentPart)) * colHeight;
            return "translate(0, " + (-creditHeight - percentHeight) + ")";
        })
        .attr('height', 0)
        .attr('width', columnWidth)
    ;
    chartArea
        .selectAll('g')
        .data(monthsInfo)
        .select('.month_percent')
        .transition()
        .duration(function(d) {
            return (d.percentPart / (d.creditPart + d.percentPart)) * ANIMATION_DURATION;
        })
        .ease(d3.easeBackOut)
        .attr('height', function(d, i) {
            let colHeight = heightScale(d.creditPart + d.percentPart);
            return (d.percentPart / (d.creditPart + d.percentPart)) * colHeight;
        })
        .select(getParent)
        .select('.month_credit')
        .transition()
        .duration(function(d) {
            return (d.creditPart / (d.creditPart + d.percentPart)) * ANIMATION_DURATION;
        })
        .ease(d3.easeExp)
        .attr('height', function(d) {
            let colHeight = heightScale(d.creditPart + d.percentPart);
            return (d.creditPart / (d.creditPart + d.percentPart)) * colHeight;
        })
    ;

    d3.select('.chart_area')
        .selectChildren()
        .data(monthsInfo)
        .on('mouseover', function(mouseover, d) {
            d3
                .select(mouseover.target)
                .select(getParent)
                .select('.month_percent')
                .attr("fill",  arcColors[2])
            ;
            d3
                .select(mouseover.target)
                .select(getParent)
                .select('.month_credit')
                .attr("fill",  arcColors[3])
            ;
            d3.select('body')
                .selectAll('.floating_hint')
                .remove()
            ;
            let hint = d3
                .select('.chart_container')
                .append('div')
                .classed('floating_hint', true)
                .style('opacity', .0)
                .style('left', mouseover.offsetX + 'px')
                .style('top', mouseover.offsetX + 'px')
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
            let x = mousemove.offsetX;
            let y = mousemove.offsetY;
            d3.select('body')
                .select('.floating_hint')
                .style('left', x + 'px')
                .style('top', y + 'px')
                .style('opacity', .9)
                .select('.hint_percent')
                .text('Проценты: ' + Math.round(d.percentPart))
                .select(getParent)
                .select('.hint_credit')
                .text('Долг: '+ Math.round(d.creditPart))
            ;
        })
        .on('mouseleave', function(mouseleave) {
            console.log(mouseleave);
            d3
                .select(mouseleave.target)
                .select('.month_percent')
                .attr("fill",  arcColors[0])
            ;
            d3
                .select(mouseleave.target)
                .select('.month_credit')
                .attr("fill",  arcColors[1])
            ;
            d3.select('body')
                .selectAll('.floating_hint')
                .remove()
            ;
        })
    ;
    // exit
    chart
        .exit()
        .remove()
    ;
};

// prints a table containing information about each month
let printTable = function (monthsInfo) {

    window.months_table
        .selectAll('tr')
        .data(monthsInfo)
        .enter()
        .append('tr')

        .append('td') // index
        .classed('table_index', true)
        .style('width', '5%')
        .select(getParent)

        .append('td') // month name
        .classed('table_month_name', true)
        .style('width', '17%')
        .select(getParent)

        .append('td') // total monthly payment
        .classed('table_total', true)
        .style('width', '21%')
        .select(getParent)

        .append('td') // credit part
        .classed('table_credit', true)
        .style('width', '19%')
        .select(getParent)

        .append('td') // percent part
        .classed('table_percent', true)
        .style('width', '19%')
        .select(getParent)

        .append('td') // credit remains
        .classed('table_remains', true)
        .style('width', '19%')
        .select(getParent)
    ;

    // update
    window.months_table
        .selectAll('tr')
        .data(monthsInfo)
        .select('.table_index') // index
        .text(function (d, i) {return i + 1;})
        .select(getParent)

        .select('.table_month_name') // month name
        .text(function (d) {
            let month = d.monthIndex;
            let year = inputData.startTime.getFullYear() + Math.floor(month/12);
            month %= 12;
            let monthName = monthNames[month];
            return monthName + ' ' + year;
        })
        .select(getParent)

        .select('.table_total') // total monthly payment
        .text(function (d, i) {return (d.creditPart + d.percentPart).toFixed(2);})
        .select(getParent)

        .select('.table_credit') // credit part
        .text(function (d, i) {return d.creditPart.toFixed(2);})
        .select(getParent)

        .select('.table_percent') // percent part
        .text(function (d, i) {return d.percentPart.toFixed(2);})
        .select(getParent)

        .select('.table_remains') // credit remains
        .text(function (d, i) {return d.creditRemains.toFixed(2);})
        .select(getParent)
    ;

    // exit
    window.months_table
        .selectAll('tr')
        .data(monthsInfo)
        .exit()
        .remove()
    ;

};