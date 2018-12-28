import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EditPage.less';
import {SuperTable, SuperTab2, Indent, SuperToolbar} from '../../../../components';
import Total from '../../receiveMake/EditPage/Total/Total';
import {createOrderInfo} from '../../receiveMake/EditPage/OrderInfoPage/OrderInfoPageContainer';

const OrderInfoContainer = createOrderInfo('payMake');

class EditPage extends React.Component {

  toTotal = () => {
    const {payItems=[], ...prop} = this.props;
    const props = {
      ...prop,
      items: payItems.map(o => {
      o.companyTitle = o.supplierId.title;
      return o;
    })};
    return (payItems.length > 0) && <Total {...props}/>
  }

  toToolbar = () => {
    const {payButtons, onClick, isReadonly} = this.props;
    const props = {buttons: payButtons, onClick};
    return isReadonly ? null : <SuperToolbar {...props}/>;
  }

  toTable = () => {
    const {payItems, payCols, isReadonly, onTableChange, payFilterInfo} = this.props;
    const callback = {onTableChange};
    !isReadonly && (callback.onDoubleClick = this.props.onDoubleClick);
    !isReadonly && (callback.onCheck = this.props.onCheck);
    return <SuperTable {...{items: payItems, cols: payCols, callback, checkbox: !isReadonly, ...payFilterInfo}} />
  }

  toSuperTab = () => {
    const {tabs, activeKey, onTabChange} = this.props;
    return <SuperTab2 {...{tabs, activeKey, onTabChange}} />
  }

  toCostInfo = () => {
    return (
      <Indent>
        {this.toTotal()}
        {this.toToolbar()}
        {this.toTable()}
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
