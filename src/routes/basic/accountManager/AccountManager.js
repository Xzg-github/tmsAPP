import React, { PropTypes } from 'react';
import withStyles from '../../../../node_modules/isomorphic-style-loader/lib/withStyles';
import s from './AccountManager.less';
import Search from '../../../components/Search';
import SuperToolbar from '../../../components/SuperToolbar';
import SuperTable from '../../../components/SuperTable';
import SuperPagination from '../../../components/SuperPagination';
import ConfirmDialog from '../../../components/ConfirmDialog';
import AllotRoleDialog from './AllotRoleDialog';
import DataRolesDialog from './DataRolesDialog';
import {showError} from '../../../common/common';

class AccountManager extends React.Component {
  static propTypes = {
    searchConfig: PropTypes.object,
    filters: PropTypes.array,
    toolbar: PropTypes.array,
    itemCols: PropTypes.array,
    tableItems: PropTypes.array,
    pageSize: PropTypes.number,
    currentPage: PropTypes.number,
    returnTotalItems: PropTypes.number,
    pageSizeType: PropTypes.array,
    description: PropTypes.string,
    searchData: PropTypes.object,
    onPageSizeChange: PropTypes.func,
    onPageNumberChange: PropTypes.func,
    searchDataChange: PropTypes.func,
    searchDataSearch: PropTypes.func,
    resetSearchData: PropTypes.func,
    onSearch: PropTypes.func,
    onCheck: PropTypes.func,
    getRoleList: PropTypes.func,
    roleList: PropTypes.array,
    roleListCols: PropTypes.array,
    onRoleListCheck: PropTypes.func,
    onSetRole: PropTypes.func,
    onClearRole: PropTypes.func,
    onClearRoleList: PropTypes.func,
    getDataRoles: PropTypes.func,
  };

  state = {
    allotRoleDialogState: false,
    confirmDialogState: false,
    confirmDialogState2: false,
  };

  onClick = (key) => {
    switch (key) {
      case 'search':
        this.props.onSearch();
        break;
      case 'reset' :
        this.props.resetSearchData();
        break;
      case 'allot' :
        this.changeAllotRoleDialogState(true);
        break;
      case 'clear':
        this.changeConfirmDialogState(true);
        break;
      case 'dataRoles':
        this.dataConfirmDialog(true);
        break;
      case 'clearDataRoles':
        this.changeConfirmDialogState2(true);
        break;
      default:
        break;
    }
  };

  changeAllotRoleDialogState = (state) => {
    const items = this.getCheckItems();

    if(items.length < 1){
      showError('请勾选一个')
      return
    }
    const checkedUserIds =[];
    items.map((item) => {
      checkedUserIds.push(item.id)
    });
    if(state) {
      this.setState({ allotRoleDialogState: state });
      this.props.getRoleList(checkedUserIds);
    } else if (!state){
      this.setState({ allotRoleDialogState: state });
    }
    // else {
    //   showError('请选择一个用户');
    // }
  };

  changeConfirmDialogState = (state) => {
    const items = this.getCheckItems();
    if(items.length < 1){
      showError('请勾选一个')
      return
    }
    const checkedUserIds =[];
    items.map((item) => {
      checkedUserIds.push(item.id)
    });
    if(state) {
      this.setState({ confirmDialogState: state });
      this.props.getRoleList(checkedUserIds);
    } else if (!state){
      this.setState({ confirmDialogState: state });
    }
    // else {
    //   showError('请选择一个用户');
    // }
  };

  changeConfirmDialogState2 = (state) => {
    const items = this.getCheckItems();
    if(items.length < 1){
      showError('请勾选一个')
      return
    }
    const checkedUserIds =[];
    items.map((item) => {
      checkedUserIds.push(item.id)
    });
    if(state ) {
      this.setState({ confirmDialogState2: state });
      this.props.getDataRoles(checkedUserIds);
    } else if (!state) {
      this.setState({confirmDialogState2: state});
    }
    // } else {
    //   showError('请选择一个用户');
    // }
  };

  dataConfirmDialog = (state) => {
    const items = this.getCheckItems();
    if(items.length < 1){
      showError('请勾选一个')
      return
    }
    const checkedUserIds =[];
    items.map((item) => {
      checkedUserIds.push(item.id)
    });
    if(state) {
      this.setState({ dataRoleDialogState: state });
      this.props.getDataRoles(checkedUserIds);
    } else if (!state){
      this.setState({ dataRoleDialogState: state });
    }
    // else {
    //   showError('请选择一个用户');
    // }
  };

