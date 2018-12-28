import React from 'react';
import {ModalWithDrag} from '../../../../components';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import OrderPage from '../../../../components/OrderPage';
import s from './AddDialog.less';

function AddDialog(props) {
  const { onOk, onCancel, visible=true,afterClose, ...otherProps} = props;
    const modalProps = {
      title:'选择结算单',
      visible,
      onOk, onCancel,
      width: 900,
      maskClosable: false,
      okText: '确定',
      cancelText: '取消',
      className: s.root,
      afterClose
    };
    return (
      <ModalWithDrag {...modalProps}>
        <OrderPage {...otherProps} />
      </ModalWithDrag>
    );
  }

export default withStyles(s)(AddDialog);
