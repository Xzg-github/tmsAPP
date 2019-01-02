
import React, {PropTypes} from 'react';
import {Table, Input, Select} from 'antd';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './InvoiceTable.less';
import {NumberInput} from '../../../../../components';
const InputGroup = Input.Group;
const Option = Select.Option;

/** 数字金额大写转换(可以处理整数,小数,负数) */
const toCapitalization = (num=0) => {
  if (typeof Number(num) !== 'number' || Number(num).toString() === 'NaN') return '';
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  // 之所以分开是因为：('元', '万', '亿')是作为类似角分单位计算的，而('拾', '佰', '仟')则是数量量级
  const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']];
  const head = num < 0 ? '负' : '';
  let n = Math.abs(num), s = '';
  for (let i = 0; i < fraction.length; i++) {
    // 计算小数部分（两位小数）
    s += (digit[Math.floor(n * Math.pow(10, i + 1)) % 10] + fraction[i]).replace(/零./, '');
  }
  s = s || '整';
  n = Math.floor(n);
  for (let i = 0; i < unit[0].length && n > 0; i++) {
    // 计算正整数部分
    let p = '';
    for (let j = 0; j < unit[1].length && n > 0; j++) {
      // 从个位往上计算
      p = digit[n % 10] + unit[1][j] + p;
      n = Math.floor(n / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }
  return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
}

const getValue = (value='', type='text', precision=0) => {
  switch (type) {
    case 'number': {
      return String(Number(value).toFixed(Number(precision)))
    }
    default: return value;
  }
}

class InvoiceTable extends React.Component {

  static propTypes = {
    cols: PropTypes.array,
    items: PropTypes.array,
    onChange: PropTypes.func,
    currencyList: PropTypes.array
  }

  onChange = (key, index) => (e) => {
    const {onChange} = this.props;
    const value = typeof e === 'object' ? e.target.value : e;
    onChange && onChange(key, value, index);
  }

  onSelect = (key, index) => (value, option) => {
    const {onSelect} = this.props;
    onSelect && onSelect(key, value, index);
  }

  renderSelect = (col, value='', index) => {
    const {currencyList=[], items} = this.props;
    const props = {
      defaultValue: value,
      className: s.select,
      onSelect: this.onSelect(col.key, index)
    };
    const inputProps = {
      className: s.capital,
      placeholder: '零壹贰叁肆伍陆柒捌玖拾佰仟',
      disabled: true,
      value: toCapitalization(items[0].exchangeAmount)
    };
    return <InputGroup>
      <Select {...props}>
        {currencyList.map((item, index) => {
          const {value, title} = item;
          return <Option value={value} key={index}>{title}</Option>
        })}
      </Select>
      <Input {...inputProps}/>
    </InputGroup>
  }

  renderTotal = (col, value='', index) => {
    const {props={}, otherProps={}} = col;
    const {colSpan=0, prefix='', addonBefore='', align='center', select, type} = otherProps;
    const inputProps = {
      addonBefore,
      value: getValue(`${prefix}${value}`, type, props.precision),
      disabled: !select,
      onChange: this.onChange(col.key, index),
      className: s[`input_${align}`]
    };
    return {
      props: {colSpan},
      children: select ? this.renderSelect(col, value, index) : <Input {...inputProps}/>
    }
  }

  renderCell = (col, value, index) => {
    const {key, title, type, props={}, otherProps={}} = col;
    const val = getValue(value, type, props.precision);
    const inputProps = {
      key, title, type,
      disabled: otherProps.disabled,
      value: val,
      onChange: this.onChange(col.key, index),
    };
    const numberInputProps = {...inputProps, ...props, defaultValue: val};
    return type === 'number' ? <NumberInput {...numberInputProps}/> : <Input {...inputProps}/>
  }

  getColumns = () => {
    const {cols} = this.props;
    return cols.reduce((columns, col) => {
      col.render = (text, record, index) => {
        const value = record[col.key];
        if (index > 0) {
          return this.renderTotal(col, value, index)
        } else {
          return this.renderCell(col, value, index)
        }
      };
      columns.push(col);
      return columns;
    }, []);
  }

  getDataSource = () => {
    const {items=[]} = this.props;
    return items.length > 0 ? items.slice(0, 1).concat([{
      chargeName: items[0].currency,
      remark: items[0].exchangeAmount,
    }]).map((o, i) => ({...o, key: i})) : items;
  }

  render() {
    const props = {
      bordered: true,
      pagination: false,
      columns: this.getColumns(),
      dataSource: this.getDataSource(),
      className: s.root
    };
    return <Table {...props}/>
  }
}

export default withStyles(s)(InvoiceTable);

export {toCapitalization, getValue};
