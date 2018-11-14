import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EditPage.less';
import {SuperTable, ModalWithDrag} from '../../../../components';

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

  constructor(props) {
    super(props);
    this.state = {height: 36};
  }

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
    const {title, onOk, onCancel,isShow} = this.props;
    return {
      title, onOk, onCancel,
      width: 910,
      visible: typeof isShow !== 'undefined' ? isShow : true,
      maskClosable: false,
      cancelText: '取消',
      getContainer: () => ReactDOM.findDOMNode(this).firstChild,
      footer: null
    };
  };

  getColNumber = () => {
    if (this.props.size === 'middle' || this.props.size === 'large') {
      return 3;
    } else {
      return 2;
    }
  };

  toTable = () => {
    const {tableCols, tableItems,hasUnreadTable} = this.props;
    const extra = 0
    const props = {
      hasUnreadTable,
      cols: tableCols,
      items: tableItems,
      checkbox:false,
      maxHeight: `calc(100vh - ${this.state.height + 219 + extra}px)`
    };
    return <SuperTable {...props}/>;
  };



  render() {
    return (
      <div>
        <div />
        <ModalWithDrag {...this.getProps()} >
          {this.toTable()}
        </ModalWithDrag>
      </div>
    );
  }
}

export default withStyles(s)(EditPage);
