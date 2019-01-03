import React from 'react';
import { getObject } from '../../../common/common';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Import.less';
import {Search, SuperTable, SuperToolbar} from '../../../components';

class Import extends React.Component {

  toSearch = () => {
    const {filters, searchConfig, searchData} = this.props;
    const SEARCH_EVENTS = ['onChange', 'onClick'];
    const props = {
      filters,
      data: searchData,
      config: searchConfig,
      ...getObject(this.props, SEARCH_EVENTS)
    };
    return <Search {...props}/>;
  };

  toToolbar = () => {
    const props = {
      buttons: this.props.buttons,
      onClick: this.props.onClick
    };
    return <SuperToolbar {...props} />;
  };

  toTable = () => {
    const {tableCols, tableItems, checkedRows} = this.props;
    const TABLE_EVENTS = ['onRadio', 'onDoubleClick', 'onLink'];
    const props = {
      radio: true,
      checkedRows,
      cols: tableCols,
      items: tableItems,
      callback: getObject(this.props, TABLE_EVENTS),
      maxHeight: `calc(100vh - 228px)`
    };
    return <SuperTable {...props}/>;
  };

  render() {
    return (
      <div className={s.root}>
        {this.toSearch()}
        {this.toToolbar()}
        {this.toTable()}
      </div>
    );
  };
}

export default withStyles(s)(Import);
