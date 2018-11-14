import React, {PropTypes} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {SuperTab} from  '../../../components/index';
import s from './Business.less';
import OrderPage from '../../../components/OrderPage';

class Business extends React.Component {
  static propTypes = {
    activeKey: PropTypes.string,
    tabs: PropTypes.array
  };

  render() {
    const {tabs, activeKey, onTabChange} = this.props;
    let hasUnreadTable = activeKey=='inBox' ? true : false;
    const propData = {
      hasUnreadTable,
      ...this.props[activeKey],
      ...this.props
    };
    return (
      <div className={s.root}>
        <SuperTab {...{tabs, activeKey, onTabChange}}/>
        <OrderPage {...propData} />
      </div>
    );
  }
}

export default withStyles(s)(Business);

