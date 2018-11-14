import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SetColDialog.less';
import {ModalWithDrag, SuperTable2, SuperToolbar} from '../index';
import helper from '../../common/common';

class SetColDialog extends React.Component {
  static propTypes = {
    ok: PropTypes.string,
    cancel: PropTypes.string,
    cols: PropTypes.array,
    onCancel: PropTypes.func,
    onOk: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.initState(props);
  }

  componentWillReceiveProps(nextProps) {
    this.initState(nextProps);
  }

  initState = (props) => {
    this.state = {
      cols: props.cols.map(col => {
        let {...newCol} = col;
        newCol.sorter = col.sorter ? col.sorter : 'noSort';
        return newCol;
      })
    };
  };

  handleClick = (key) => {
    let [...items] = this.state.cols;
    let checkIndex = -1;
    const checkItems = items.filter((item, index) => {
      if (item.checked === true) {
        checkIndex = index;
        return true;
      }
      return false;
    });
    if (key === 'up') {
      if (checkItems.length !== 1) {
        helper.showError('请勾选一条记录');
        return;
      }
      if (checkIndex === 0) return;
      const checkedItem = checkItems.pop();
      items[checkIndex] = items[checkIndex-1];
      items[checkIndex-1] = checkedItem;
    }else if (key === 'down') {
      if (checkItems.length !== 1) {
        helper.showError('请勾选一条记录');
        return;
      }
      if (checkIndex === items.length-1) return;
      const checkedItem = checkItems.pop();
      items[checkIndex] = items[checkIndex+1];
      items[checkIndex+1] = checkedItem;
    }else if (key === 'remove') {
      items = items.filter(o=>!o.checked);
    }
    this.setState({...this.state, cols: items});
  };

  handleCheck = (rowIndex, keyName, checked) => {
    if (rowIndex === -1) {
      this.setState({...this.state, cols: this.state.cols.map(item => ({...item, checked}))});
    }else {
      this.setState({...this.state, cols: this.state.cols.map((item, index) => index === rowIndex ? ({...item, checked}) : item)});
    }
  };

  handleContentChange = (rowIndex, keyName, value) => {
    this.setState({...this.state, cols: this.state.cols.map((item, index) => index === rowIndex ? ({...item, [keyName]: value}) : item)});
  };

  toBody = () => {
    const {buttons, tableCols} = this.props;
    const props = {
      cols: tableCols,
      items: this.state.cols,
      maxHeight: '400px',
      callback: {
        onCheck: this.handleCheck,
        onContentChange: this.handleContentChange,
      }
    };
    return (
      <div>
        <SuperToolbar buttons={buttons} size="small" onClick={this.handleClick}/>
        <SuperTable2 {...props} />
      </div>
    );
  };

  handleOk = () => {
    const {onOk, onClose} = this.props;
    let newCols = this.state.cols.map(col => {
      let {...newCol} = col;
      newCol.sorter = col.sorter === 'noSort' ? undefined : col.sorter;
      delete newCol.checked;
      return newCol;
    });
    onClose();
    onOk(newCols);
  };

  getProps = () => {
    const {title, ok, cancel, onClose} = this.props;
    return {
      title,
      onCancel: onClose,
      onOk: this.handleOk,
      visible: true,
      width: 700,
      maskClosable: false,
      okText: ok,
      cancelText: cancel,
      className: s.root
    };
  };

  render() {
    return (
      <ModalWithDrag {...this.getProps()}>
        {this.toBody()}
      </ModalWithDrag>
    );
  }
}

export default withStyles(s)(SetColDialog);
