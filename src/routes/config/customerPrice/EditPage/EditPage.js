import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EditPage.less';
import {SuperTab2, Indent} from '../../../../components';
import ContractContainer from './Contract/ContractContainer';
import FreightContainer from './Freight/FreightContainer';
import ExtraChargeContainer from './ExtraCharge/ExtraChargeContainer';

class EditPage extends React.Component {

  toSuperTab = () => {
    const {editType, tabs, activeKey, onTabChange} = this.props;
    const newTabs = tabs.filter(o => o.showIn && o.showIn.includes(editType));
    const props = {tabs: newTabs, activeKey, onTabChange};
    return <SuperTab2 {...props}/>
  }

  toTabContent = () => {
    const {activeKey} = this.props;
    switch (activeKey) {
      case 'contract': {
        return <ContractContainer/>
      }
      case 'freight': {
        return <FreightContainer/>
      }
      case 'extraCharge': {
        return <ExtraChargeContainer/>
      }
    }
  }

  render() {
    return (
      <Indent className={s.root}>
        {this.toSuperTab()}
        {this.toTabContent()}
      </Indent>
    );
  }
}

export default withStyles(s)(EditPage);
