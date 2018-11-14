import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import ReactDOM from 'react-dom';
import {Button} from 'antd';
import SuperForm from '../SuperForm';
import SuperTable2 from '../SuperTable2';
import ModalWithDrag from '../ModalWithDrag';
import s from './EditDialog2.less';

const defaultSize = 'small';

/**
 * inset: 是否嵌入，默认为true
 * onChange：内容改变时触发，原型func(key, value)
 * onSearch: search组件搜索时触发，原型为(key, value)
 */
class EditDialog2 extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    config: PropTypes.object,
    controls: PropTypes.array,
    value: PropTypes.object,
    valid: PropTypes.bool,
    inset: PropTypes.bool,
    size: PropTypes.oneOf(['small', 'default', 'middle', 'large']),
    onCancel: PropTypes.func,
    onOk: PropTypes.func,
    onFence: PropTypes.func,
    onChange: PropTypes.func,
    onSearch: PropTypes.func,
    onExitValid: PropTypes.func,

    buttons: PropTypes.array,
    tableCols: PropTypes.array,
    tableItems: PropTypes.array,
    tableValid: PropTypes.bool,
    onContentChange: PropTypes.func,
    onClick: PropTypes.func,
    onTableExitValid: PropTypes.func
  };

  toTable = (tableCols, tableItems, onContentChange, onTableExitValid, tableValid) => {
    const props = {
      cols: tableCols,
      items: tableItems,
      valid: tableValid,
      callback: {
        onCheck: onContentChange,
        onContentChange,
        onExitValid: onTableExitValid,
      }
    };
    return <div role="container"><SuperTable2 {...props} /></div>;
  };

  toButton = ({key, title}, index) => {
    return <Button role="mybtn" key={index} size={defaultSize} onClick={this.props.onClick.bind(this, key)}>{title}</Button>;
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

  getProps = (inset, title, config, onOk, onCancel, onFence) => {
    const extra = inset ? {getContainer: () => ReactDOM.findDOMNode(this).firstChild} : {className: s.root};
    onOk = onOk.bind(null, this.props);
    onCancel = onCancel.bind(null, this.props);
    config.fence && (extra.footer=this.getFooter(config, onOk, onCancel, onFence));
    return {
      title, onOk, onCancel,
      width: this.getWidth(),
      visible: true,
      maskClosable: false,
      okText: config.ok,
      cancelText: config.cancel,
      ...extra,
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

  modal = (inset) => {
    const {buttons, tableCols, tableItems=[], tableValid, onContentChange, onTableExitValid, title, config,
      onOk, onCancel, onFence, ...otherProps} = this.props;
    return (
      <ModalWithDrag {...this.getProps(inset, title, config, onOk, onCancel, onFence)}>
        <SuperForm {...otherProps} colNum={this.getColNumber()} size={defaultSize} />
        {buttons.map(this.toButton)}
        {this.toTable(tableCols, tableItems, onContentChange, onTableExitValid, tableValid)}
      </ModalWithDrag>
    );
  };

  render() {
    const {inset=true} = this.props;
    if (inset) {
      return (
        <div className={s.root}>
          <div />
          {this.modal(inset)}
        </div>
      );
    } else {
      return this.modal(inset);
    }
  }
}

export default withStyles(s)(EditDialog2);

