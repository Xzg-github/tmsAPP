import React, { PropTypes } from 'react';
import {Button, Select, Checkbox, Input, Form} from 'antd';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {showError} from '../../../../../common/common';
import s from './Setting.less';
const SelectOption = Select.Option;

class Setting extends React.Component {
  static propTypes = {
    setting: PropTypes.array,
    baseInfo: PropTypes.object,
    onClick: PropTypes.func,  // 按钮事件
    onBaseInfo: PropTypes.func, // setting数据改变事件
  };

  componentWillMount() {
   this.reportName = this.props.baseInfo.reportName;
  }

  onClick = (key) => {
    if (this.props.onClick && typeof this.props.onClick === 'function') {
      if(key === 'save' && this.props.baseInfo.tenantId) {
        this.props.onClick(key);
      }
      else if(key === 'add' && this.props.baseInfo.reportTypeConfigId) {
        this.props.onClick(key);
      }
      else if(key === 'del' && this.props.baseInfo.tenantId) {
        this.props.onClick(key);
      }
      else if(key === 'preview' && this.props.baseInfo.tenantId) {
        this.props.onClick(key);
      }
      else {
        showError('请选择一个设计模板');
      }
    }
  };

  onChange = (e, key) => {
    if (this.props.onBaseInfo && typeof this.props.onBaseInfo === 'function') {
      this.props.onBaseInfo(e.target.value, key);
    }
  }

  onSelect = (value, key) => {
    if (this.props.onBaseInfo && typeof this.props.onBaseInfo === 'function') {
      this.props.onBaseInfo(value, key);
    }
  }

  onCheckBoxChange = (e, key) => {
    if (this.props.onBaseInfo && typeof this.props.onBaseInfo === 'function') {
      this.props.onBaseInfo(e.target.checked ? 0 : 1, key);
    }
  }

  toOptions(options) {
    return options.map((options, index) => {
      return <SelectOption value={options.value} key={index}>{options.title}</SelectOption>
    })
  }

  renderButton(set, index) {
    return <div key={index}
      style={{verticalAlign: 'bottom'}}
    >
      <Button
        onClick={() => this.onClick(set.key)}
        size="small"
        style={{ margin: '0 0 0 10px' }}
      >{set.title}</Button>
    </div>
  }

  renderSelect(set, index) {
    return <div key={index}>
      <span>{set.title}</span>
      <Select
        value={this.props.baseInfo[set.key]}
        size="small"
        mode="single"
        allowClear={true}
        showSearch={true}
        style={{ width: 100 }}
        onSelect={(value) => this.onSelect(value, set.key)}
        onChange={(value) => this.onSelect(value, set.key)}
      >
        {this.toOptions(set.options)}
      </Select>
    </div>
  }

  renderCheckbox(set, index) {
    return <div key={index} >
        <Checkbox
          onChange={(e) => this.onCheckBoxChange(e, set.key)}
          checked={this.props.baseInfo[set.key] === 0}
        >
          {set.title}
        </Checkbox>
    </div>
  }

  renderInput(set, index) {
    return <div key={index}>
      <span>{set.title}</span>
      <Input
        readOnly={set.readOnly}
        value={this.props.baseInfo[set.key]}
        size="small"
        style={{ width: 100 }}
        onChange={(e) => this.onChange(e, set.key)}
      />
    </div>
  }

  renderComponents () {
    return this.props.setting.map((set, index) => {
      switch(set.type) {
        case 'select':
          return this.renderSelect(set, index);
          break;
        case 'text':
          return this.renderInput(set, index);
          break;
        case 'button':
          return this.renderButton(set, index);
          break;
        case 'checkbox':
          return this.renderCheckbox(set, index);
          break;
        default:
          break;
      }
    });
  }

  renderPage = () => {
    return (
      <div className={s.root}>
        <Form>
          {this.renderComponents()}
        </Form>
      </div>
    );
  }

  render() {
    return this.renderPage();
  }
}

export default withStyles(s)(Setting);
