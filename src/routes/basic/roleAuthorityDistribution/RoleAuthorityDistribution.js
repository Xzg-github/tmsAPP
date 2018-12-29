import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './RoleAuthorityDistribution.less';
import SuperToolbar from '../../../components/SuperToolbar';
import SuperTable from '../../../components/SuperTable';
import SuperTree from '../../platform/tenantAuthorityDistribution/components/SuperTree';
import RoleDialog from './RoleDialog/RoleDialog';
import ConfirmDialog from '../../../components/ConfirmDialog';
import {showError} from '../../../common/common';
import {Input,Icon} from 'antd';


class RoleAuthorityDistribution extends React.Component {
  static propTypes = {
    filters: PropTypes.array,
    searchConfig: PropTypes.object,
    toolbar: PropTypes.array,
    itemCols: PropTypes.array,
    onSave: PropTypes.func,
    onUpdate: PropTypes.func,
    onActive: PropTypes.func,
    onInvalid: PropTypes.func,
    tableItems: PropTypes.array,
    onCheck: PropTypes.func,
    notDistributionExpand: PropTypes.object,
    notDistributionChecked: PropTypes.object,
    distributionExpand: PropTypes.object,
    distributionChecked: PropTypes.object,
    onGetDistributeTree: PropTypes.func,
    notDistributionOnExpand: PropTypes.func,
    distributionOnExpand: PropTypes.func,
    notDistributionOnChecked: PropTypes.func,
    distributionOnChecked: PropTypes.func,
    authorityMove: PropTypes.func,
  };

  state = {
    roleDialogState: false,
    roleDialogType: null,
    confirmDialogState: false,
    confirmDialogType: null,
  };

  getCheckItem() {
    let item = [];
    this.props.tableItems.forEach((obj) => {
      if(obj.checked) {
        item.push(obj);
      }
    });
    return item;
  }

  changeRoleDialogState = (state, type = null) => {
    if (type === 'update' && this.getCheckItem().length === 1) {
      this.setState({ roleDialogState: state, roleDialogType: type });
    } else if (type === 'save') {
      this.setState({ roleDialogState: state, roleDialogType: type });
    } else if (this.getCheckItem().length !== 1 && type){
      showError('请选择一个角色');
    } else if (type === null) {
      this.setState({ roleDialogState: state, roleDialogType: type });
    }
  };

  changeConfirmDialogState = (state, type = null) => {
    if(this.getCheckItem().length === 1 && type) {
      this.setState({ confirmDialogState: state, confirmDialogType: type });
    } else if(type === null) {
      this.setState({ confirmDialogState: state, confirmDialogType: type });
    } else {
      showError('请选择一个角色');
    }
  };

  roleActive = () => {
    const role = this.getCheckItem();
    if(role.length === 1){
      this.props.onActive(role.pop().id);
    }
    this.changeConfirmDialogState(false);
  };

  roleInvalid = () => {
    const role = this.getCheckItem();
    if(role.length === 1){
      this.props.onInvalid(role.pop().id);
    }
    this.changeConfirmDialogState(false);
  };

  onGetDistributeTree() {
    const item = this.getCheckItem();
    if(item.length ===1) {
      this.props.onGetDistributeTree(item.pop());
    } else {
      showError('请选择一个角色');
    }
  }


  onClick = (key) => {
    switch (key) {
      case 'save':
        this.changeRoleDialogState(true, key);
        break;
      case 'update':
        this.changeRoleDialogState(true, key);
        break;
      case 'active':
        this.changeConfirmDialogState(true, key);
        break;
      case 'invalid':
        this.changeConfirmDialogState(true, key);
        break;
      case 'distribute':
        this.onGetDistributeTree();
        break;
      default:
        break;
    }
  };


  renderSearch() {
    const props = {
      config: this.props.searchConfig,
      filters: this.props.filters,
    };
    return (<Search {...props}/>)
  }

