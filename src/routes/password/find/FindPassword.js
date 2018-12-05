import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './FindPassword.less';
import helper from '../../../common/common';
import execWithLoading from '../../../standard-business/execWithLoading';
import {Icon, Steps, Input, Button} from 'antd';
import GVerify from './gVerify';

const Step = Steps.Step;
const URL_SEND_CODE = '/api/password/send_code';
const URL_VERIFY_CODE = '/api/password/verify_code';
const URL_RESET = '/api/password/reset';

function isEmail(str){
  const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+$/;
  return reg.test(str);
}

function isMobile(str) {
  const reg = /^[1][34578][0-9]{9}$/;
  return reg.test(str);
}

function Step1(props) {
  const getInputProps = (mode, key, placeholder) => {
    return {
      placeholder,
      name: `${mode}_${key}`,
      value: props[mode][key] || '',
      onChange: props.onChange
    };
  };
  const disabled = (mode) => !props[mode].account || !props[mode].code;
  return (
    <div className={s.step1} data-mode={props.mode}>
      <div>
        <span onClick={() => props.onClick('mode_mobile')}>手机找回</span>
        <span onClick={() => props.onClick('mode_email')}>邮箱找回</span>
      </div>
      <div>
        <div>
          <div>手机号码</div>
          <div><Input {...getInputProps('mobile', 'account', '请输入11位手机号码')}/></div>
          <div>图形验证码</div>
          <div>
            <Input {...getInputProps('mobile', 'code', '不区分大小写，点击图片可刷新')} />
            <div id={props.mobile.id} />
          </div>
          <div><Button type='primary' onClick={props.next} disabled={disabled('mobile')}>下一步</Button></div>
        </div>
        <div>
          <div>邮箱</div>
          <div><Input {...getInputProps('email', 'account', '请输入邮箱')} /></div>
          <div>图形验证码</div>
          <div>
            <Input {...getInputProps('email', 'code', '不区分大小写，点击图片可刷新')} />
            <div id={props.email.id} />
          </div>
          <div><Button type='primary' onClick={props.next} disabled={disabled('email')}>下一步</Button></div>
        </div>
      </div>
    </div>
  );
}

function Step2(props) {
  const label = [
    ['验证当前账号绑定的手机号码:', '短信验证码', '请输入短信验证码'],
    ['验证当前账号绑定的邮箱:', '邮箱验证码', '请输入邮箱中收到的6位验证码']
  ][props.mode === 'mobile' ? 0 : 1];
  const title = `${props.time < 0 ? '重新' : ''}发送验证码${props.time > 0 ? `(${props.time})` : ''}`;
  return (
    <div className={s.step2}>
      <div>
        <span>{label[0]}</span>
        <span>{props.account}</span>
        <a onClick={() => props.onClick('account')}>更换账号</a>
      </div>
      <div>{label[1]}</div>
      <div>
        <Input placeholder={label[2]} name='code' value={props.code} onChange={props.onChange}/>
        <Button disabled={props.time > 0} onClick={() => props.onClick('send')}>{title}</Button>
      </div>
      <div><Button type='primary' onClick={props.next} disabled={!props.code}>下一步</Button></div>
    </div>
  );
}

function Step3(props) {
  const getPasswordProps = (mode, key, placeholder) => {
    return {
      placeholder,
      type: 'password',
      autoComplete: 'new-password',
      name: `${mode}_${key}`,
      value: props[mode][key] || '',
      onChange: props.onChange
    };
  };
  const disabled = () => !props.password.first || !props.password.second;
  return (
    <div className={s.step3}>
      <div>新密码</div>
      <div><Input {...getPasswordProps('password', 'first', '请输入新密码，6-16位字母/数字/符号组合')} /></div>
      <div>确认新密码</div>
      <div><Input {...getPasswordProps('password', 'second', '请输入和上面相同的密码')} /></div>
      <div><Button type='primary' onClick={props.next} disabled={disabled()}>确定</Button></div>
    </div>
  );
}

function CurrentStep(props) {
  const sp = {onClick: props.onClick, onChange: props.onChange, next: props.onClick.bind(null, 'next')};
  if (props.step === 0) {
    sp.mode = props.mode;
    sp.mobile = props.mobile;
    sp.email = props.email;
    return <Step1 {...sp} />;
  } else if (props.step === 1) {
    sp.mode = props.mode;
    sp.code = props.code;
    sp.time = props.time;
    sp.account = props[props.mode].account;
    return <Step2 {...sp} />;
  } else if (props.step === 2) {
    sp.password = props.password;
    return <Step3 {...sp} />;
  } else {
    return <div>error step</div>;
  }
}

class FindPassword extends React.Component {
  state = {step: 0, mode: 'mobile', mobile: {id: 'mobile'}, email: {id: 'email'}, code: '', password: {}, time: 0};

