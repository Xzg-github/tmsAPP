/**
 * Created by vincentzheng on 2017/8/5.
 */
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {getTitle} from '../../../../../components/Control';
import {Table, Checkbox, Button} from 'antd';
import SuperTableCell, {isInRegion} from '../../../../../components/SuperTable2/SuperTableCell';
import s from '../../../../../components/SuperTable2/SuperTable2.less';

const TypeEnum = [
  'readonly',
  'index',
  'checkbox',
  'text',
  'number',
  'select',
  'search',
  'date',
  'button',
  'custom'
];

/**
 * key：标识所在列，在一个表格中必须唯一
 * title：列的标题，type为checkbox时，title为空字符串时，表头才会显示为复选框
 * type：嵌入的表单元素类型
 * options: 对象(包含value和title)数组
 * props：传递参数给被嵌入的组件
 * align：对齐方式，index默认center，其他类型默认为left
 */
const ColType = {
  key: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOf(TypeEnum).isRequired,
  align: PropTypes.oneOf(['left', 'center', 'right']),
  hide: PropTypes.bool,
  options: PropTypes.array,
  props: PropTypes.any
};

/**
 * onCheck：点击复选框时触发，原型func(rowIndex, keyName, checked)
 * onContentChange: 输入框内容改变时触发，原型为function(rowIndex, keyName, value)
 * onSearch：search组件输入内容时触发，原型为function(rowIndex, keyName, value)
 * onRenderCustom：(废弃)用于渲染type为custom类型的单元格，原型为function(rowIndex, keyName, value，props)
 */
const CallbackType = {
  onExitValid: PropTypes.func,
  onCheck: PropTypes.func,
  onContentChange: PropTypes.func,
  onSearch: PropTypes.func,
  onRenderCustom: PropTypes.func
};

class SuperTable2 extends React.Component {
  static propTypes = {
    cols: PropTypes.arrayOf(PropTypes.shape(ColType)).isRequired,
    items: PropTypes.array.isRequired,
    valid: PropTypes.bool,
    callback: PropTypes.shape(CallbackType)
  };

  onCheck = (key, rowIndex) => (e) => {
    const {onCheck} = this.props.callback || {};
    if (onCheck) {
      onCheck(rowIndex, key, e.target.checked);
    }
  };

  onChange = (key, rowIndex) => (value) => {
    const {onContentChange} = this.props.callback || {};
    this.closeValid();
    if (onContentChange) {
      onContentChange(rowIndex, key, value);
    }
  };

  onSearch = (key, rowIndex) => (value) => {
    const {onSearch} = this.props.callback || {};
    if (onSearch) {
      onSearch(rowIndex, key, value);
    }
  };

  onBlur = () => {
    this.closeValid();
  };

  closeValid = () => {
    if (this.props.valid) {
      this.props.callback.onExitValid();
    }
  };

  getOptions = (key, colOptions, index) => {
    const {options} = this.props.items[index];
    if (options && Array.isArray(options[key])) {
      return options[key];
    } else {
      return colOptions;
    }
  };

  validField = (required, value) => {
    if (!this.props.valid || this.error || !required || value) {
      return false;
    } else if (typeof value === 'number') {
      return false;
    } else {
      this.error = true;
      return true;
    }
  };

  renderEditableCell = ({key, type, options, props, required}, value, index) => {
    const cellProps = {
      type, props, value,
      width: 100,
      error: this.validField(required, value),
      options: this.getOptions(key, options, index),
      onChange: this.onChange(key, index),
      onSearch: this.onSearch(key, index),
      onBlur: this.onBlur
    };
    return {
      children: <SuperTableCell {...cellProps} />,
      props: {style: {width: 1}}
    };
  };

  renderCell = (col) => (value, record, index) => {
    if (col.type === 'checkbox') {
      return <Checkbox onChange={this.onCheck(col.key, index)} checked={value || false}/>;
    } else if (col.type === 'index') {
      return {children: index + 1, props: {style: {width: 1}}};
    } else if (col.type === 'button') {
      const onClick = this.props.callback.onBtnClick.bind(null, index, col.key);
      return <Button onClick={onClick} size='small'>{col.typeRelated}</Button>;
    } else if (col.type === 'custom') {
      return this.props.callback.onRenderCustom(index, col.key, value, col.props);
    } else {
      return this.renderEditableCell(col, value, index);
    }
  };

  getCheckedStatus = (key) => {
    let has = false, not = false;
    const {items} = this.props;
    for (const item of items) {
      item[key] ? (has = true) : (not = true);
    }
    return {checked: has && !not, indeterminate: has && not};
  };

  getColumnTitle = ({required, title, type, key}) => {
    if (type === 'checkbox') {
      const status = this.getCheckedStatus(key);
      return <Checkbox onChange={this.onCheck(key, -1)} {...status} />;
    } else if (required) {
      return <span className={s.required}>{title}</span>;
    } else {
      return title;
    }
  };


  getColumnClassName = ({type, align}) => {
    if (type === 'index') {
      return s.center;
    } else if (type === 'checkbox') {
      return 'ant-table-selection-column';
    } else {
      return align ? s[align] : '';
    }
  };

  getColumns = (cols, onCellClick) => {
    return cols.filter(col => !col.hide).map(col => {
      const newState = {
        className: this.getColumnClassName(col),
        title: this.getColumnTitle(col),
        dataIndex: col.key,
        render: this.renderCell(col),
        onCellClick: col.cellClick ? onCellClick : undefined
      };
      return Object.assign({}, col, newState);
    });
  };

  getDataSource = (items, cols) => {
    return items.map((item, index) => {
      return cols.reduce((result, {key, options}) => {
        result[key] = getTitle(item[key], options);
        return result;
      }, {key: index});
    });
  };

  getProps = () => {
    const {cols, items, callback} = this.props;
    return {
      className: s.root,
      columns: this.getColumns(cols, callback.onCellClick),
      dataSource: this.getDataSource(items, cols),
      style: {whiteSpace: 'nowrap'},
      size: 'small',
      scroll: {x: true},
      pagination: false,
    };
  };

  render() {
    this.error = false;
    return (
      <div style={{maxHeight: '500px', overflowY: 'scroll'}}>
        <Table {...this.getProps()} />
      </div>
    );
  }
}

export default withStyles(s)(SuperTable2);
