import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ShortcutSet.less';
import {SuperTable, SuperToolbar} from '../../../components';

class ShortcutSet extends React.Component {

  toToolbar = () => {
    const props = {
      buttons: this.props.buttons,
      onClick: this.props.onClick
    };
    return <SuperToolbar {...props} />;
  };

  toTable = () => {
    const {tableCols, tableItems, onCheck} = this.props;
    const props = {
      cols: tableCols,
      items: tableItems,
      callback: {
        onCheck
      },
      maxHeight: `calc(100vh - 140px)`
    };
    return <SuperTable {...props}/>;
  };

  render() {
    return (
      <div className={s.root}>
        {this.toToolbar()}
        {this.toTable()}
      </div>
    );
  };
}

export default withStyles(s)(ShortcutSet);