  renderSuperToolbar() {
    const props = {
      buttons: this.props.toolbar,
      callback: {onClick: this.onClick},
    };
    return (<SuperToolbar {...props}/>)
  }

  toSearchInput = () => {
    const {formValue,onChange} = this.props;
    const props = {
      placeholder: "角色名称",
      style: { width: '100%', marginBottom: '10px' },
      value: formValue,
      onChange: onChange,
    };
    return <Input {...props} />;
  };

  renderSuperTable() {
    const props = {
      cols: this.props.itemCols,
      items: this.props.tableItems,
      callback: {
        onCheck: this.props.onCheck,
      },
    };
    return (<SuperTable {...props}/>)
  }

  renderPublicSuperTree() {
    const defaultTree = {
      root: 'top',
      top: {key: 'top', children: ['notDistributionTree']},
      notDistributionTree: {key: 'notDistributionTree', title: '可分配权限', children: []},
    };
    const props = {
      tree: this.props.notDistributionTree.root ? this.props.notDistributionTree : defaultTree,
      expand: this.props.notDistributionExpand,
      onExpand: this.props.notDistributionOnExpand,
      checked: this.props.notDistributionChecked,
      onCheck: this.props.notDistributionOnChecked,
    };
    return (<SuperTree {...props}/>);
  }

  renderTenantSuperTree() {
    const defaultTree = {
      root: 'top',
      top: {key: 'top', children: ['distributionTree']},
      distributionTree: {key: 'distributionTree', title: '已分配权限', children: []},
    };
    const props = {
      tree: this.props.distributionTree.root ? this.props.distributionTree : defaultTree,
      expand: this.props.distributionExpand,
      onExpand: this.props.distributionOnExpand,
      checked: this.props.distributionChecked,
      onCheck: this.props.distributionOnChecked,
    };
    return (<SuperTree {...props}/>)
  }

  renderRoleDialog() {
    const title = {
      save: '新增角色',
      update: '更新角色',
    };
    const props = {
      title: title[this.state.roleDialogType],
      onSave: this.props.onSave,
      onUpdate: this.props.onUpdate,
      changeRoleDialogState: this.changeRoleDialogState,
      roleData: this.state.roleDialogType === 'update' ? this.getCheckItem().pop() : {},
    };
    return (<RoleDialog {...props}/>);
  }

  renderConfirmDialog() {
    const type = {
      active: {title: '激活', content: '是否激活？', onOk: () => {this.roleActive()}},
      invalid: {title: '失效', content: '是否失效？', onOk: () => {this.roleInvalid()}},
    };
    const props = {
      ...type[this.state.confirmDialogType],
      ok: '确认',
      cancel: '取消',
      onCancel: () => {this.changeConfirmDialogState(false)},
    };
    return(<ConfirmDialog {...props}/>)
  }

  renderPage = () => {
    return (
      <div className={s.root}>
        <div className={s.workplace}>
          <div className={s.tableWrap}>
            {this.renderSuperToolbar()}
            {this.toSearchInput()}
            {this.renderSuperTable()}
          </div>
          <div className={s.publicAuthority}>
            {this.renderPublicSuperTree()}
          </div>
          <div className={s.buttons}>
            <Icon type="right-square"  onClick={() => {this.props.authorityMove('moveIn')}} style={{fontSize:28,color:'#01a4ff'}}/>
            <Icon type="left-square"  onClick={() => {this.props.authorityMove('moveOut')}}style={{fontSize:28,color:'#01a4ff'}}/>
          </div>
          <div className={s.tenantAuthority}>
            {this.renderTenantSuperTree()}
          </div>
        </div>
        {this.state.roleDialogState ? this.renderRoleDialog() : null}
        {this.state.confirmDialogState ? this.renderConfirmDialog() : null}
      </div>
    );
  };

  render() {
    return this.renderPage();
  }
}

export default withStyles(s)(RoleAuthorityDistribution);
