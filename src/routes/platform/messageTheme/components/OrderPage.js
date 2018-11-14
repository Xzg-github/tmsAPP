import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { getObject } from '../../../../common/common';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './OrderPage.less';
import {Search, SuperTable, SuperToolbar, Card} from '../../../../components';

const SEARCH_EVENTS = ['onChange', 'onSearch', 'onClick'];
const TOOLBAR_EVENTS = ['onClick'];
const TABLE_EVENTS = ['onTableChange', 'onCheck', 'onDoubleClick', 'onLink'];

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
    let item = tableItems.slice(0,200);
    const extra = buttons.length ? 0 : -32;
    const props = {
      hasUnreadTable,
      sortInfo,
      filterInfo,
      cols: tableCols,
      items: item,
      callback: getObject(this.props, TABLE_EVENTS),
      maxHeight: `calc(100vh - ${this.state.height + 219 + extra}px)`
    };
    return <SuperTable {...props}/>;
  };



  render() {
    return (
      <div className={s.root}>
        {this.props.filters.length > 0 ? <Card>{this.toSearch()}</Card> : null}
        <Card>
          {this.props.buttons.length > 0 ? this.toToolbar() : null}
          {this.toTable()}
        </Card>
      </div>
    );
  };
}

export default withStyles(s)(OrderPage);
