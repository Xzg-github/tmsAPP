import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './BrandPage.less';
import { getObject } from '../../../common/common';
import {SuperForm, SuperToolbar, SuperTable2, ModalWithDrag} from '../../../components';

const TOOLBAR_EVENTS = ['onClick'];
const TABLE2_EVENTS = ['onCheck', 'onContentChange'];

const defaultSize = 'small';

const props = {
  title: PropTypes.string,
  config: PropTypes.object,
  controls: PropTypes.array,
  value: PropTypes.object,
  valid: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'middle', 'large']),
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
  onExitValid: PropTypes.func,
};

/**
 * onChange：内容改变时触发，原型func(key, value)
 * onSearch: search组件搜索时触发，原型为(key, value)
 */
class EditPage extends React.Component {
  static propTypes = props;
  static PROPS = Object.keys(props);

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
    const {title, config, onOk, onCancel,visible,afterClose} = this.props;
    return {
      title, onOk, onCancel,
      width: this.getWidth(),
      visible,
      maskClosable: false,
      okText: config.ok,
      cancelText: config.cancel,
      afterClose,
      getContainer: () => ReactDOM.findDOMNode(this).firstChild
    };
  };

  getColNumber = () => {
    if (this.props.size === 'middle' || this.props.size === 'large') {
      return 3;
    } else {
      return 2;
    }
  };

  render() {
    const {buttons, tableCols, tableItems} = this.props;
    const toolbarProps = {
      buttons,
      option: {bsSize: 'small'},
      callback: getObject(this.props, TOOLBAR_EVENTS)
    };
    const tableProps = {
      cols: tableCols,
      items: tableItems,
      callback: getObject(this.props, TABLE2_EVENTS)
    };
    return (
      <div>
        <div />
        <ModalWithDrag {...this.getProps()}>
          <SuperForm {...this.props} size={defaultSize} colNum={this.getColNumber()} />
          <div className={s.root}>
            <SuperToolbar {...toolbarProps} />
            <SuperTable2 {...tableProps} />
          </div>
        </ModalWithDrag>
      </div>
    );
  }
}

export default withStyles(s)(EditPage);
