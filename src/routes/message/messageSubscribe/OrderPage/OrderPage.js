import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { getObject } from '../../../../common/common';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../../../../components/OrderPage/OrderPage.less';
import {SuperTable,SuperToolbar, Indent, SuperTab} from '../../../../components';

const TOOLBAR_EVENTS = ['onClick'];
const TABLE_EVENTS = ['onTableChange', 'onCheck', 'onDoubleClick', 'onLink'];


const props = {
  sortInfo: PropTypes.object,
  filterInfo: PropTypes.object,
  tableCols: PropTypes.array,
  tableItems: PropTypes.array,
  buttons: PropTypes.array,
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

  toToolbar = () => {
    const props = {
      buttons: this.props.buttons,
      callback: getObject(this.props, TOOLBAR_EVENTS)
    };
    return <SuperToolbar {...props} />;
  };

  toTable = () => {
    const {tableCols, tableItems, sortInfo, filterInfo, buttons,hasUnreadTable} = this.props;
    const extra = buttons.length ? 0 : -32;
    const props = {
      hasUnreadTable,
      sortInfo,
      filterInfo,
      cols: tableCols,
      items: tableItems,
      callback: getObject(this.props, TABLE_EVENTS),
      maxHeight: `calc(100vh - ${this.state.height + 219 + extra}px)`
    };
    return <SuperTable {...props}/>;
  };

  render() {
    return (
      <div className={s.root}>
        <SuperTab {...this.props}/>
        <Indent>
          {this.props.buttons.length > 0 ? this.toToolbar() : null}
          {this.toTable()}
        </Indent>
      </div>
    );
  };
}

export default withStyles(s)(OrderPage);
