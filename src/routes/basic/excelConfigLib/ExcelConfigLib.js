import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ExcelConfigLib.less';

import { getObject } from '../../../common/common';
import { Search, SuperPagination, SuperTable, SuperTab, Card } from '../../../components';
import SuperToolbar from './components/SuperToolbar/SuperToolbar';
import UploadFile from './components/UploadFile/UploadFile';
import ConfirmDialog from '../../../components/ConfirmDialog';
import NewModelContainer from './New/NewModelContainer';

const SEARCH_EVENTS = ['onChange', 'onSearch', 'onClick'];    // 搜索事件
const TOOLBAR_EVENTS = ['onClick']; // 工具栏点击事件
const TABLE_EVENTS = ['onCheck', 'onSort', 'onSwapCol', 'onCellClick'];  // 表格事件
const PAGINATION = ['maxRecords', 'pageSize', 'currentPage', 'pageSizeType', 'description',
  'onPageNumberChange', 'onPageSizeChange'];

const props = {
  tableCols: PropTypes.array,
  tableItems: PropTypes.array,
  buttons: PropTypes.array,
  filters: PropTypes.array,
  searchData: PropTypes.object,
  searchConfig: PropTypes.object,
  maxRecords: PropTypes.number,
  currentPage: PropTypes.number,
  pageSize: PropTypes.number,
  pageSizeType: PropTypes.array,
  description: PropTypes.string,
  paginationConfig: PropTypes.object,  // 该属性将被description替代
  visible1: PropTypes.bool,
  onCancel: PropTypes.func,
  onUpload: PropTypes.func,
  confirmType: PropTypes.string,
};


class ExcelConfigLib extends React.Component {
  static propTypes = props;
  static PROPS = Object.keys(props);

  state = {
    showConfirm: false,
  };
  componentWillReceiveProps(nextProps) {
    const { confirmType } = nextProps;
    if (!confirmType) {
      if (this.state.showConfirm) {
        this.setState({ showConfirm: false });
      }
    } else {
      this.setState({ showConfirm: true });
    }
  }
  getContainer = () => {
    return ReactDOM.findDOMNode(this);
  };

  toSearch = () => {   // 搜索栏
    const { filters, searchConfig: config, searchData: data } = this.props; // 过滤条件
    const props = { filters, data, config, getContainer: this.getContainer, ...getObject(this.props, SEARCH_EVENTS) };
    return <Search {...props} />;
  };

  toTable = () => { // 列表
    const { tableCols: cols, tableItems: items } = this.props;
    const option = { index: true, checkbox: true };
    const props = { cols, items, option, callback: getObject(this.props, TABLE_EVENTS) };
    return <SuperTable {...props} />;
  };

  toPagination = () => {
    let props = getObject(this.props, PAGINATION);
    if (!props.description && this.props.paginationConfig) {
      props.description = this.props.paginationConfig.pageDesp;
    }
    return <SuperPagination {...props} />;
  };

  toSuperTab = () => {
    return (
      <SuperTab {...getObject(this.props, SuperTab.PROPS) } />
    )
  };

  toSuperToolbar = () => {
    const { buttons } = this.props;
    const option = { bsSize: 'small' };
    const props = { buttons, option, callback: getObject(this.props, TOOLBAR_EVENTS) };
    return (
      <SuperToolbar {...props} />
    )
  };

  toNewModel = () => {
    return <NewModelContainer />
  };

  toUploadFile = (data) => {
    const { visible1: visible, onCancel, onUpload } = data;
    const props = {
      visible,
      onCancel,
      onUpload,
    };
    if (visible) {
      return (
        <UploadFile {...props} />
      );
    }
  };

  toConfirmDialog = () => {
    const { ConfirmDialog: props } = this.props;
    return <ConfirmDialog {...props} />
  };

  render() {
    return (
      <div className={s.root}>
        {this.toSuperTab()}
        <Card >
          {this.toSearch()}
        </Card>
        <Card>
          {this.toSuperToolbar()}
          {this.toTable()}
          {this.toPagination()}
        </Card>
        {this.toNewModel()}
        {this.toUploadFile(this.props)}
        {this.state.showConfirm && this.toConfirmDialog()}
      </div>
    );
  }
}


export default withStyles(s)(ExcelConfigLib);
