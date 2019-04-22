import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {ModalWithDrag, SuperTab2, SuperTable, SuperTable2, Title, Indent, SuperForm} from '../../components';
import s from './Template.less';

const bubbleSort = (arr=[]) => {
  for(let i = 0; i < arr.length-1; i++){
    for(let j = 0; j < arr.length-i-1; j++) {
      if(Number(arr[j].sequence || 65536) > Number(arr[j+1].sequence || 65536)) {
        let temp = arr[j];
        arr[j] = arr[j+1];
        arr[j+1] = temp;
      }
    }
  }
  return arr;
};

class Template extends React.Component {

  toAddPage = () => {
    const {items, cols, controls, value, valid, onContentChange, onCheck, onChange, onExitValid} = this.props;
    const props = {
      items, cols,
      maxHeight: '280px',
      callback:{
        onContentChange,
        onCheck: onCheck.bind(null, 'items')
      }
    };
    const props2 = {
      cols: bubbleSort(items.filter(item => item.checked === true).map(col => ({...col, hide: false}))),
      items: [],
      checkbox: false,
      index: false
    };
    const props3 = {
      value, controls, valid,
      onChange, onExitValid
    };
    return (
      <div>
        <Title title="基本信息" />
        <Indent><SuperForm {...props3} /></Indent>
        <Title title="勾选模板所需列并排序" />
        <Indent><SuperTable2 {...props} /></Indent>
        {props2.cols.length > 0 && (<Title title="模板预览" />)}
        {props2.cols.length > 0 && (<Indent><SuperTable {...props2} /></Indent>)}
      </div>
    )
  };

  toDelPage = () => {
    const {templateCols=[], templateList=[], onCheck} = this.props;
    const props = {
      items: templateList,
      cols: templateCols,
      maxHeight: '350px',
      callback:{
        onCheck: (isAll, checked, rowIndex) => {
          isAll && (rowIndex = -1);
          onCheck('templateList', rowIndex, 'checked', checked);
        }
      }
    };
    const checkedItems = templateList.filter(item => item.checked === true);
    const props2 = {
      cols: checkedItems.length === 1 ? checkedItems[0].cols.map(col => ({...col, hide: false})) : [],
      items: [],
      checkbox: false,
      index: true
    };
    return (
      <div>
        <Title title="勾选需要删除的模板" />
        <Indent><SuperTable {...props} /></Indent>
        {props2.cols.length > 0 && (<Title title="模板预览" />)}
        {props2.cols.length > 0 && (<Indent><SuperTable {...props2} /></Indent>)}
      </div>
    )
  };

  toBody = () => {
    const {activeKey, tabs, onTabChange} = this.props;
    return (
      <div className={s.root}>
        <SuperTab2 activeKey={activeKey} tabs={tabs} onTabChange={onTabChange} />
        {activeKey === 'add' ? this.toAddPage() : this.toDelPage()}
      </div>
    )
  };

  getModalProps = () => {
    const {title, okText, cancelText, visible, confirmLoading, onOk, onCancel, afterClose} = this.props;
    return {
      title,
      onOk,
      onCancel,
      afterClose: () => {afterClose(this.props.res)},
      width: 900,
      visible,
      maskClosable: false,
      okText,
      cancelText,
      confirmLoading
    };
  };

  render () {
    return (
      <ModalWithDrag {...this.getModalProps()}>
        {this.toBody()}
      </ModalWithDrag>
    );
  };
}

export default withStyles(s)(Template);
export {bubbleSort};
