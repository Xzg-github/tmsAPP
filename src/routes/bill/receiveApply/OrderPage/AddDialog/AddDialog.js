import React, { PropTypes } from 'react';
import { Indent, SuperTable, SuperToolbar, Search, ModalWithDrag, Title, SuperPagination} from '../../../../../components';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../../EditPage/EditPage.less';

class AddDialog extends React.Component {

  constructor (props) {
    super(props);
  }

  toSearch = () => {
    const {filters, searchData, searchConfig, onChange, onSearch, onClick} = this.props;
    const props = {
      config: searchConfig,
      filters,
      data: searchData,
      onChange,
      onSearch,
      onClick
    };
    return <Search {...props}/>
  }

  toTable = () => {
    const {cols, items=[], onCheck, tableTitle} = this.props;
    const props = {
      cols,
      items,
      maxHeight: "400px",
      callback: {onCheck}
    };
    return (<div className={s.marginTop}>
      <Title title={tableTitle}/>
      <div className={s.margin}><SuperTable {...props}/></div>
      <SuperPagination {...this.props}/>
    </div>)
  }

  getProps = () => {
    const {title, afterClose, visible, okText, onOk} = this.props;
    return {
      title,
      visible,
      width: 1000,
      maskClosable: false,
      confirmLoading: false,
      onOk,
      onCancel: afterClose,
      okText,
      afterClose
    }
  }

  render() {
    return (
      <ModalWithDrag {...this.getProps()}>
        <Indent>
          {this.toSearch()}
          {this.toTable()}
        </Indent>
      </ModalWithDrag>
    )
  }
}

export default withStyles(s)(AddDialog);
