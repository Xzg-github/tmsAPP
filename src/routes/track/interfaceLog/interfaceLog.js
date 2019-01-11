import React, {PropTypes} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {SuperTab} from  '../../../components/index';
import s from './interfaceLog.less';
import OrderPage from '../../../components/OrderPage';

class interfaceLog extends React.Component{
  static propTypes = {
    activeKey: PropTypes.string,
    tabs: PropTypes.array
  }

  render() {
    const {tabs, activeKey, onTabChange} = this.props;
    const orderPageProp = {
      ...this.props[activeKey],
      ...this.props
    }
    return (
      <div className={s.root}>
        <SuperTab {...{tabs, activeKey, onTabChange}} />
        <OrderPage {...orderPageProp}/>
      </div>
    )
  }
}

export default withStyles(s)(interfaceLog);
