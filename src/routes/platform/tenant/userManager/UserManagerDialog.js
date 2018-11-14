import React from 'react';
import {ModalWithDrag} from '../../../../components';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import OrderPage from '../../../../components/OrderPage';
import s from './UserManagerDialog.less';

function UserManagerDialog(props) {
  const {title, onOk, onCancel, visible=true, ...otherProps} = props;
  const modalProps = {
    title,
    visible,
    onOk, onCancel,
    width: 900,
    maskClosable: false,
    okText: '账号注销',
    cancelText: '关闭',
    className: s.root
  };
  return (
    <ModalWithDrag {...modalProps}>
      <OrderPage {...otherProps} />
    </ModalWithDrag>
  );
}

export default withStyles(s)(UserManagerDialog);
