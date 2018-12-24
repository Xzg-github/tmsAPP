import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EditPage.less';
import {Card, SuperForm, SuperTitle, SuperToolbar, SuperTab2, SuperTable} from '../../../../components';

class EditPage extends React.Component {

  toForm = () => {
    const {controls, value, valid=false, readonly, onChange, onSearch, onExitValid, onAdd} = this.props;
    return controls.map((item, i) => {
      const props = {
        controls: item.cols,
        value,
        valid: item.key === valid,
        readonly,
        onChange: onChange.bind(null, item.key),
        onSearch: onSearch.bind(null, item.key),
        onExitValid: onExitValid.bind(null, item.key),
        // onAdd: onAdd.bind(null, item.key)
      };
      return (<div key={i} style={{marginBottom: '10px'}}>
        <SuperTitle title={item.title}/>
        <SuperForm {...props}/>
      </div>)
    });
  }

  toTab = () => {
    const {tabs, activeKey, onTabChange} = this.props;
    const props = {tabs, activeKey, onTabChange};
    return <SuperTab2 {...props}/>
  }

  toInvoice = () => {
    const {invoiceInfoConfig} = this.props;
    return <h1>发票表格</h1>
  }

  toCostInfo = () => {
    const {costInfoConfig, activeKey, value, onClick, onCheck} = this.props;
    const {buttons, cols} = costInfoConfig;
    const props = {
      cols,
      items: value[activeKey] || [],
      onCheck
    };
    return (<div>
      <SuperToolbar {...{buttons, onClick}}/>
      <SuperTable {...props}/>
    </div>)
  }

  toTabContent = () => {
    const {activeKey} = this.props;
    switch (activeKey) {
      case 'invoiceInfo': {
        return this.toInvoice()
      }
      case 'costInfo': {
        return this.toCostInfo()
      }
    }
  }

  toFooter = () => {
    const {footerButtons, onClick} = this.props;
    const props = {
      buttons: footerButtons,
      size: 'large',
      onClick: onClick.bind(null, 'footer')
    };
    return <div className={s.footer}><SuperToolbar {...props}/></div>
  }

  render() {
    return (
      <Card className={s.root}>
        {this.toForm()}
        {this.toTab()}
        {this.toTabContent()}
        {this.toFooter()}
      </Card>
    );
  }
}

export default withStyles(s)(EditPage);
