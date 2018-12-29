import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Dataset.less';
import Search from '../../../components/Search';
import SuperTable from '../../../components/SuperTable';
import SuperPagination from '../../../components/SuperPagination';
import SuperToolbar from '../../../components/SuperToolbar';
import SuperTag from '../../../components/SuperTab';
import {showError} from '../../../common/common';
import Dialog from './Dialog';
import ConfirmDialog from '../../../components/ConfirmDialog';
import OutPutTypeContainer from './OutPutTypeContainer'

class Dataset extends React.Component {
  static propTypes = {
    filters: PropTypes.array,
    searchConfig: PropTypes.object,
    searchData: PropTypes.object,
    buttons: PropTypes.array,
    tableCols: PropTypes.array,
    tableItems: PropTypes.array,
    onSearchDataOnChange: PropTypes.func,
    onPageNumberChange: PropTypes.func,
    onPageSizeChange: PropTypes.func,
    onSearch: PropTypes.func,
    onCheck: PropTypes.func,
    onDel: PropTypes.func,
    onAdd: PropTypes.func,
    onGet: PropTypes.func,
    formControls: PropTypes.array,
    textAreaControls: PropTypes.array,
    editData: PropTypes.object,
    onClearEditData: PropTypes.func,
    tagConfig: PropTypes.object,
  };

  state = {
    dialogState: false,
    dialogType: null,
    confirmDialogState: false,
  }

  getItemIsCheck = (index = -1) => {      // 获取已选的item
    if (index > -1) {
      return this.props.tableItems[index];
    } else {
      let items = [];
      this.props.tableItems.forEach((item) => {
        if (item.checked) {
          items.push(item);
        }
      });
      return items.pop();
    }
  };

  changeDialogState = (state, type = null) => {
    this.setState({ dialogState: state, dialogType: type });
  }

  changeConfirmDialogState = (state) => {
    if (this.getItemIsCheck() || !state) {
      this.setState({ confirmDialogState: state});
    } else {
      showError('请选择一条数据集记录');
    }
  };

  getItemInfo = (type, index) => {
    this.props.onGet(this.getItemIsCheck(index), type);
    this.changeDialogState(true, type);
  };

  searchDataOnChange = (key, value) => {     // 搜索框输入
    const searchData = {...this.props.searchData, [key]: value};
    this.props.onSearchDataOnChange(searchData);
  };

  searchOnClick = (key) => {      //搜索框按钮事件集合
    switch (key) {
      case 'search':
        this.props.onSearch();
        break;
      case 'reset':
        this.props.onSearchDataOnChange({});
        break;
      default:
        break;
    }
  };

  toolbarOnClick = (key) => {
    switch (key) {
      case 'add':
        this.changeDialogState(true, 'add');
        break;
      case 'edit':
        this.getItemInfo('edit');
        break;
      case 'del':
        this.changeConfirmDialogState(true);
        break;
      case 'copyAdd':
        this.getItemInfo('copyAdd');
      default:
        break;
    }
  };

  onDoubleClick = (index) => {
    this.getItemInfo('edit', index);
  };


  pageNumberChange = (value) => {     // 修改页数
    this.props.onPageNumberChange(value)
  };

  pageSizeChange = (value) => {     // 修改分页条数
    this.props.onPageSizeChange(value)
  };

  onDel = () => {
    this.props.onDel(this.getItemIsCheck());
    this.changeConfirmDialogState(false);
  }

  renderSearch() {        // 搜索框
    const props = {
      filters: this.props.filters,
      config: this.props.searchConfig,
      data: this.props.searchData,
      onClick: this.searchOnClick,
      onChange: this.searchDataOnChange,
    };
    return (<Search {...props}/>);
  }


  renderSuperToolbar() {
    const props = {
      buttons: this.props.buttons,
      callback: {onClick: this.toolbarOnClick},
    };
    return <SuperToolbar {...props}/>
  }

  renderSuperTable() {
    const props = {
      cols: this.props.tableCols,
      items: this.props.tableItems || [],
      callback: {
        onCheck: this.props.onCheck,
        onDoubleClick: this.onDoubleClick,
      },
    }
    return <SuperTable {...props}/>
  }

  renderSuperPagination() {
    const props = {
      maxRecords: this.props.totalItems || 200,
      currentPage: this.props.currentPage,
      pageSize: this.props.pageSize,
      pageSizeType: this.props.pageSizeType,
      description: this.props.description,
      onPageNumberChange: this.pageNumberChange,
      onPageSizeChange: this.pageSizeChange,
    }
    return <SuperPagination {...props}/>
  }

  renderDialog() {
    const props = {
      formControls: this.props.formControls,
      textAreaControls: this.props.textAreaControls,
      editData: this.state.dialogType === 'add' ? {} : this.props.editData,
      changeDialogState: this.changeDialogState,
      dialogState: this.state.dialogState,
      dialogType: this.state.dialogType,
      onAdd: this.props.onAdd,
      onClearEditData: this.props.onClearEditData,
    };
    return  <Dialog {...props}/>
  }

  renderConfirmDialog = () => {
    const props = {
      title: '删除',
      content: '是否删除所选数据集记录',
      ok: '确定',
      cancel: '取消',
      onCancel: () => {this.changeConfirmDialogState(false)},
      onOk: this.onDel,
    }
    return <ConfirmDialog {...props}/>
  };

  renderSuperTag() {
    const {activeKey, tabs, onTabChange} = this.props;
    return (<div className={s.superTag}>
      <SuperTag tabs={tabs} activeKey={activeKey} callback={{onTabChange}} />
    </div>);
  };

  toPage = (activeKey,dataSet1) => {
    switch (activeKey) {
      case 'data_set':
        return (
          <div className={s.pageRoot}>
            {this.renderSearch()}
            {this.renderSuperToolbar()}
            {this.renderSuperTable()}
            {this.renderSuperPagination()}
            {
              (this.state.dialogType === 'edit' && this.props.editData.id && this.state.dialogState) ||
              (this.state.dialogType === 'add' && this.state.dialogState) ||
              (this.state.dialogType === 'copyAdd' && this.props.editData.id && this.state.dialogState) ?
                this.renderDialog() : null
            }
            {this.state.confirmDialogState ? this.renderConfirmDialog() : null}
          </div>
        );
        break;
      case 'data_set1':
        return <OutPutTypeContainer/>
        break;
    }
  };


  renderPage = () => {
    const {activeKey,dataSet1} = this.props;

    return (
      <div className={s.root}>
        <div className={s.rootSon}>
          {this.renderSuperTag()}
        </div>
        {this.toPage(activeKey,dataSet1)}
      </div>
    );
  }

  render() {
    return this.renderPage();
  }
}

export default withStyles(s)(Dataset);
