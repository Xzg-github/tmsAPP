import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './RoleDialog.less';
import {Button} from 'antd';
import {SuperForm, ModalWithDrag} from '../../../../components';

class RoleDialog extends React.Component {
  static propTypes = {
    onSave: PropTypes.func,
    onUpdate: PropTypes.func,
    changeRoleDialogState: PropTypes.func,
    roleData: PropTypes.object,
    title: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.initState(props);
  }

  componentWillReceiveProps(nextProps) {
    this.initState(nextProps);
  }

  initState = (props) => {
    this.state = {
      value: {
        roleName: props.roleData.roleName || '',
        remark: props.roleData.remark || ''
      },
      valid: false
    };
  };

  onOk = () => {
    if (!this.state.value.roleName) {
      this.setState({...this.state, valid: true});
      return;
    }
    if(this.props.roleData.id) {
      this.props.onUpdate({...this.state.value, id: this.props.roleData.id});
    } else {
      this.props.onSave(this.state.value);
    }
    this.props.changeRoleDialogState(false);
  };

  onCancel = () => {
    this.props.changeRoleDialogState(false);
  };

  onChange= (key, newValue) => {
    const value = {...this.state.value, [key]: newValue};
    this.setState({...this.state, value});
  };

  onExitValid= () => {
    this.setState({...this.state, valid: false});
  };

  renderForm() {
    const props = {
      controls: [
        {key: 'roleName', title: '角色名称', type: 'text', required: true},
        {key: 'remark', title: '备注', type: 'textArea'}
      ],
      value: this.state.value,
      colNum: 1,
      valid: this.state.valid,
      onChange: this.onChange,
      onExitValid: this.onExitValid
    };
    return <SuperForm {...props}/>;
  }

  render() {
    return(
      <ModalWithDrag
        wrapClassName="roleDialog"
        visible={true}
        closable={false}
        title={this.props.title}
        width="300px"
        footer={
          <div style={{textAlign: 'center'}}>
            <Button size='small' onClick={this.onOk}>提交</Button>
            <Button size='small' onClick={this.onCancel}>取消</Button>
          </div>
        }>
        {this.renderForm()}
      </ModalWithDrag>
    );
  }
}

export default withStyles(s)(RoleDialog);
