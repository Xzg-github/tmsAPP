import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './OrderInfoPage.less';
import {Icon, Steps} from 'antd';
import {SuperTable2, SuperForm, Title, SuperToolbar, SuperTab2, Indent, SuperTable} from '../../../../components/index';

const Step = Steps.Step;

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

  toOrderInfo = () => {
    const {formSections={}, buttons=[], activeKey, tabs, readonly, onTabChange} = this.props;
    const newTabs = tabs.map(tab => ({...tab, title: `${tab.title}(${this.props[tab.key].length})`}));
    return (
      <div className={s.order}>
        {Object.keys(formSections).map(key => this.toFormSection(formSections[key]))}
        <SuperTab2 activeKey={activeKey} tabs={newTabs} onTabChange={onTabChange}/>
        {this.toContent()}
        {!readonly ? this.toFooter(buttons) : null}
      </div>
    );
  };

  toStatusSteps = ({statusList=[]}) => {
    const status = { 0: 'wait', 1: 'finish', 2: 'error'};
    return (
      <Indent>
        <Steps size='small' role='steps'>
          {statusList.map((item, index) => {
            const props = {
              key: index,
              title: item.statusName,
              description: item.finishTime,
              status: status[Number(item.taskStatus)]
            };
            return <Step {...props} />;
          })}
        </Steps>
      </Indent>
    );
  };

  toInfoItem = ({key, title, icon}, carInfo) => {
    const info = typeof carInfo[key] === 'object' ? carInfo[key].title || '┅' : carInfo[key] || '┅';
    return (
      <span role="info" key={key}>
        <Icon type={icon || 'picture'} />
        <span>{title}</span>
        <span>{info}</span>
      </span>
    );
  };

  toCarInfo = ({items, carInfo={}}) => {
    return <Indent>{items.map(item => this.toInfoItem(item, carInfo))}</Indent>;
  };

  toDescription = (item) => {
    return (
      <div>
        <div>{item.finishTime}</div>
        <div>{item.position}</div>
        {item.fileInfoList.length > 0 && <div><img style={{with: 80, height: 80}} src={item.fileInfoList[0].url} onClick={this.props.onAttach.bind(null, item.fileInfoList)} /></div>}
      </div>
    );
  };

  toTaskSteps = ({taskList=[]}) => {
    const status = { 0: 'wait', 1: 'finish', 2: 'error'};
    return (
      <Indent>
        <Steps size='small' role='steps'>
          {taskList.map((item, index) => {
            const props = {
              key: index,
              title: item.taskTypeName,
              description: this.toDescription(item),
              status: status[Number(item.taskStatus)]
            };
            return <Step {...props} />;
          })}
        </Steps>
      </Indent>
    );
  };

  toChangeLogs = ({cols, items=[]}) => {
    const props = {cols, items, checkbox: false};
    return <Indent><SuperTable {...props} /></Indent>;
  };

  toTrackInfo = () => {
    const {section1, section2, section3, section4} = this.props;
    return (
      <div className={s.track}>
        <Title title={section1.title} />
        {this.toStatusSteps(section1)}
        <Title title={section2.title} />
        {this.toCarInfo(section2)}
        <Title title={section3.title} />
        {this.toTaskSteps(section3)}
        <Title title={section4.title} />
        {this.toChangeLogs(section4)}
      </div>
    );
  };

  toTopContent = (topActiveKey) => {
    if (topActiveKey === 'order') {
      return this.toOrderInfo();
    }else if (topActiveKey === 'track') {
      return this.toTrackInfo();
    }
  };

  render() {
    const {topTabs, topActiveKey, pageType, onTopTabChange} = this.props;
    if (pageType === 1) {
      return this.toOrderInfo();
    }else if (pageType === 2) {
      return (
        <div className={s.root}>
          <SuperTab2 activeKey={topActiveKey} tabs={topTabs} onTabChange={onTopTabChange}/>
          {this.toTopContent(topActiveKey)}
        </div>
      );
    }else {
      return null;
    }
  }
}

export default withStyles(s)(OrderInfoPage);
