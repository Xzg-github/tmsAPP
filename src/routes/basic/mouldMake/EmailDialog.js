import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {Button} from 'antd';
import SuperForm from '../../../components/SuperForm';
import {ModalWithDrag} from '../../../components';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EmaiDialog.less';

const defaultSize = 'small';

/**
 * onChange：内容改变时触发，原型func(key, value)
 * onSearch: search组件搜索时触发，原型为(key, value)
 */
class EmailDialog extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    config: PropTypes.object,
    controls: PropTypes.array,
    value: PropTypes.object,
    valid: PropTypes.bool,
    size: PropTypes.oneOf(['small', 'default', 'middle', 'large']),
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
    const {size} = this.props;
    if (size === 'small') {
      return 416;
    } else if (size === 'middle') {
      return 700;
    } else if (size === 'large') {
      return 910;
    } else {
      return 520;
    }
  };

  getProps = () => {
    const {title, config, onOk, onCancel, onFence, visible=true} = this.props;
    return {
      title, visible, onOk, onCancel,
      width: this.getWidth(),
      maskClosable: false,
      okText: config.ok,
      cancelText: config.cancel,
      getContainer: () => ReactDOM.findDOMNode(this).firstChild,
      ...config.fence ? {footer: this.getFooter(config, onOk, onCancel, onFence)} : {}
    };
  };

  getColNumber = () => {
    const {size='default'} = this.props;
    if (size === 'large') {
      return 4;
    } else if (size === 'middle') {
      return 3;
    } else {
      return 2;
    }
  };

  render() {
    return (
      <div>
        <div />
        <ModalWithDrag {...this.getProps()}>
          <SuperForm {...this.props} size={defaultSize} colNum={this.getColNumber()} />
        </ModalWithDrag>
      </div>
    );
  }
}

export default withStyles(s)(EmailDialog);
