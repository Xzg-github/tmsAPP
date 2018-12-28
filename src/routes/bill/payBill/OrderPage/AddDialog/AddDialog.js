import React from 'react';
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
  };

  toTable = () => {
    const {cols, items=[], onCheck, tableTitle} = this.props;
    const props = {
      cols,
      items,
      maxHeight: "300px",
      callback: {onCheck}
    };
    return (<div>
      <Title className={s.superTitle} title={tableTitle}/>
      <Indent>
        <SuperTable {...props}/>
        <SuperPagination style={{marginTop: '15px'}} {...this.props}/>
      </Indent>
    </div>)
  };

  toFooter = () => {
    const {buttons, footerBtnClick} = this.props;
    const props = {
      size: 'large',
      buttons,
      onClick: footerBtnClick
    };
    return <SuperToolbar {...props}/>
  };

  getProps = () => {
    const {title, afterClose, visible} = this.props;
    return {
      title,
      visible,
      width: 1000,
      maskClosable: false,
      confirmLoading: false,
      onCancel: afterClose,
      footer: this.toFooter(),
      afterClose
    }
  };

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
