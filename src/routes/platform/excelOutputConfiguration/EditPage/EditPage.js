import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EditPage.less';
import { getObject } from '../../../../common/common';
import {SuperForm, SuperToolbar, SuperTable, ModalWithDrag,SuperTable2,Title} from '../../../../components';


const TOOLBAR_EVENTS = ['onClick'];
const TABLE_EVENTS = ['onCheck', 'onDoubleClick', 'onLink'];


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
    const {title, config, onOk, onCancel} = this.props;
    return {
      title, onOk, onCancel,
      width: this.getWidth(),
      visible: true,
      maskClosable: false,
      okText: config.ok,
      cancelText: config.cancel,
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

  toTable = () => {
    const props = {
      cols: this.props.tableCols,
      items: this.props.tableItems,
      callback: getObject(this.props, TABLE_EVENTS)
    };
    return (<SuperTable {...props}/>)
  };


  render() {
    const {buttons,buttons1, controls, value,tableCols2,tableItems2,onExitValid,valid} = this.props;
    const toolbarProps1 = {
      buttons:buttons1,
      option: {bsSize: 'small'},
      callback: getObject(this.props, TOOLBAR_EVENTS)
    };
    const toolbarProps2 = {
      buttons,
      option: {bsSize: 'small'},
      callback: getObject(this.props, TOOLBAR_EVENTS)
    };
    const tableProps = {
      cols: tableCols2,
      valid,
      items: tableItems2,
      maxHeight: `calc(100vh - 510px)`,
      callback: {
        onCheck:this.props.onCheck1,
        onContentChange:this.props.onContentChange,
        onExitValid,
      }
    };
    return (
      <div>
        <div />
        <ModalWithDrag {...this.getProps()}>
          <SuperForm {...this.props} size={defaultSize} colNum={this.getColNumber()} />
          <div className={s.root}>
            <Title title='导出模板' />
            <SuperToolbar {...toolbarProps1} />
            <div className={s.table2}>
              <SuperTable2 {...tableProps} />
            </div>
            <Title title='查询条件' />
            <SuperToolbar {...toolbarProps2} />
            {this.toTable()}
          </div>
        </ModalWithDrag>
      </div>
    );
  }
}

export default withStyles(s)(EditPage);
