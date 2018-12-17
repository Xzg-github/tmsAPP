import React, { PropTypes } from 'react';
import { Card, SuperTable, ModalWithDrag} from '../../../../../components';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './JoinDialog.less';
import showPopup from '../../../../../standard-business/showPopup';
import {updateOne} from '../../../../../action-reducer/array';

class JoinDialog extends React.Component {

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
      width: 1000,
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
        <Card>
          {this.toTable()}
        </Card>
      </ModalWithDrag>
    )
  }
}

const Component =  withStyles(s)(JoinDialog);

const buildProps = (config, onOk) => {
  return {
    title: '费用引入',
    ...config,
    visible: true,
    onOk
  }
}

export default async (config, onOk) => {
  const props = buildProps(config, onOk);
  showPopup(Component, props);
}