  getCheckItems = () => {
    const items = [];
    this.props.tableItems.forEach((obj) => {
      if(obj.checked) {
        items.push(obj);
      }
    });
    return items;
  };

  renderSearch() {
    const props = {
      config: this.props.searchConfig,
      filters: this.props.filters,
      onChange: this.props.searchDataChange,
      onSearch: this.props.searchDataSearch,
      data: this.props.searchData,
      onClick: this.onClick,
    };
    return (<Search {...props}/>)
  }


  renderSuperToolbar() {
    const props = {
      buttons: this.props.toolbar,
      callback: {
        onClick: this.onClick,
      }
    };
    return (<SuperToolbar {...props}/>)
  }

  renderSuperTable() {
    const props = {
      cols: this.props.itemCols,
      items: this.props.tableItems,
      callback: {
        onCheck: this.props.onCheck,
      }
    };
    return (<SuperTable {...props}/>)
  }

  renderSuperPagination() {
    const props = {
      maxRecords: this.props.returnTotalItems,
      currentPage: this.props.currentPage,
      pageSize: this.props.pageSize,
      pageSizeType: this.props.pageSizeType,
      description: this.props.description,
      onPageSizeChange: this.props.onPageSizeChange,
      onPageNumberChange: this.props.onPageNumberChange,
    };
    return (<SuperPagination {...props}/>);
  }

  renderAllotRoleDialog() {
    const props = {
      userId: this.getCheckItems()[0].id,
      changeAllotRoleDialogState: this.changeAllotRoleDialogState,
      roleList: this.props.roleList,
      roleListCols: this.props.roleListCols,
      onRoleListCheck: this.props.onRoleListCheck,
      onSetRole: this.props.onSetRole,
      onClearRoleList: this.props.onClearRoleList,
      onChange: this.props.onChange,
      formValue: this.props.formValue,
      filterItems: this.props.filterItems
    };
    return (<AllotRoleDialog {...props}/>)
  }

  renderConfirmDialog() {
    const userId = this.getCheckItems()[0].id;
    const props = {
      title: '清除角色分配',
      content: '是否确认清除用户的角色分配',
      ok: '确定',
      cancel: '取消',
      onCancel: () => {this.changeConfirmDialogState(false)},
      onOk: () => {
        this.props.onClearRole(userId);
        this.changeConfirmDialogState(false);
      }
    };
    return(<ConfirmDialog  {...props}/>)
  }


  renderConfirmDialog2() {
    const userId = this.getCheckItems()[0].id;
    const props = {
      title: '清除角色分配',
      content: '是否确认清除用户的数据角色分配',
      ok: '确定',
      cancel: '取消',
      onCancel: () => {this.changeConfirmDialogState2(false)},
      onOk: () => {
        this.props.onClearRole2(userId);
        this.changeConfirmDialogState2(false);
      }
    };
    return(<ConfirmDialog  {...props}/>)
  }

  renderDataRoleDialog() {
    const props = {
      userId: this.getCheckItems()[0].id,
      changeDataRoleDialogState: this.dataConfirmDialog,
      dataRoleList: this.props.dataRoleList,
      dataRoleCols: this.props.dataRoleCols,
      onDataListCheck: this.props.onDataListCheck,
      onSetRole: this.props.onSetRole,
      onClearRoleList: this.props.onClearRoleList,
      onDataRoleChange: this.props.onDataRoleChange,
      formValue: this.props.formValue,
      filterItems: this.props.filterItems
    };
    return (<DataRolesDialog {...props}/>)
  }

  renderPage = () => {
    return (
      <div className={s.root}>
          {this.renderSearch()}
          {this.renderSuperToolbar()}
          {this.renderSuperTable()}
          {this.renderSuperPagination()}
        {this.state.allotRoleDialogState ? this.renderAllotRoleDialog() : null}
        {this.state.dataRoleDialogState && this.props.dataRoleList.length >= 0 ? this.renderDataRoleDialog() : null}
        {this.state.confirmDialogState ? this.renderConfirmDialog(): null}
        {this.state.confirmDialogState2 ? this.renderConfirmDialog2(): null}
      </div>
    );
  };

  render() {
    return this.renderPage();
  }
}

export default withStyles(s)(AccountManager);
