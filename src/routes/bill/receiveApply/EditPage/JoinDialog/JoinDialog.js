import React, { PropTypes } from 'react';
import { Indent, SuperTable, ModalWithDrag, Search, SuperTitle} from '../../../../../components';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './JoinDialog.less';

class JoinDialog extends React.Component {

  toSearch = () => {
    const {searchConfig, filters, searchData, onClick, onChange} = this.props;
    const props = {
      config: searchConfig,
      filters,
      data: searchData,
      onClick,
      onChange
    }
    return <Search {...props}/>
  }

  toTable = () => {
    const {cols, items=[], tableTitle, onCheck} = this.props;
    const props = {
      cols,
      items,
      maxHeight: "300px",
      callback: {onCheck}
    }
    return (<div className={s.table}>
      <SuperTable {...props}/>
    </div>)
  }

  getProps = () => {
    const {title, visible=true, afterClose, onOk} = this.props;
    return {
      title,
      visible,
      width: 1000,
      maskClosable: false,
      confirmLoading: false,
      onOk: onOk,
      onCancel: afterClose,
      afterClose
    }
  }

  render() {
    return (
      <ModalWithDrag {...this.getProps()}>
        <Indent className={s.root}>
          {this.toSearch()}
          {this.toTable()}
        </Indent>
      </ModalWithDrag>
    )
  }
}

export default withStyles(s)(JoinDialog);
