import React, { PropTypes } from 'react';
import { Card, SuperTable, SuperToolbar, Search, ModalWithDrag, Title, SuperPagination} from '../../../../../components';
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
    return (<div>
      <Title className={s.superTitle} title={tableTitle}/>
      <SuperTable {...props}/>
      <SuperPagination style={{marginTop: '15px'}} {...this.props}/>
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
        <Card>
          {this.toSearch()}
          {this.toTable()}
        </Card>
      </ModalWithDrag>
    )
  }
}

export default withStyles(s)(AddDialog);
