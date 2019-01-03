import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EditPage.less';
import {SuperTable, SuperTab2, Indent, SuperTitle} from '../../../../components';
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
    const title = isPay ? '应付信息' : '应收信息';
    const props = {title, buttons, onClick, readonly: isReadonly};
    return <div className={s.titleBg}><SuperTitle {...props}/></div>
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
      <Indent>
        {this.toTotal()}
        {this.toToolbar(false)}
        <div className={s.marginBottom}>{this.toTable(false)}</div>
        {this.toToolbar(true)}
        {this.toTable(true)}
      </Indent>
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
      <Indent className={s.root}>
        <div className={s.marginBottom}>{this.toSuperTab()}</div>
        {this.toTabContent()}
      </Indent>
    );
  }
}

export default withStyles(s)(EditPage);
