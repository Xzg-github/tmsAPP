import React, {PropTypes} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {Icon, Avatar, Badge, Dropdown, Menu} from 'antd';
import Link from '../Link';
import s from './Header.less';
const MenuItemGroup = Menu.ItemGroup;
const MenuItem = Menu.Item;
const MenuDivider = Menu.Divider;

const getUsername = () => {
  const username = 'username=';
  const cookie = document.cookie;
  const begin = cookie.indexOf(username) + username.length;
  const end = cookie.indexOf(';', begin);
  return unescape(cookie.substring(begin, end < 0 ? cookie.length : end));
};

const ITEM_TYPE = {
  key: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

/**
 * selectKey: 选中的key；首页的key固定为home, 设置导航的key固定为setting
 * selectUrl：selectKey对应的url，优先级高于settingUrl或items中的href
 * settingUrl: 设置的URL，如果不存在或为空，则隐藏设置
 * homeUrl: 首页(或称工作台)的URL，默认为'/'
 * items：除去首页和设置后的一级导航信息
 * onMenuClick: 函数原型func(key)
 */
class Header extends React.Component {
  static propTypes = {
    selectKey: PropTypes.string.isRequired,
    selectUrl: PropTypes.string,
    messageUrl: PropTypes.string,
    homeUrl: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape(ITEM_TYPE)),
    onMenuClick: PropTypes.func,
    messageCount: PropTypes.number
  };

  constructor(props) {
    super(props);
    if (props.selectUrl) {
      this.state = {[props.selectKey]: props.selectUrl, username: getUsername()};
    } else {
      this.state = {username: getUsername()};
    }
  }

  componentWillReceiveProps(props) {
    if (props.selectUrl) {
      this.setState({[props.selectKey]: props.selectUrl});
    }
  }

  onVisibleChange = (visible) => {
    this.setState({visible});
  };

  onMenuItemClick = ({key}) => {
    const {onMenuClick} = this.props;
    this.setState({visible: false});
    onMenuClick && onMenuClick(key);
  };

  getLinkProps = (key, url, props={}) => {
    return {
      ...props,
      to: url,
      'data-role': 'block',
      'data-active': this.props.selectKey === key ? 'true' : null
    };
  };

  toLogo = (homeUrl) => {
    const props = this.getLinkProps('home', homeUrl || '/', {role: 'logo'});
    return <Link {...props}>TMS</Link>;
  };

  toItem = ({key, href, title}, index) => {
    const props = this.getLinkProps(key, this.state[key] || href, {key: index});
    return <Link {...props}>{title}</Link>;
  };

  toMiddle = (items) => {
    return (
      <span>
        {items.map(this.toItem)}
      </span>
    );
  };

  toIcon = (type) => {
    const style = {fontSize: 18, verticalAlign: 'middle'};
    return <Icon type={type} style={style} />;
  };

  toSetting = (settingUrl) => {
    if (settingUrl) {
      const props = this.getLinkProps('setting', this.state['setting'] || settingUrl);
      return <Link {...props}>{this.toIcon('pld-setting')}</Link>;
    } else {
      return null;
    }
  };

  toMenu = () => {
    return (
      <Menu className={s.menu} onClick={this.onMenuItemClick}>
        <MenuItemGroup title={this.state.username} />
        <MenuDivider />
        <MenuItem key='person'>个人信息</MenuItem>
        <MenuItem key='mode'>导入模板</MenuItem>
        <MenuItem key='modify'>修改密码</MenuItem>
        <MenuItem key='revoke'>注销</MenuItem>
      </Menu>
    );
  };

  toAvatar = () => {
    const props = {
      placement: 'bottomRight',
      overlay: this.toMenu(),
      trigger: ['click'],
      onVisibleChange: this.onVisibleChange
    };
    return (
      <Dropdown {...props}>
        <span role='avatar' data-role='block' data-active={this.state.visible ? true : null}>
          <Avatar icon="user" />
        </span>
      </Dropdown>
    );
  };

  toMessage = (messageUrl, count=0) => {
    if (messageUrl) {
      const props = this.getLinkProps('message', this.state['message'] || messageUrl);
      const msgProps = {
        overflowCount: 99,
        title: `您有${count}条未读消息`,
        count
      };
      return (
        <Link {...props}>
          <span role='message'>
            {/* <Badge dot>{this.toIcon('pld-message')}</Badge> */}
            <Badge {...msgProps}>{this.toIcon('pld-message')}</Badge>
          </span>
        </Link>
      );
    } else {
      return null;
    }
  };

  toTail = (settingUrl,messageUrl,messageCount) => {
    return (
      <span>
        {this.toSetting(settingUrl)}
        {this.toMessage(messageUrl,messageCount)}
        {this.toAvatar()}
      </span>
    );
  };

  render() {
    const {items, homeUrl, settingUrl,messageUrl,messageCount} = this.props;
    return (
      <header className={s.root}>
        {this.toLogo(homeUrl)}
        {this.toMiddle(items)}
        {this.toTail(settingUrl,messageUrl,messageCount)}
      </header>
    );
  }
}

export default withStyles(s)(Header);
