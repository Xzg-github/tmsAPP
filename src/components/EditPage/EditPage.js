import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EditPage.less';
import {Button, Popconfirm} from 'antd';
import {SuperTable, SuperTable2, SuperForm, Card, Title, Indent} from '../index';
import {getObject} from '../../common/common';

const FORM_PROPS = ['controls', 'value', 'readonly', 'hideControls', 'onChange', 'onExitValid'];

/**
 * label包含title,add,copy,del,save,cancel,commit,audit 7个属性
 * pageReadonly: 为true表示页面只读，默认值为false
 */
class EditPage extends React.Component {
  static propTypes = {
    label: PropTypes.object,
    controls: PropTypes.array,
    value: PropTypes.object,
    options: PropTypes.object,
    formOptions: PropTypes.object,
    readonly: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
    hideControls: PropTypes.array,
    tableItems: PropTypes.array,
    tableCols: PropTypes.array,
    pageReadonly: PropTypes.bool,
    valid: PropTypes.bool,
    form: PropTypes.bool
  };

  bindEvent = (event, ...args) => {
    const onEvent = this.props[event];
    const func = () => onEvent(...args);
    return onEvent ? func : null;
  };

  defaultButton = (title, type, size, onClick) => {
    return (
      <Button {...{type, size, onClick}}>
        {title}
      </Button>
    );
  };

  closeButton = (title, type, size, onClick) => {
    return (
      <Popconfirm onConfirm={onClick} title='是否确定关闭'>
        <Button {...{type, size}}>
          {title}
        </Button>
      </Popconfirm>
    );
  };

  delButton = (title, type, size, onClick) => {
    return (
      <Popconfirm onConfirm={onClick} title='是否确定删除'>
        <Button {...{type, size}}>
          {title}
        </Button>
      </Popconfirm>
    );
  };

  toButton = (key, render, size='small', type='default') => {
    const {label, pageReadonly} = this.props;
    if (label[key] && !pageReadonly) {
      const onClick = this.bindEvent('onClick', key);
      return render(label[key], type, size, onClick);
    } else {
      return null;
    }
  };

  toForm = () => {
    const {pageReadonly, onFormSearch, valid, form, formOptions} = this.props;
    const props = getObject(this.props, FORM_PROPS);
    Object.assign(props, {onSearch: onFormSearch, container: true, options: formOptions});
    if (pageReadonly) {
      Object.assign(props, {readonly: true});
    } else if (valid && form) {
      Object.assign(props, {valid: true});
    }
    return <SuperForm {...props} />;
  };

  toTitle = () => {
    return (
      <Title role='title' title={this.props.label.title}>
        {this.toButton('add', this.defaultButton)}
        {this.toButton('copy', this.defaultButton)}
        {this.toButton('del', this.delButton)}
        {this.toButton('audit', this.defaultButton)}
      </Title>
    );
  };

  toTable = () => {
    const {tableCols: cols, tableItems: items, pageReadonly, options} = this.props;
    if (pageReadonly) {
      const cols2 = cols.filter(col => (col.type !== 'index') && (col.type !== 'checkbox'));
      return <SuperTable cols={cols2} items={items} checkbox={false} />;
    } else {
      const {onContentChange, onSearch, onExitValid, form} = this.props;
      const callback = {onCheck: onContentChange, onContentChange, onSearch, onExitValid};
      const valid = !form && this.props.valid;
      return <SuperTable2  {...{cols, items, valid, options, callback}} />;
    }
  };

  toOperation = () => {
    const saveType = this.props.label.commit ? 'default' : 'primary';
    return (
      <div role="operation">
        {this.toButton('cancel', this.closeButton, 'default', 'default')}
        {this.toButton('save', this.defaultButton, 'default', saveType)}
        {this.toButton('commit', this.defaultButton, 'default', 'primary')}
      </div>
    );
  };

  render() {
    return (
      <Card className={s.root}>
        <Title title='基本信息' />
        <Indent>{this.toForm()}</Indent>
        {this.toTitle()}
        <Indent>{this.toTable()}</Indent>
        {this.props.pageReadonly ? null : this.toOperation()}
      </Card>
    );
  }
}

export default withStyles(s)(EditPage);
