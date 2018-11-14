import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { getObject } from '../../../../../common/common';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './OrderPage.less';
import {Search, SuperTable, SuperPagination, SuperToolbar, Card} from '../../../../../components/index';

const SEARCH_EVENTS = ['onChange', 'onSearch', 'onClick'];
const TOOLBAR_EVENTS = ['onClick'];
const TABLE_EVENTS = ['onCheck', 'onSort', 'onSwapCol', 'onDoubleClick', 'onLink'];
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
  paginationConfig: PropTypes.object  // 该属性将被description替代
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

  toToolbar = () => {
    const props = {
      buttons: this.props.buttons,
      option: {bsSize: 'small'},
      callback: getObject(this.props, TOOLBAR_EVENTS)
    };
    return <SuperToolbar {...props} />;
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
        <Card >
          {this.toSearch()}
        </Card>
        <Card>
          {this.toToolbar()}
          {this.toTable()}
        </Card>
      </div>
    );
  };
}

export default withStyles(s)(OrderPage);
