import React, { PropTypes } from 'react';
import {SuperForm, ModalWithDrag} from '../../../components';
import s from './EditDialog.less';

/**
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
    size: PropTypes.oneOf(['small', 'default', 'middle', 'large']),
    onCancel: PropTypes.func,
    onOk: PropTypes.func,
    onChange: PropTypes.func,
    onSearch: PropTypes.func,
    onExitValid: PropTypes.func
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
    const {title, config, onOk, onCancel} = this.props;
    return {
      title, onOk, onCancel,
      width: this.getWidth(),
      visible: true,
      maskClosable: false,
      okText: config.ok,
      cancelText: config.cancel,
      //getContainer: () => ReactDOM.findDOMNode(this).firstChild
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

  toForm = () => {
    const {controls, value, onChange, onSearch, onExitValid,  valid} = this.props;
    const props = {
      controls,
      value,
      size: 'small',
      onChange,
      onSearch,
      onExitValid,
      valid
    };
    return <SuperForm {...props} bsSize='small' colNum={3}/>;
  };

  render() {
    const { title, config, onOk, onCancel} = this.props;
    return (
      <div className={s.root}>
        <div />
        <ModalWithDrag {...this.getProps(title, config, onOk, onCancel)}>
          {this.toForm()}
        </ModalWithDrag>
      </div>
    );
  }
}

export default EditDialog;
