import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Freight.less';
import {Indent, SuperToolbar, SuperTable, SuperPagination} from '../../../../../components';

class Freight extends React.Component {

  toToolbar = () => {
    const {buttons, onClick} = this.props;
    const props = {buttons, onClick};
    return <SuperToolbar {...props}/>
  }

  toTable = () => {
    const {cols, items=[], onCheck, onDoubleClick} = this.props;
    const tableProps = {
      cols,
      items,
      callback: {onCheck, onDoubleClick}
    };
    return <div className={s.table}>
      <SuperTable {...tableProps}/>
      <div className={s.page}><SuperPagination {...this.props}/></div>
    </div>
  }

  render() {
    return (
      <Indent className={s.root}>
        {this.toToolbar()}
        {this.toTable()}
      </Indent>
    );
  }
}

export default withStyles(s)(Freight);
