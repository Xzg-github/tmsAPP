import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { getObject } from '../../../common/common';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './OrderPage.less';
import {Search, SuperTable, SuperPagination, Card, SuperToolbar} from '../../../components';

const SEARCH_EVENTS = ['onChange', 'onSearch', 'onClick'];
const TOOLBAR_EVENTS = ['onClick'];
const TABLE_EVENTS = ['onTableChange', 'onCheck', 'onDoubleClick', 'onLink'];
const PAGINATION = ['maxRecords', 'pageSize', 'currentPage', 'pageSizeType', 'description',
  'onPageNumberChange', 'onPageSizeChange'];

const props = {
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
    this.state = {height: 36};
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
      getContainer: this.getContainer,
      ...getObject(this.props, SEARCH_EVENTS),
      onHeightChange: this.onHeightChange
    };
    return <Search {...props}/>;
  };

  toToolbar = () => {
    console.log(this.props.buttons);
    const option = { bsSize: 'small' };
    const props = {
      option,
      buttons: this.props.buttons,
      callback: getObject(this.props, TOOLBAR_EVENTS)
    };
    return <SuperToolbar {...props} />;
  };

  toTable = () => {
    const {tableCols, tableItems, sortInfo, filterInfo, buttons} = this.props;
    const extra = buttons.length ? 0 : -32;
    const props = {
      sortInfo,
      filterInfo,
      cols: tableCols,
      items: tableItems,
      callback: getObject(this.props, TABLE_EVENTS),
      maxHeight: `calc(100vh - ${this.state.height + 219 + extra}px)`
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
        <Card>
          {this.toSearch()}
        </Card>
        <Card>
          {this.props.buttons.length > 0 ? this.toToolbar() : null}
          {this.toTable()}
          {this.toPagination()}
        </Card>
      </div>
    );
  };
}

export default withStyles(s)(OrderPage);
