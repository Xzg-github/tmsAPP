import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EditPage.less';
import {SuperTable, SuperTab2, Card, SuperTitle} from '../../../../components';
import Total from './Total/Total';
import OrderInfoContainer from './OrderInfoPage/OrderInfoPageContainer';

class EditPage extends React.Component {

  toTotal = () => {
    const {receiveItems=[], ...prop} = this.props;
    const props = {
      ...prop,
      items: receiveItems.map(o => {
      o.companyTitle = o.customerId.title;
      return o;
    })};
    return (receiveItems.length > 0) && <Total {...props}/>
  }

  toToolbar = (isPay) => {
    const {isReadonly, payButtons, receiveButtons, onClick} = this.props;
    const buttons = isPay ? payButtons : receiveButtons;
    const title = isPay ? '应收信息' : '应付信息';
    const props = {title, buttons, onClick, readonly: isReadonly};
    return <SuperTitle {...props}/>
  }

  toTable = (isPay) => {
    const {payItems, receiveItems, payCols, receiveCols, isReadonly, onTableChange, payFilterInfo, receiveFilterInfo} = this.props;
    const items = isPay ? payItems : receiveItems;
    const cols = isPay ? payCols : receiveCols;
    const filterInfo = isPay ? payFilterInfo : receiveFilterInfo;
    const callback = {onTableChange: onTableChange.bind(null, isPay)};
    !isPay && !isReadonly && (callback.onDoubleClick = this.props.onDoubleClick);
    !isReadonly && (callback.onCheck = this.props.onCheck.bind(null, isPay));
    return <SuperTable {...{items, cols, callback, checkbox: !isReadonly, ...filterInfo}} />
  }

  toSuperTab = () => {
    const {tabs, activeKey, onTabChange} = this.props;
    return <SuperTab2 {...{tabs, activeKey, onTabChange}} />
  }

  toCostInfo = () => {
    return (
      <Card>
        {this.toTotal()}
        {this.toToolbar(false)}
        {this.toTable(false)}
        {this.toToolbar(true)}
        {this.toTable(true)}
      </Card>
    )
  }

  toTabContent = () => {
    const {activeKey} = this.props;
    switch (activeKey) {
      case 'index': {
        return this.toCostInfo()
      }
      case 'orderInfo': {
        return <OrderInfoContainer/>
      }
    }
  }

  render() {
    return (
      <Card className={s.root}>
        {this.toSuperTab()}
        {this.toTabContent()}
      </Card>
    );
  }
}

export default withStyles(s)(EditPage);
