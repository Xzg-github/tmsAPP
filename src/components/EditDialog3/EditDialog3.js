import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {Button} from 'antd';
import SuperForm from '../SuperForm/SuperForm';
import Title from '../Title/Title';
import ModalWithDrag from '../ModalWithDrag/ModalWithDrag';

const defaultSize = 'small';

/**多个带标题的form循环输出，controls数据结构为：
  * const controls = [
      {key: 'baseInfo', title: '基本信息', data: baseInfo},
      {key: 'cooperationInfo', title: '合作信息', data: cooperationInfo}
    ];
    其中，dada才是原来的controls
 * inset: 是否嵌入，默认为true
 * onChange：内容改变时触发，原型func(key, value)
 * onSearch: search组件搜索时触发，原型为(key, value)
 */
class EditDialog3 extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    config: PropTypes.object,
    controls: PropTypes.array,
    value: PropTypes.object,
    valid: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
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

  toContent = () => {
    return (
      <ModalWithDrag {...this.getProps()}>
        {this.props.controls.map((item, index)=>{
          const props = {...this.props, controls: item.data, valid: this.props.valid === item.key};
          return (
            <div key={index}>
              <Title title={item.title} />
              <SuperForm {...props} size={defaultSize} colNum={this.getColNumber()} />
            </div>
          )
        })}
      </ModalWithDrag>
    );
  };

  render() {
    const {inset=true} = this.props;
    if (inset) {
      return (
        <div>
          <div />
          {this.toContent()}
        </div>
      );
    } else {
      return this.toContent();
    }
  }
}

export default EditDialog3;
