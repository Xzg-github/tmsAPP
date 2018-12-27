import React, { PropTypes } from 'react';
import { Card, ModalWithDrag, SuperTable2} from '../../../../../components';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ChangeRateDialog.less';
import showPopup from '../../../../../standard-business/showPopup';

class ChangeRateDialog extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      items: props.items || [],
      visible: true
    }
  }

  onContentChange = (rowIndex, keyName, keyValue) => {
    const {items} = this.state;
    items[rowIndex][keyName] = keyValue;
    this.setState({items});
  }

  onOk = () => {
    const {onOk} = this.props;
    const {items} = this.state;
    onOk && onOk(items);
    this.setState({visible: false});
  }

  toTable = () => {
    const {cols} = this.props;
    const {items} = this.state;
    const props = {
      cols,
      items,
      maxHeight: "300px",
      callback: {
        onContentChange: this.onContentChange
      }
    }
    return <SuperTable2 {...props}/>
  }

  getProps = () => {
    const {title, afterClose} = this.props;
    return {
      title,
      visible: this.state.visible,
      width: 500,
      maskClosable: false,
      confirmLoading: false,
      onOk: this.onOk,
      onCancel: afterClose,
      afterClose
    }
  }

  render() {
    return (
      <ModalWithDrag {...this.getProps()}>
        <Card className={s.root}>
          {this.toTable()}
        </Card>
      </ModalWithDrag>
    )
  }
}

const Component = withStyles(s)(ChangeRateDialog);

export default async ({items=[], onOk, ...config}) => {
  const payload = {...config, items, onOk};
  await showPopup(Component, payload, true);
}
