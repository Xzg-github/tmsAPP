import XLSX from 'xlsx';
import ExportJsonExcel from 'js-export-excel';
const excel = {};

// 导出excel
excel.exportExcel = (cols, items, name) => {
  const option = {
    fileName: name,
    datas: [{
      sheetFilter: cols.map(col => col.key),
      sheetHeader: cols.map(col => col.title),
      sheetData: items,
    }]
  };
  new ExportJsonExcel(option).saveExcel();
};

const defaultConvert = (cols, arr) => {
  if (!arr.length) {
    return arr;
  } else {
    const colIndex = [];
    const result = [];
    for (let col of cols) {
      const index = arr[0].findIndex(title => title === col.title);
      if (index < 0) {
        return null;
      } else {
        colIndex.push(index);
      }
    }
    for (let i = 1; i < arr.length; i++) {
      const length = arr[i].length;
      const item = {};
      result.push(item);
      for (let j = 0; j < cols.length; j++) {
        const index = colIndex[j];
        if (index < length) {
          item[cols[j].key] = arr[i][index];
        }
      }
    }
    return result;
  }
};

// 导入excel
excel.importExcel = (cols, callback, convert=defaultConvert) => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';
  input.onchange = (e) => {
    if (e.target.files.length === 1) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const wb = XLSX.read(new Uint8Array(e.target.result), {type: 'array'});
        const header = convert ? 1 : cols.map(col => col.key);
        const arr = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {raw: false, header});
        callback(convert ? convert(cols, arr) : arr);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };
  input.click();
};

export default excel;

