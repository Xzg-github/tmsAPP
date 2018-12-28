import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { getObject } from '../../../common/common';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './UrlResource.less';
import {Search, SuperTable, SuperPagination, Card} from '../../../components/index';

const SEARCH_EVENTS = ['onChange', 'onSearch', 'onClick'];
const TABLE_EVENTS = ['onCheck', 'onSort', 'onSwapCol', 'onDoubleClick', 'onLink'];
const PAGINATION = ['maxRecords', 'pageSize', 'currentPage', 'pageSizeType', 'description',
  'onPageNumberChange', 'onPageSizeChange'];

const props = {
  tableCols: PropTypes.array,
  tableItems: PropTypes.array,
  filters: PropTypes.array,
  searchData: PropTypes.object,
  searchConfig: PropTypes.object,
  maxRecords: PropTypes.number,
  currentPage: PropTypes.number,
  pageSize: PropTypes.number,
  pageSizeType: PropTypes.array,
  description: PropTypes.string,
  paginationConfig: PropTypes.object
};

class OrderPage extends React.Component {
  static propTypes = props;
  static PROPS = Object.keys(props);

  getContainer = () => {
    return ReactDOM.findDOMNode(this);
  };

  toSearch = () => {
    const {filters, searchConfig, searchData} = this.props;
    const props = {
      filters,
      data: searchData,
      config: searchConfig,
      getContainer: this.getContainer,
      ...getObject(this.props, SEARCH_EVENTS)
    };
    return <Search {...props}/>;
  };

  toTable = () => {
    const {tableCols, tableItems} = this.props;
    const props = {
      cols: tableCols,
      items: tableItems,
      callback: getObject(this.props, TABLE_EVENTS)
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

  render = () => {
    return (
      <div className={s.root}>
        {this.toSearch()}
        {this.toTable()}
        {this.toPagination()}
      </div>
    );
  };
}

export default withStyles(s)(OrderPage);
