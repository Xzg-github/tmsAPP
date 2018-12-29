import React, { PropTypes } from 'react';
import { Indent, SuperTable, Search, ModalWithDrag, Title} from '../../../../../components';
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
    const {cols, items=[], onCheck} = this.props;
    const props = {
      cols,
      items,
      maxHeight: "400px",
      callback: {onCheck}
    };
    return (<div className={s.marginTop}>
      <div className={s.margin}><SuperTable {...props}/></div>
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
