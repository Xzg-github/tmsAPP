import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EditPage.less';
import {SuperTable, SuperTab2, Indent, SuperToolbar, SuperForm, Card, SuperPagination} from '../../../../components';
import PictureWall from '../components/PictureWall/PictureWall';

class EditPage extends React.Component {

  toSuperTab = () => {
    const {editType, tabs, activeKey, onTabChange} = this.props;
    const newTabs = tabs.filter(o => o.showIn && o.showIn.includes(editType));
    const props = {tabs: newTabs, activeKey, onTabChange};
    return <div className={s.superTab}><SuperTab2 {...props}/></div>
  }

  toSuperForm = (activeKey) => {
    const {controls, value, valid} = this.props[activeKey];
    const {onChange, onSearch, onExitValid} = this.props;
    const props = {
      controls,
      value,
      valid,
      onChange,
      onSearch,
      onExitValid,
    };
    return <SuperForm {...props}/>;
  }

  toToolbar = (activeKey) => {
    const {buttons} = this.props[activeKey];
    const {onClick} = this.props;
    const props = {
      buttons,
      onClick
    };
    return <SuperToolbar {...props}/>
  }

  toTable = (activeKey) => {
    const {cols, items=[]} = this.props[activeKey];
    const {onCheck, onDoubleClick} = this.props;
    const tableProps = {
      cols,
      items,
      callback: {onCheck, onDoubleClick}
    };
    const pageProps = {...this.props[activeKey], ...this.props};
    return <div>
      <div className={s.table}><SuperTable {...tableProps}/></div>
      <SuperPagination {...pageProps}/>
    </div>
  }

  toContract = () => {
    const {activeKey, handleImgChange} = this.props;
    const {fileList, uploadText} = this.props[activeKey];
    return <Card className={s.container}>
      {this.toSuperForm(activeKey)}
      <PictureWall {...{fileList, uploadText, handleImgChange}}/>
    </Card>
  }

  toFreight = () => {
    const {activeKey} = this.props;
    return <Card className={s.container}>
      {this.toToolbar(activeKey)}
      {this.toTable(activeKey)}
    </Card>
  }

  toExtraCharge = () => {
    const {activeKey} = this.props;
    return <Card className={s.container}>
      {this.toToolbar(activeKey)}
      {this.toTable(activeKey)}
    </Card>
  }


  toTabContent = () => {
    const {activeKey} = this.props;
    switch (activeKey) {
      case 'contract': {
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

  toFooter = () => {
    const {footerBtns, onClick} = this.props;
    const props = {
      buttons: footerBtns,
      onClick
    };
    return <Card className={s.footer}><SuperToolbar {...props}/></Card>
  }

  render() {
    return (
      <Indent className={s.root}>
        {this.toSuperTab()}
        {this.toTabContent()}
        {this.toFooter()}
      </Indent>
    );
  }
}

export default withStyles(s)(EditPage);
