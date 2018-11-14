import React, {PropTypes} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import SuperToolbar from '../../../components/SuperToolbar';
import SuperTable from '../../../components/SuperTable';
import {getObject} from '../../../common/common';
import s from './TabPage.less';

class TabPage extends React.Component {
  static propTypes = {
    tableCols: PropTypes.array,
    tableItems: PropTypes.array,
    buttons: PropTypes.array
  };

  toToolbar = () => {
    const props = {
      buttons: this.props.buttons,
      option: {bsSize: 'small'},
      callback: getObject(this.props, ['onClick'])
    };
    return <SuperToolbar {...props} />;
  };

  toTable = () => {
    const {tableCols, tableItems=[]} = this.props;
    const props = {
      cols: tableCols,
      items: tableItems,
      maxHeight: 'calc(100vh - 156px)',
      callback: getObject(this.props, ['onCheck', 'onDoubleClick'])
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
  }
}

export default withStyles(s)(TabPage);

