import React, { PropTypes } from 'react';
import { Indent, SuperTable, ModalWithDrag} from '../../../../../components';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './GetChargeDialog.less';
import showPopup from '../../../../../standard-business/showPopup';
import {updateOne} from '../../../../../action-reducer/array';

class GetChargeDialog extends React.Component {

  constructor (props) {
    super(props);
    this.state = {...props};
  }

  onCheck = (isAll, checked, rowIndex) => {
    const {items} = this.state;
    const newItems = isAll ? items.map(o => {
      o.checked = checked;
      return o;
    }) : updateOne(items, rowIndex, {checked});
    this.setState({
      items: newItems
    })
  }

  onOk = () => {
    const {onOk} = this.props;
    const {items} = this.state;
    const checkList = items.filter(o => o.checked);
    onOk && onOk(checkList);
    this.onCancel();
  }

  onCancel = () => {
    this.setState({visible: false});
  }

  toTable = () => {
    const {cols, items} = this.state;
    const props = {
      cols,
      items,
      maxHeight: "400px",
      callback: {onCheck: this.onCheck}
    }
    return <SuperTable {...props}/>
  }

  getProps = () => {
    const {title, afterClose} = this.props;
    const {visible} = this.state;
    return {
      title,
      visible,
      width: 500,
      maskClosable: false,
      confirmLoading: false,
      onOk: this.onOk,
      onCancel: this.onCancel,
      afterClose
    }
  }

  render() {
    return (
      <ModalWithDrag {...this.getProps()}>
        <Indent>{this.toTable()}</Indent>
      </ModalWithDrag>
    )
  }
}

const Component =  withStyles(s)(GetChargeDialog);

const buildProps = (items=[], onOk) => {
  return {
    title: '获取费用项',
    cols: [
      {key: 'title', title: '费用项名称'}
    ],
    items,
    visible: true,
    onOk
  }
}

export default async (list, onOk) => {
  const props = buildProps(list, onOk);
  showPopup(Component, props);
}
