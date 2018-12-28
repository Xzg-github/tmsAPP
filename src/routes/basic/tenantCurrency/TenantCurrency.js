import React, { PropTypes } from 'react';
import { getObject } from '../../../common/common';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './TenantCurrency.less';
import {SuperTable, SuperToolbar, Indent} from '../../../components/index';

const TOOLBAR_EVENTS = ['onClick'];
const TABLE_EVENTS = ['onCheck', 'onDoubleClick', 'onLink'];

const props = {
  tableCols: PropTypes.array,
  tableItems: PropTypes.array,
  buttons: PropTypes.array
};

class TenantCurrency extends React.Component {
  static propTypes = props;
  static PROPS = Object.keys(props);

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

  render = () => {
    return (
      <Indent className={s.root}>
        {this.toToolbar()}
        {this.toTable()}
      </Indent>
    );
  };
}

export default withStyles(s)(TenantCurrency);

