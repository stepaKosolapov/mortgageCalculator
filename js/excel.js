let workbook;

let exportToExcel = function() {
    if (workbook == null) {
        alert('Workbook is empty! \nPlease, type something in the form!');
        return;
    }
    XLSX.writeFile(workbook, 'mortgageReport.xlsx');
}


let writeDataToWorkbook = function() {
    let header = document.getElementById('months_table_header');
    let content = document.getElementById('months_table');
    workbook = XLSX.utils.book_new();
    let worksheet = XLSX.utils.table_to_sheet(header);
    XLSX.utils.sheet_add_dom(worksheet, content, {origin:1});
    let format = "### ### ##0.00";
    for (let i = 2; i < inputData.creditPeriod + 2; i++)
        for (let j = 0; j < 4; j++) {
            XLSX.utils.cell_set_number_format(worksheet[ 'C' + i + ''], format);
            XLSX.utils.cell_set_number_format(worksheet[ 'D' + i + ''], format);
            XLSX.utils.cell_set_number_format(worksheet[ 'E' + i + ''], format);
            XLSX.utils.cell_set_number_format(worksheet[ 'F' + i + ''], format);
        }
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Months_info');
    workbook["Sheets"]["Months_info"]["!cols"] = [{ wch : 3 }, { wch : 15 }, { wch : 20 }, { wch : 20 }, { wch : 20 }, { wch : 20 }];
}