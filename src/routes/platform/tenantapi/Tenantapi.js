import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {Search, SuperTable, SuperToolbar} from '../../../components/index';
import s from './Tenantapi.less';
import {getObject} from '../../../common/common';

const TABLE_EVENTS = ['onCheck', 'onSort', 'onSwapCol'];
const SEARCH_EVENTS = ['onChange', 'onSearch', 'onClick'];
const TOOLBAR_EVENTS = ['onClick'];

class Tenantapi extends React.Component {
  static propTypes = {
    tableCols: PropTypes.array.isRequired,
    tableItems: PropTypes.array,
    buttons: PropTypes.array,
    filters: PropTypes.array,
    searchConfig: PropTypes.object,
    searchData: PropTypes.object
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
      ...getObject(this.props, SEARCH_EVENTS)
    };
    return <div role="search"><Search {...props}/></div>
  };

  toToolbar = () => {
    const props = {
      buttons: this.props.buttons,
      option: {bsSize: 'small'},
      callback: getObject(this.props, TOOLBAR_EVENTS)
    };
    return <div role='buttons'><SuperToolbar {...props}/></div>;
  };

  toTable = () => {
    const {tableCols, tableItems} = this.props;
    const props = {
      cols: tableCols,
      items: tableItems,
      option: {index: true, checkbox: true},
      callback: getObject(this.props, TABLE_EVENTS)
    };
    return <div role='container'><SuperTable {...props}/></div>;
  };

  render() {
    return (
      <div className={s.root}>
        {this.toSearch()}
        {this.toToolbar()}
        {this.toTable()}
      </div>
    );
  }
}

export default withStyles(s)(Tenantapi);
