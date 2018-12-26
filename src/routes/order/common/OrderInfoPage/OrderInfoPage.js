import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './OrderInfoPage.less';
import {SuperTable2, SuperForm, Title, SuperToolbar, SuperTab2, Indent} from '../../../../components/index';

class OrderInfoPage extends React.Component {

  toForm = (key, controls, hideControls) => {
    const {valid={}, onExitValid, onChange, onSearch, onAdd, baseInfo, readonly} = this.props;
    let value = {...baseInfo};
    let props = {
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
    return <Indent key={key}><SuperForm {...props} /></Indent>;
  };

  toFormSection = ({key, title, controls, hideControls}) => {
    if(!key || !controls) return null;
    let section = [];
    section.push(<Title key="0" title={title} />);
    section.push(this.toForm(key, controls, hideControls));
    return section;
  };

  toContent = () => {
    const {activeKey, goodsTable, addressTable, valid={}, readonly, onClick, onCheck, onContentChange, onContentSearch, onExitValid, onAdd} = this.props;
    const config = (activeKey === 'addressList') ? addressTable : goodsTable;
    const toolbarProps = {
      key: '0',
      buttons: config.buttons,
      onClick
    };
    const tableProps = {
      key: '1',
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
    let section = [];
    !readonly && section.push(<SuperToolbar {...toolbarProps} />);
    section.push(<SuperTable2 {...tableProps} />);
    return section;
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
      <div className={s.root}>
        {Object.keys(formSections).map(key => this.toFormSection(formSections[key]))}
        <SuperTab2 activeKey={activeKey} tabs={newTabs} onTabChange={onTabChange}/>
        {this.toContent()}
        {!readonly ? this.toFooter(buttons) : null}
      </div>
    );
  }
}

export default withStyles(s)(OrderInfoPage);