  onChange = (e) => {
    const {name, value} = e.target;
    const names = ['mobile_account', 'mobile_code', 'email_account', 'email_code', 'password_first', 'password_second'];
    if (name === 'code') {
      this.setState({code: value});
    } else if (names.includes(name)) {
      const [mode, key] = name.split('_');
      this.setState({[mode]: Object.assign({}, this.state[mode], {[key]: value})});
    }
  };

  onStep1MobileNext = () => {
    if (!isMobile(this.state.mobile.account)) {
      helper.showError('手机号码格式不正确');
    } else if (!this.mobile.validate(this.state.mobile.code)) {
      helper.showError('验证码不正确');
    } else {
      this.setState({step: 1});
    }
  };

  onStep1EmailNext = () => {
    if (!isEmail(this.state.email.account)) {
      helper.showError('邮箱格式不正确');
    } else if (!this.email.validate(this.state.email.code)) {
      helper.showError('验证码不正确');
    } else {
      this.setState({step: 1});
    }
  };

  onStep2Next = () => {
    if (!this.state.codeId) {
      helper.showError(this.state.time === 0 ? '请先发送验证码' : '请重新发送验证码');
    } else {
      execWithLoading(async () => {
        const option = helper.postOption({code: this.state.code});
        const json = await helper.fetchJson(URL_VERIFY_CODE, option);
        if (json.returnCode !== 0) {
          helper.showError(json.returnMsg);
        } else {
          this.setState({step: 2});
        }
      });
    }
  };

  onStep3Next = () => {
    const password = this.state.password;
    const length = password.first.length;
    if (length < 6 || length > 16) {
      helper.showError('密码为6-16位字母/数字/符号组合');
    } else if (password.first !== password.second) {
      helper.showError('两次输入的密码不一致');
    } else {
      execWithLoading(async () => {
        const body = {};
        const json = await helper.fetchJson(URL_RESET, helper.postOption(body, 'put'));
        if (json.returnCode !== 0) {
          helper.showError(json.returnCode);
        } else {
          helper.showSuccessMsg('密码重置成功');
        }
      });
    }
  };

  onModeMobile = () => {
    this.refresh = true;
    this.setState({mode: 'mobile'});
  };

  onModeEmail = () => {
    this.refresh = true;
    this.setState({mode: 'email'});
  };

  onAccount = () => {
    this.setState({step: 0, codeId: ''});
  };

  onSendCode = () => {
    execWithLoading(async () => {
      const mode = this.state.mode;
      const body = {type: mode === 'mobile' ? 'phone' : 'email', account: this.state[mode].account};
      const json = await helper.fetchJson(URL_SEND_CODE, helper.postOption(body));
      if (json.returnCode !== 0) {
        helper.showError(json.returnMsg);
      } else {
        this.setState({time: 60, codeId: json.result});
        const id = setInterval(() => {
          if (this.state.time > 1) {
            this.setState({time: this.state.time - 1});
          } else if (this.state.time === 1) {
            this.setState({time: -1});
            clearInterval(id);
          } else {
            clearInterval(id);
          }
        }, 1000);
      }
    });
  };

  onClick = (key) => {
    if (key === 'next') {
      if (this.state.step === 0) {
        if (this.state.mode === 'mobile') {
          this.onStep1MobileNext();
        } else {
          this.onStep1EmailNext();
        }
      } else if (this.state.step === 1) {
        this.onStep2Next();
      } else if (this.state.step === 2) {
        this.onStep3Next();
      }
    } else if (key === 'mode_mobile') {
      this.onModeMobile();
    } else if (key === 'mode_email') {
      this.onModeEmail();
    } else if (key === 'account') {
      this.onAccount();
    } else if (key === 'send') {
      this.onSendCode();
    }
  };

  componentDidMount() {
    const mode = this.state.mode;
    this[mode] = new GVerify({id: this.state[mode].id, canvasId: `${mode}_canvas`});
  }

  componentDidUpdate() {
    if (this.state.step === 0) {
      const mode = this.state.mode;
      if (!this[mode]) {
        this.refresh = false;
        this[mode] = new GVerify({id: this.state[mode].id, canvasId: `${mode}_canvas`});
      }

      if (this.refresh) {
        this.refresh = false;
        this[mode].refresh();
      }
    } else {
      this.mobile = null;
      this.email = null;
    }
  }

  render() {
    return (
      <div className={s.root}>
        <header>
          <Icon type='pld-logo'/>
          <span>TMS运输管理系统</span>
          <span><a href='/login'>返回登陆页</a></span>
        </header>
        <section>
          <div>
            <Steps current={this.state.step}>
              <Step title="填写账号" />
              <Step title="验证身份" />
              <Step title="设置新密码" />
            </Steps>
            <CurrentStep {...this.state} onChange={this.onChange} onClick={this.onClick} />
          </div>
        </section>
        <footer>
          <span>Copyright ©2005 - 2013 深圳市云恋科技有限公司</span>
          <a href='http://www.miitbeian.gov.cn' target='_blank'>粤ICP备17104734号-1</a>
        </footer>
      </div>
    );
  }
}

export default withStyles(s)(FindPassword);
