
// 获取ID
const checkedId = (tableItems) => {
  const arrId = tableItems.reduce((result, items) => {
    items.checked && result.push(items.currencyTypeCode);
    return result;
  }, []);
  return arrId;
};

// 深拷贝
const deepCopy = (obj) => {
  let str, newObj = obj.constructor === Array ? [] : {};
  if (typeof obj !== 'object') {
    return;
  } else if (window.JSON) {
    str = JSON.stringify(obj),
      newObj = JSON.parse(str);
  } else {
    for (let i in obj) {
      newObj[i] = typeof obj[i] === 'object' ?
        deepCopy(obj[i]) : obj[i];
    }
  }
  return newObj;
};

// 改变superFrom的key=currencyTypeCode的type
const conversion =(controls) => {
  controls.map((item) => {
    if (item.key === 'currencyTypeCode') {
      item.type = 'readonly';
      return item;
    }});
  return controls;
};

const myHelper = {
  checkedId,
  deepCopy,
  conversion
};

export {
  checkedId,
  deepCopy,
  conversion
}

export default myHelper;
