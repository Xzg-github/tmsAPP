import React, {PropTypes} from 'react';
import {ModalWithDrag, SuperTable, SuperToolbar} from '../components/index';
import helper, {fetchJson, postOption} from '../common/common';
import showPopup from "../standard-business/showPopup";
import {getPathValue} from "../action-reducer/helper";
import {Action} from "../action-reducer/action";

const layoutAction = new Action(['layout']);
const URL_SETTING = '/api/permission/table_cols_setting';

class FilterSortDialog extends React.Component {
  static propTypes = {
    ok: PropTypes.string,
    cancel: PropTypes.string,
    tableCols: PropTypes.array,
    tableItems: PropTypes.array,
    onCancel: PropTypes.func,
    onOk: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.handleOk = this.handleOk.bind(this);
    this.initState(props);
  }

  initState = (props) => {
    this.state = {
      tableItems: props.tableItems,
      visible: true,
      ok: false
    };
  };

  handleClick = (key) => {
    let [...items] = this.state.tableItems;
    let checkIndex = -1;
    const checkItems = items.filter((item, index) => {
      if (item.checked === true) {
        checkIndex = index;
        return true;
      }
      return false;
    });
    if (key === 'up') {
      if (checkItems.length !== 1) {
        helper.showError('请勾选一条记录');
        return;
      }
      if (checkIndex === 0) return;
      const checkedItem = checkItems.pop();
      items[checkIndex] = items[checkIndex-1];
      items[checkIndex-1] = checkedItem;
    }else if (key === 'down') {
      if (checkItems.length !== 1) {
        helper.showError('请勾选一条记录');
        return;
      }
      if (checkIndex === items.length-1) return;
      const checkedItem = checkItems.pop();
      items[checkIndex] = items[checkIndex+1];
      items[checkIndex+1] = checkedItem;
    }
    this.setState({...this.state, tableItems: items});
  };

  handleCheck = (isAll, checked, rowIndex) => {
    isAll && (rowIndex = -1);
    if (rowIndex === -1) {
      this.setState({...this.state, tableItems: this.state.tableItems.map(item => ({...item, checked}))});
    }else {
      this.setState({...this.state, tableItems: this.state.tableItems.map((item, index) => index === rowIndex ? ({...item, checked}) : item)});
    }
  };

  toBody = () => {
    const {buttons, tableCols} = this.props;
    const props = {
      cols: tableCols,
      items: this.state.tableItems,
      maxHeight: '400px',
      callback: {
        onCheck: this.handleCheck,
      }
    };
    return (
      <div>
        <SuperToolbar buttons={buttons} size="small" onClick={this.handleClick}/>
        <div style={{marginBottom: 10}} />
        <SuperTable {...props} />
      </div>
    );
  };

  async handleOk() {
    const {tableItems} = this.state;
    const {code} = this.props;
    const state = global.store.getState();
    const path = ['layout', 'tableColsSetting', code];
    const config = getPathValue(state, path) || {};
    const filtersIndex = tableItems.map(item => item.key);
    const newConfig = {...config, filtersIndex};
    global.store.dispatch(layoutAction.assign(newConfig, ['tableColsSetting', code]));
    code && await fetchJson(URL_SETTING, postOption({code, config: newConfig}));
    this.setState({...this.state, visible: false, ok: true});
  };

  getProps = () => {
    const {title, ok, cancel, afterClose} = this.props;
    return {
      title,
      onOk: this.handleOk,
      onCancel: () => {this.setState({...this.state, visible: false})},
      afterClose: () => afterClose(this.state.ok ? this.state.tableItems.map(item => ({...item, checked: undefined})) : false),
      visible: this.state.visible,
      width: 400,
      maskClosable: false,
      okText: ok,
      cancelText: cancel,
    };
  };

  render() {
    return (
      <ModalWithDrag {...this.getProps()}>
        {this.toBody()}
      </ModalWithDrag>
    );
  }
}


/*
* 功能：查询条件排序对话框
* 参数：filters: 【必需】待排序的查询条件数组
*       code: 【必需】数据存储编码，与配置字段功能中code类似
* 返回值：成功返回排序后的filters数组，取消或关闭时返回false
*/
export default async (filters, code) => {
  const props = {
    ok: '确定',
    cancel: '取消',
    title: '查询条件排序',
    buttons: [
      {key:'up', title: '前移'},
      {key:'down', title: '后移'}
    ],
    tableCols:[
      {key:'title', title: '字段名'}
    ],
    tableItems: filters,
    code
  };
  return showPopup(FilterSortDialog, props, true);
};
