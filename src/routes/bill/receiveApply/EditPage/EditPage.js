import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EditPage.less';
import {Indent, SuperForm, SuperTitle, SuperToolbar, SuperTab2, SuperTable} from '../../../../components';
import InvoiceTable from './InvoiceTable/InvoiceTable';

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
        onAdd: onAdd.bind(null, item.key)
      };
      return (<div key={i} className={s.marginBottom}>
        <SuperTitle title={item.title}/>
        <Indent className={s.marginTop}><SuperForm {...props}/></Indent>
      </div>)
    });
  }

  toTab = () => {
    const {tabs, activeKey, onTabChange} = this.props;
    const props = {tabs, activeKey, onTabChange};
    return <SuperTab2 {...props}/>
  }

  toInvoice = () => {
    const {invoiceInfoConfig, value, activeKey, onInvoiceChange, onInvoiceSelect} = this.props;
    const props = {
      cols: invoiceInfoConfig.cols,
      items: value[activeKey],
      currencyList: value['currencyList'],
      onChange: onInvoiceChange.bind(null, activeKey),
      onSelect: onInvoiceSelect.bind(null, activeKey)
    };
    return <Indent className={s.marginTop}><InvoiceTable {...props}/></Indent>
  }

  toCostInfo = () => {
    const {costInfoConfig, activeKey, value, onClick, onCheck} = this.props;
    const {buttons, cols} = costInfoConfig;
    const props = {
      cols,
      items: value[activeKey] || [],
      callback: {onCheck: onCheck.bind(null, activeKey)}
    };
    const toolbarProps = {
      buttons,
      onClick: onClick.bind(null, activeKey)
    };
    return (<Indent>
      <div className={s.margin2}><SuperToolbar {...toolbarProps}/></div>
      <SuperTable {...props}/>
    </Indent>)
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
      <div className={s.root}>
        {this.toForm()}
        {this.toTab()}
        {this.toTabContent()}
        {this.toFooter()}
      </div>
    );
  }
}

export default withStyles(s)(EditPage);
