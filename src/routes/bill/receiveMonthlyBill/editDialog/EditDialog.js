import React from 'react';
import {ModalWithDrag, SuperTable, SuperToolbar} from '../../../../components';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EditDialog.less';

class EditDialog extends React.Component {

  toTable = () => {
    const {cols, tableItems, onCheck} = this.props;
    const props = {
      items: tableItems,
      cols,
      maxHeight: '400px',
      callback: {
        onCheck
      }
    };
    return <SuperTable {...props} />;
  };

  render () {
    const { onClose, buttons, onClick, afterClose,visible} = this.props;
    const modalProps = {
      title:'结算单对账明细调整',
      visible,
      onCancel: onClose,
      width: 900,
      maskClosable: false,
      footer: null,
      className: s.root,
      afterClose
    };
    return (
      <ModalWithDrag {...modalProps}>
         <SuperToolbar buttons={buttons} onClick={onClick} />
        {this.toTable()}
      </ModalWithDrag>
    );
  };
}

export default withStyles(s)(EditDialog);
