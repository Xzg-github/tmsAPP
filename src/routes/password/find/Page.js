import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import Icon from 'antd/lib/icon';
import Frame from '../frame/Frame';
import s from './Page.less';
import helper from '../../../common/common';

const URL_MAIL = '/api/password/mail';

const sendMail = async (mail) => {
  const url = `${window.location.protocol}//${window.location.host}/password/reset`;
  const option = helper.postOption({account: mail, hostUrl: url}, 'put');
  const {returnCode} = await helper.fetchJson(URL_MAIL, option);
  return returnCode === 0;
};

class Page extends React.Component {
  state = {mail: '', disabled: true, loading: false, send: false};

  onChange = (e) => {
    const mail = e.target.value;
    this.setState({mail, disabled: !mail});
  };

  onOk = () => {
    if (!this.state.disabled) {
      this.setState({loading: true});
      sendMail(this.state.mail).then(success => {
        if (success) {
          this.setState({loading: false, send: true});
        } else {
          this.setState({loading: false});
          helper.showError('发送邮件失败');
        }
      });
    }
  };

  toInput = () => {
    const props = {
      value: this.state.mail,
      placeholder: '邮箱账号',
      size: 'large',
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

  renderSend = () => {
    return (
      <div role='send'>
        <h1>邮箱找回</h1>
        <p>请输入您的邮箱:</p>
        {this.toInput()}
        {this.toOkButton()}
      </div>
    );
  };


  renderReturn = () => {
    return (
      <div role='return'>
        <div><Icon type='check-circle'/></div>
        <p>我们已将找回密码的链接发送至您的邮箱</p>
        <p>请登录邮箱并重置密码</p>
        {this.toReturnButton()}
      </div>
    );
  };

  render() {
    return (
      <Frame contentClass={s.root}>
        {this.state.send ? this.renderReturn() : this.renderSend()}
      </Frame>
    );
  }
}

export default withStyles(s)(Page);
