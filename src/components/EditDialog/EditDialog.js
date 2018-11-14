import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {Button} from 'antd';
import SuperForm from '../SuperForm';
import ModalWithDrag from '../ModalWithDrag';

const defaultSize = 'small';

/**
 * inset: 是否嵌入，默认为true
 * onChange：内容改变时触发，原型func(key, value)
 * onSearch: search组件搜索时触发，原型为(key, value)
 */
class EditDialog extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    config: PropTypes.object,
    controls: PropTypes.array,
    value: PropTypes.object,
    valid: PropTypes.bool,
    size: PropTypes.oneOf(['extra-small', 'small', 'default', 'middle', 'large']),
    inset: PropTypes.bool,
    onFence: PropTypes.func,
    onCancel: PropTypes.func,
    onOk: PropTypes.func,
    onChange: PropTypes.func,
    onSearch: PropTypes.func,
    onExitValid: PropTypes.func
  };

  getFooter = (config, onOk, onCancel, onFence) => {
    return [
      <Button key='1' size='large' onClick={onCancel}>{config.cancel}</Button>,
      <Button key='2' size='large' onClick={onFence}>{config.fence}</Button>,
      <Button key='3' size='large' onClick={onOk} type='primary'>{config.ok}</Button>
    ];
  };

  getWidth = () => {
    const {size='default'} = this.props;
    if (size === 'small') {
      return 416;
    } else if (size === 'middle') {
      return 700;
    } else if (size === 'large') {
      return 910;
    } else if (size === 'default') {
      return 520;
    } else {
      return 260;
    }
  };

  getProps = () => {
    const {title, config, onFence, visible=true, inset=true} = this.props;
    const onOk = this.props.onOk.bind(null, this.props);
    const onCancel = this.props.onCancel.bind(null, this.props);
    const extra = {};
    inset && (extra.getContainer = () => ReactDOM.findDOMNode(this).firstChild);
    config.fence && (extra.footer = this.getFooter(config, onOk, onCancel, onFence));
    return {
      title, visible, onOk, onCancel,
      width: this.getWidth(),
      maskClosable: false,
      okText: config.ok,
      cancelText: config.cancel,
      ...extra
    };
  };

  getColNumber = () => {
    const {size='default'} = this.props;
    if (size === 'large') {
      return 4;
    } else if (size === 'middle') {
      return 3;
    } else if ((size === 'default') || (size === 'small')) {
      return 2;
    } else {
      return 1;
    }
  };

  render() {
    const {inset=true} = this.props;
    if (inset) {
      return (
        <div>
          <div />
          <ModalWithDrag {...this.getProps()}>
            <SuperForm {...this.props} size={defaultSize} colNum={this.getColNumber()} />
          </ModalWithDrag>
        </div>
      );
    } else {
      return (
        <ModalWithDrag {...this.getProps()}>
          <SuperForm {...this.props} size={defaultSize} colNum={this.getColNumber()} />
        </ModalWithDrag>
      );
    }
  }
}

export default EditDialog;
