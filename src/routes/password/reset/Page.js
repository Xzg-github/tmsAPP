import React, {PropTypes} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import Icon from 'antd/lib/icon';
import Frame from '../frame/Frame';
import s from './Page.less';
import helper from '../../../common/common';

const URL_RESET = '/api/password/reset';

const resetPassword = async (password, sid, email) => {
  const option = helper.postOption({sid, userAccount: email, newPassword: password}, 'put');
  const {returnCode} = await helper.fetchJson(URL_RESET, option);
  return returnCode === 0;
};

class Page extends React.Component {
  static propTypes = {
    sid: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
  };

  state = {new: '', confirm: '', loading: false, disabled: true, reset: false};

  onChange = (e) => {
    const {name, value} = e.target;
    const state = Object.assign({}, this.state, {[name]: value});
    Object.assign(state, {disabled: !state.new || !state.confirm});
    this.setState(state);
  };

  onOk = () => {
    if (!this.state.disabled) {
      if (this.state.new !== this.state.confirm) {
        helper.showError('2次输入的密码不一致');
        return;
      }

      this.setState({loading: true});
      resetPassword(this.state.new, this.props.sid, this.props.email).then(success => {
        if (success) {
          this.setState({loading: false, reset: true, second: 5});
        } else {
          this.setState({loading: false});
          helper.showError('重置密码失败');
        }
      });
    }
  };

  toInput = (key, title) => {
    const props = {
      value: this.state[key],
      name: key,
      type: 'password',
      placeholder: title,
      size: 'large',
      autoComplete: 'new-password',
      onChange: this.onChange,
      onPressEnter: this.onOk,
    };
    return <Input {...props} />;
  };

  toOkButton = () => {
    const props = {
      key: 'ok',
      style: {width: '100%'},
      loading: this.state.loading && {delay: 200},
      type: 'primary',
      size: 'large',
      disabled: this.state.disabled,
      onClick: this.onOk,
    };
    return <Button {...props}>确定</Button>;
  };

  toReturnButton = () => {
    const props = {
      key: 'return',
      style: {width: '100%'},
      type: 'primary',
      size: 'large',
      onClick: () => window.location.href = '/login',
    };
    return <Button {...props}>返回登陆</Button>;
  };

  autoJump = () => {
    setTimeout(() => {
      if (this.state.second > 0) {
        this.setState({second: this.state.second - 1});
      } else {
        window.location.href = '/login';
      }
    }, 1000);
  };

  renderReturn = () => {
    this.autoJump();
    return (
      <div role='return'>
        <div><Icon type='check-circle'/></div>
        <h1>您的密码已重置成功，请牢记!</h1>
        {this.toReturnButton()}
        <p>{this.state.second}秒后系统自动返回登陆页</p>
      </div>
    );
  };

  renderReset = () => {
    return (
      <div role='reset'>
        {this.toInput('new', '请输入新密码')}
        {this.toInput('confirm', '请确认新密码')}
        {this.toOkButton()}
      </div>
    );
  };

  render() {
    return (
      <Frame contentClass={s.root}>
        {this.state.reset ? this.renderReturn() : this.renderReset()}
      </Frame>
    );
  }
}

export default withStyles(s)(Page);
