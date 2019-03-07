import React from 'react';
import {ModalWithDrag, SuperTable} from '../../../components';
import showPopup from '../../../standard-business/showPopup';
import helper from "../../../common/common";

class AddDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      tableItems: props.tableItems
    }
  }

  onHandleCheck= (isAll, checked, rowIndex) => {
    isAll && (rowIndex = -1);
    let tableItems = [...this.state.tableItems];
    if (rowIndex === -1) {
      tableItems = this.state.tableItems.map(item => ({...item, checked}));
    }else {
      tableItems[rowIndex] = {...tableItems[rowIndex], checked};
    }
    this.setState({...this.state, tableItems});
  };

  onHandleOk = () => {
    const checkedItems = this.state.tableItems.filter(item => item.checked === true);
    if (checkedItems.length < 1) return helper.showError(`请先勾选记录`);
    this.setState({visible: false, res: checkedItems.map(item => ({...item, checked: undefined}))});
  };

  toTable = () => {
    const props = {
      items: this.state.tableItems,
      cols: this.props.tableCols,
      maxHeight: '500px',
      callback: {
        onCheck: this.onHandleCheck
      }
    };
    return <SuperTable {...props} />;
  };

  getModeProps = () => {
    return {
      title: '添加快捷菜单',
      okText: '确定',
      cancelText: '取消',
      visible: this.state.visible,
      maskClosable: false,
      width: 600,
      onOk: this.onHandleOk,
      onCancel: () => this.setState({visible: false}),
      afterClose: () => this.props.afterClose(this.state.res)
    };
  };

  render() {
    return (
      <ModalWithDrag {...this.getModeProps()}>
        {this.toTable()}
      </ModalWithDrag>
    );
  }
}

export default (tableItems, tableCols) => {
  return showPopup(AddDialog, {tableItems, tableCols}, true);
};
