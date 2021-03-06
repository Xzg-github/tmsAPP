import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { getObject } from '../../../../common/common';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './OrderPage.less';
import {Search, SuperTable, SuperPagination, SuperToolbar} from '../../../../components/index';
import UploadFile from '../UploadFile/UploadFile';
import ConfirmDialog from '../../../../components/ConfirmDialog';

const SEARCH_EVENTS = ['onChange', 'onSearch', 'onClick'];
const TOOLBAR_EVENTS = ['onClick'];
const TABLE_EVENTS = ['onTableChange', 'onCheck', 'onDoubleClick', 'onLink'];
const PAGINATION = ['maxRecords', 'pageSize', 'currentPage', 'pageSizeType', 'description',
  'onPageNumberChange', 'onPageSizeChange'];

const props = {
  hasUnreadTable: PropTypes.bool,
  sortInfo: PropTypes.object,
  filterInfo: PropTypes.object,
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
  paginationConfig: PropTypes.object  // 该属性将被description替代
};

class OrderPage extends React.Component {
  static propTypes = props;
  static PROPS = Object.keys(props);

  constructor(props) {
    super(props);
    this.state = {height: 67};
  }

  onHeightChange = (height) => {
    this.setState({height});
  };

  getContainer = () => {
    return ReactDOM.findDOMNode(this);
  };

  toSearch = () => {
    const {filters, searchConfig, searchData} = this.props;
    const props = {
      filters,
      data: searchData,
      config: searchConfig,
      ...getObject(this.props, SEARCH_EVENTS),
      onHeightChange: this.onHeightChange
    };
    return <Search {...props}/>;
  };

  toToolbar = () => {
    const props = {
      buttons: this.props.buttons,
      callback: getObject(this.props, TOOLBAR_EVENTS)
    };
    return <SuperToolbar {...props} />;
  };

  toTable = () => {
    const {tableCols, tableItems, sortInfo, filterInfo, buttons,hasUnreadTable} = this.props;
    const extra = buttons.length ? 0 : -33;
    const props = {
      hasUnreadTable,
      sortInfo,
      filterInfo,
      cols: tableCols,
      items: tableItems,
      callback: getObject(this.props, TABLE_EVENTS),
      maxHeight: `calc(100vh - ${this.state.height + 253 + extra}px)`
    };
    return <SuperTable {...props}/>;
  };

  toPagination = () => {
    let props = getObject(this.props, PAGINATION);
    if (!props.description && this.props.paginationConfig) {
      props.description = this.props.paginationConfig.pageDesp;
    }
    return <SuperPagination {...props}/>;
  };

  toUploadFile = () => {
    const { visible, onCancel, onUpload } = this.props;
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
        {this.toSearch()}
        {this.props.buttons.length ? this.toToolbar() : null}
        {this.toTable()}
        {this.toPagination()}
        {this.toUploadFile()}
        {this.state.showConfirm && this.toConfirmDialog()}
      </div>
    );
  };
}

export default withStyles(s)(OrderPage);
