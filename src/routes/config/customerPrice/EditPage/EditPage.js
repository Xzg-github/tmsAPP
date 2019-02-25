import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EditPage.less';
import {SuperTable, SuperTab2, Indent, SuperToolbar} from '../../../../components';

class EditPage extends React.Component {

  toSuperTab = () => {
    const {tabs, activeKey, onTabChange} = this.props;
    const props = {tabs, activeKey, onTabChange};
    return <div className={s.superTab}><SuperTab2 {...props}/></div>
  }

  toContract = () => {
    return '合同'
  }

  toFreight = () => {
    return '运费'
  }

  toExtraCharge = () => {
    return '附加费'
  }


  toTabContent = () => {
    const {activeKey} = this.props;
    switch (activeKey) {
      case 'index': {
        return this.toContract()
      }
      case 'freight': {
        return this.toFreight()
      }
      case 'extraCharge': {
        return this.toExtraCharge()
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
