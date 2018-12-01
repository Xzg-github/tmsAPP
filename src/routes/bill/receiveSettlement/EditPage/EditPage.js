import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EditPage.less';
import {SuperTable, SuperTab2, Card, SuperToolbar} from '../../../../components';
import Total from './Total/Total';

class EditPage extends React.Component {

  toTotal = () => {
    const {receiveItems=[]} = this.props;
    return (receiveItems.length > 0) && <Total {...this.props}/>
  }

  toToolbar = (isPay) => {
    const {isReadonly, payButtons, receiveButtons, onClick} = this.props;
    const buttons = isPay ? payButtons : receiveButtons;
    return isReadonly ? null : <SuperToolbar {...{buttons, onClick}}/>
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

  toTabContent = () => {
    const {activeKey, order} = this.props;
    switch (activeKey) {
      case 'pay': {
        return (<div>
          {this.toToolbar(true)}
          {this.toTable(true)}
        </div>)
      }
      case 'order': {
        // console.log(order[order])
        return <div>调用运单信息界面</div>
      }
    }
  }

  render() {
    return (
      <div className={s.root}>
        {this.toTotal()}
        <Card data-status={this.props.receiveItems.length > 0 ? null : 'max'} >
          {this.toToolbar(false)}
          {this.toTable(false)}
          {this.toSuperTab()}
          {this.toTabContent()}
        </Card>
      </div>
    );
  }
}

export default withStyles(s)(EditPage);
