import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { getObject } from '../../../../common/common';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './OrderPage.less';
import {Search, SuperTab2, SuperTable, SuperPagination, SuperToolbar, Indent} from '../../../../components';

const SEARCH_EVENTS = ['onChange', 'onSearch', 'onClick'];
const TOOLBAR_EVENTS = ['onClick'];
const TABLE_EVENTS = ['onTableChange', 'onCheck', 'onDoubleClick', 'onLink'];
const TAB_EVENTS = ['onTabChange'];
const PAGINATION = ['maxRecords', 'pageSize', 'currentPage', 'pageSizeType', 'description', 'onPageNumberChange', 'onPageSizeChange'];

class OrderPage extends React.Component {

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
      isSort: true,
      filters,
      data: searchData,
      config: searchConfig,
      ...getObject(this.props, SEARCH_EVENTS),
      onHeightChange: this.onHeightChange
    };
    return <Search {...props}/>;
  };

  toTab = () => {
    const props = {
      activeKey: this.props.tabKey,
      tabs: this.props.tabs2,
      callback: getObject(this.props, TAB_EVENTS)
    };
    return <SuperTab2 {...props} />;
  }

  toToolbar = () => {
    const props = {
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
    const props = getObject(this.props, PAGINATION);
    return <SuperPagination {...props}/>;
  };

  render() {
    return (
      <Indent className={s.root}>
        {this.toSearch()}
        <div className={s.marginBottom}>{this.toTab()}</div>
        {this.props.buttons.length > 0 ? this.toToolbar() : null}
        {this.toTable()}
        {this.toPagination()}
      </Indent>
    );
  };
}

export default withStyles(s)(OrderPage);
