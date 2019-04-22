import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { getObject } from '../../common/common';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './OrderPage.less';
import {Search, SuperTable, SuperPagination, SuperToolbar} from '../../components/index';

const SEARCH_EVENTS = ['onChange', 'onSearch'];
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

  onHandleClick = (key) => {
    const {onClick, onClickReset, onClickSearch, onConfig, onTemplateManager, onClickSort} = this.props;
    switch (key) {
      case 'reset': {
        onClickReset();
        break;
      }
      case 'search': {
        onClickSearch();
        break;
      }
      case 'sort': {
        onClickSort();
        break;
      }
      case 'config': {
        onConfig();
        break;
      }
      case 'templateManager': {
        onTemplateManager();
        break;
      }
      default:
        onClick && onClick(key);
    }
  };


  onHandleSubClick = (key, subKey) => {
    const {onWebExport, onAllExport, onSubClick} = this.props;
    switch (key) {
      case 'webExport': {
        onWebExport(subKey);
        break;
      }
      case 'allExport': {
        onAllExport(subKey);
        break;
      }
      default: {
        onSubClick && onSubClick(key, subKey);
      }
    }
  };

  toSearch = () => {
    const {filters, searchConfig, searchData, isSort} = this.props;
    const props = {
      isSort,
      filters,
      data: searchData,
      config: searchConfig,
      ...getObject(this.props, SEARCH_EVENTS),
      onClick: this.onHandleClick,
      onHeightChange: this.onHeightChange
    };
    return <Search {...props}/>;
  };

  toToolbar = () => {
    const props = {
      buttons: this.props.buttons.concat([{key: 'config', title: '配置字段'}]),
      onClick: this.onHandleClick,
      onSubClick: this.onHandleSubClick,
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

  render() {
    return (
      <div className={s.root}>
        {this.toSearch()}
        {this.props.buttons.length ? this.toToolbar() : null}
        {this.toTable()}
        {this.toPagination()}
      </div>
    );
  };
}

export default withStyles(s)(OrderPage);
