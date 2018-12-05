import React, {PropTypes} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {Icon, Avatar, Badge, Dropdown, Menu} from 'antd';
import Link from '../Link';
import s from './Header.less';
import Vertical from './Vertical';

const MenuItemGroup = Menu.ItemGroup;
const MenuItem = Menu.Item;
const MenuDivider = Menu.Divider;

const ITEM_TYPE = {
  key: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired
};

/**
 * selectKey: 选中的key
 * url：优先级高于setting或message中的href
 * setting: 如果不存在或为空，则隐藏设置
 * message: 如果不存在或为空，则隐藏消息
 * messageCount：未读消息的条数
 * username: 用户名
 * onMenuClick: 函数原型func(key)
 */
class Header extends React.Component {
  static propTypes = {
    selectKey: PropTypes.string,
    url: PropTypes.object,
    setting: PropTypes.shape(ITEM_TYPE),
    message: PropTypes.shape(ITEM_TYPE),
    messageCount: PropTypes.number,
    username: PropTypes.string,
    onMenuClick: PropTypes.func
  };

  static Vertical = Vertical;

  onMenuItemClick = ({key}) => {
    const {onMenuClick} = this.props;
    onMenuClick && onMenuClick(key);
  };

  isSelect = (item) => {
    return this.props.selectKey === item.key ? 'true' : null;
  };

  getUrl = (item) => {
    return this.props.url[item.key] || item.href;
  };

  icon = (item, verticalAlign='middle') => {
    const style = {fontSize: 18, verticalAlign};
    return <Icon type={item.icon} style={style} />;
  };

  setting = (item) => {
    const props = {
      'data-role': 'setting',
      'data-active': this.isSelect(item),
      to: this.getUrl(item),
      title: item.title
    };
    return <Link {...props}>{this.icon(item, '-2px')}</Link>;
  };

  menu = () => {
    return (
      <Menu className={s.menu} onClick={this.onMenuItemClick}>
        <MenuItemGroup title={this.props.username} />
        <MenuDivider />
        <MenuItem key='person'>个人信息</MenuItem>
        <MenuItem key='mode'>导入模板</MenuItem>
        <MenuItem key='modify'>修改密码</MenuItem>
        <MenuItem key='revoke'>注销</MenuItem>
      </Menu>
    );
  };

  message = (item) => {
    const count = this.props.messageCount || 0;
    return (
      <Link data-role='message' data-active={this.isSelect(item)} to={this.getUrl(item)}>
        <Badge count={count} overflowCount={99} title={`您有${count}条未读消息`}>
          {this.icon(item)}
        </Badge>
      </Link>
    );
  };

  avatar = () => {
    return (
      <Dropdown placement='bottomRight' overlay={this.menu()}>
        <span data-role='avatar' style={{cursor: 'pointer'}}>
          <Avatar icon="user" />
        </span>
      </Dropdown>
    );
  };

  render() {
    const {setting, message, messageCount} = this.props;
    return (
      <header className={s.root}>
        <Icon type='pld-logo'/>
        <span>TMS运输管理系统</span>
        <span>
          {setting ? this.setting(setting) : null}
          {message ? this.message(message, messageCount) : null}
          {this.avatar()}
        </span>
      </header>
    );
  }
}

export default withStyles(s)(Header);
