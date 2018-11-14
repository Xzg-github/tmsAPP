import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './AllotRoleDialog.less';
import {Button, Input} from 'antd';
import {SuperTable, ModalWithDrag} from '../../../components';

class AllotRoleDialog extends React.Component {
  static propTypes = {
    userId: PropTypes.string,
    onSave: PropTypes.func,
    changeAllotRoleDialogState: PropTypes.func,
    roleList: PropTypes.array,
    roleListCols: PropTypes.array,
    onRoleListCheck: PropTypes.func,
    onSetRole: PropTypes.func,
    onClearRoleList: PropTypes.func,
  };

  getRoleListItems() {
    const roles = [];
    this.props.roleList.forEach((role) => {
      if(role.checked){
        roles.push(role);
      }
    });
    return roles;
  }

  onOk = () => {
    const items = this.getRoleListItems();
    this.props.onSetRole(this.props.userId, items, false);
    this.props.onClearRoleList();
    this.props.changeAllotRoleDialogState(false);
  };

  onCancel = () => {
    this.props.onClearRoleList();
    this.props.changeAllotRoleDialogState(false);
  };

  renderTable = () => {
    const props = {
      cols: this.props.roleListCols,
      items: this.props.roleList,
      callback: {
        onCheck: this.props.onRoleListCheck,
      },
      maxHeight: '400px',
    };
    return (<SuperTable {...props}/>)
  };

  onChange = (e) =>{
    const {onChange} = this.props;
    onChange && onChange(e.target.value)
  }

  toSearchInput = () => {
    const {formValue} = this.props;
    const props = {
      placeholder: "角色名称",
      style: { width: '100%', marginBottom: '10px' },
      value: formValue,
      onChange: this.onChange,
    };
    return <Input {...props} />;
  };

  render() {
    return(
      <ModalWithDrag
        wrapClassName="allotRoleDialog"
        visible={true}
        closable={false}
        title='用户角色分配'
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

export default withStyles(s)(AllotRoleDialog);

