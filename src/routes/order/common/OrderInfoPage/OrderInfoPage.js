import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './OrderInfoPage.less';
import {SuperTable2, SuperForm, Card, Title, SuperToolbar, SuperTab2} from '../../../../components/index';

class OrderInfoPage extends React.Component {

  toTitle = (title, buttons=[]) => {
    const {readonly, onClick} = this.props;
    return (
      <Title role='title' key="0" title={title}>
        {!readonly && <SuperToolbar buttons={buttons} onClick={onClick}/>}
      </Title>
    );
  };

  toForm = (key, controls, hideControls) => {
    const {valid={}, onExitValid, onChange, onSearch, onAdd, baseInfo, readonly} = this.props;
    let value = {...baseInfo};
    let props = {
      key,
      readonly,
      container: true,
      valid: valid[key],
      controls,
      hideControls,
      value,
      bsSize: 'small',
      onChange,
      onSearch: onSearch ? onSearch.bind(null, key) : undefined,
      onExitValid: onExitValid ? onExitValid.bind(null, key) : undefined,
      onAdd
    };
    return <SuperForm {...props} />;
  };

  toFormSection = ({key, title, controls, hideControls}) => {
    if(!key || !controls) return null;
    let section = [];
    section.push(this.toTitle(title));
    section.push(this.toForm(key, controls, hideControls));
    return section;
  };

  toTableFooter = (tableKey) => {
    const {baseInfo, detailList, mainCurrency, isDelivery} = this.props;
    if (tableKey === 'detailList' && !isDelivery && detailList.length) {
      const content = `商品总价：${mainCurrency} ${Number(baseInfo.totalAmount || 0).toFixed(2)}，品种数：${detailList.length}，
      总数量：${Number(baseInfo.goodsNumber || 0)}，总净重${Number(baseInfo.netWeight || 0).toFixed(3)}，
      总毛重${Number(baseInfo.roughWeight || 0).toFixed(3)}，总体积${Number(baseInfo.volume || 0).toFixed(3)}`;
      return () => content;
    }
  };

  toTable2 = (tableKey, cols) => {
    const {onContentChange, onContentSearch, onCheck, onLink, detailList, valid={}, onExitValid, readonly} = this.props;
    const readonlyCols = cols.filter(item => item.type !== 'checkbox').map(item => item.type === 'index' ? item : {...item, type: undefined});
    let props = {
      key: tableKey,
      cols: readonly ? readonlyCols : cols,
      items: detailList || [],
      valid: valid[tableKey],
      footer: this.toTableFooter(tableKey),
      callback: {
        onContentChange: onContentChange ? onContentChange.bind(null, tableKey) : undefined,
        onSearch: onContentSearch ? onContentSearch.bind(null, tableKey) : undefined,
        onCheck: onCheck ? onCheck.bind(null, tableKey) : undefined,
        onExitValid: onExitValid ? onExitValid.bind(null, tableKey) : undefined,
        onLink: onLink ? onLink.bind(null, tableKey) : undefined
      }
    };
    return <SuperTable2 {...props} /> ;
  };

  toTableSection = ({show=true, key, title, buttons, cols}) => {
    if (!show || !key || !cols) return null;
    let section = [];
    section.push(this.toTitle(title, buttons, key));
    section.push(this.toTable2(key, cols));
    return section;
  };

  toContent = () => {
    const {activeKey, goodsTable, addressTable, valid={}, readonly, onClick, onCheck, onContentChange, onContentSearch, onExitValid, onAdd} = this.props;
    const config = (activeKey === 'addressList') ? addressTable : goodsTable;
    const toolbarProps = {
      buttons: config.buttons,
      onClick
    };
    const tableProps = {
      cols: readonly ? config.cols.filter(item => item.key !== 'checkbox').map(col => col.key === 'index' ? col : ({...col, type: undefined})) : config.cols,
      items: this.props[activeKey],
      valid: valid[activeKey],
      callback: {
        onCheck : onCheck ? onCheck.bind(null, activeKey) : undefined,
        onContentChange : onContentChange ? onContentChange.bind(null, activeKey) : undefined,
        onSearch : onContentSearch ? onContentSearch.bind(null, activeKey) : undefined,
        onExitValid: onExitValid ? onExitValid.bind(null, activeKey) : undefined,
        onAdd
      }
    };
    return (
      <div key={activeKey}>
        {!readonly && <SuperToolbar {...toolbarProps} />}
        <SuperTable2 {...tableProps} />
      </div>
    );
  };

  toFooter = (buttons) => {
    const props = {
      buttons,
      size: 'default',
      onClick: this.props.onClick
    };
    return <SuperToolbar {...props}/>;
  };

  render() {
    const {formSections={}, buttons=[], activeKey, tabs, readonly, onTabChange} = this.props;
    const newTabs = tabs.map(tab => ({...tab, title: `${tab.title}(${this.props[tab.key].length})`}));
    return (
      <Card className={s.root}>
        {Object.keys(formSections).map(key => this.toFormSection(formSections[key]))}
        <SuperTab2 activeKey={activeKey} tabs={newTabs} onTabChange={onTabChange}/>
        {this.toContent()}
        {!readonly ? this.toFooter(buttons) : null}
      </Card>
    );
  }
}

export default withStyles(s)(OrderInfoPage);
