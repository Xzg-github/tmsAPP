import React, {PropTypes} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {Input, Button} from 'antd';
import s from './Page.less';

const DEFAULT_SIZE = 'large';

class Page extends React.Component {
  static propTypes = {
    label: PropTypes.object,
    value: PropTypes.object,
    loading: PropTypes.bool,
    onChange: PropTypes.func,
    onOk: PropTypes.func
  };

  isDisabled = () => {
    const {value} = this.props;
    return !(value.new && value.old && value.confirm);
  };

  onChange = (e) => {
    const {onChange} = this.props;
    onChange && onChange(e.target.name, e.target.value);
  };

  onOk = () => {
    if (!this.isDisabled()) {
      const {loading, onOk} = this.props;
      !loading && onOk && onOk();
    }
  };

  toInput = (key) => {
    const {label, value} = this.props;
    const props = {
      name: key,
      type: 'password',
      placeholder: label[key],
      value: value[key] || '',
      onChange: this.onChange,
      onPressEnter: this.onOk,
      size: DEFAULT_SIZE,
      autoComplete: 'new-password'
    };
    return <Input {...props} />;
  };

  toOkButton = () => {
    const {label, loading} = this.props;
    const props = {
      style: {width: '100%'},
      loading: loading ? {delay: 200} : false,
      onClick: this.onOk,
      type: 'primary',
      size: DEFAULT_SIZE,
      disabled: this.isDisabled()
    };
    return <Button {...props}>{label.ok}</Button>;
  };

  render() {
    return (
      <div className={s.root}>
        <form>
          <h1>{this.props.label.title}</h1>
          {this.toInput('old')}
          {this.toInput('new')}
          {this.toInput('confirm')}
          {this.toOkButton()}
        </form>
      </div>
    );
  }
}

export default withStyles(s)(Page);
