import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './AllotRoleDialog.less';
import {Button, Input} from 'antd';
import {SuperTable, ModalWithDrag} from '../../../components';

class DataRolesDialog extends React.Component {
  getRoleListItems() {
    const roles = [];
    this.props.dataRoleList.forEach((role) => {
      if(role.checked){
        roles.push(role);
      }
    });
    return roles;
  }

  onOk = () => {
    const items = this.getRoleListItems();
    this.props.onSetRole(this.props.userId, items, true);
    this.props.onClearRoleList();
    this.props.changeDataRoleDialogState(false);
  };

  onCancel = () => {
    this.props.onClearRoleList();
    this.props.changeDataRoleDialogState(false);
  };

  renderTable = () => {
    const props = {
      cols: this.props.dataRoleCols,
      items: this.props.dataRoleList,
      callback: {
        onCheck: this.props.onDataListCheck,
      },
      maxHeight: '200px',
    };
    return (<SuperTable {...props}/>)
  };

  onDataRoleChange = (e) =>{
    const {onDataRoleChange} = this.props;
    onDataRoleChange && onDataRoleChange(e.target.value)
  }

  toSearchInput = () => {
    const {formValue} = this.props;
    const props = {
      placeholder: "角色名称",
      style: { width: '100%', marginBottom: '10px' },
      value: formValue,
      onChange: this.onDataRoleChange,
    };
    return <Input {...props} />;
  };


  render() {
    return(
      <ModalWithDrag
        wrapClassName="allotRoleDialog"
        visible={true}
        closable={false}
        title='数据角色分配'
        width="300px"
        footer={
          <div style={{textAlign: 'center'}}>
            <Button size='small' onClick={this.onOk}>提交</Button>
            <Button size='small' onClick={this.onCancel}>取消</Button>
          </div>
        }>
        {this.toSearchInput()}
        {this.renderTable()}
      </ModalWithDrag>
    );
  }
}



export default withStyles(s)(DataRolesDialog);
