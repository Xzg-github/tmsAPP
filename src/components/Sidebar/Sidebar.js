import React, { PropTypes } from 'react';
import Link from '../Link';
import {Menu, Icon} from 'antd';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Sidebar.less';
const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;
/** 侧边栏二级条目的类型
 * key: 唯一标识一个条目
 * title：条目的标题
 * href: 为跳转页面的url
 */
const ChildType = {
  key: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired
};

/** 侧边栏一级条目的类型
 * key: 唯一标识一个条目
 * title：条目的标题
 * icon：条目左边图标url，大小为20*20px
 * isFolder：为true表明有下级菜单，此时href被忽略，children存放下级菜单的信息
 * href: isFolder为false时，为跳转页面的url，否则被忽略
 * children：isFolder为true时，存放下级菜单的信息，否则被忽略
 */
const ItemType = {
  key: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.string,
  isFolder: PropTypes.bool,
  href: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.shape(ChildType))
};

/**
 * activeKey：指定被选中的一级条目的key，不能是二级条目的key
 * items：存放所有侧边栏条目的信息
 * style: 样式
 */
class Sidebar extends React.Component {
  static propTypes = {
    activeKey: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape(ItemType)).isRequired,
    style: PropTypes.object
  };

  onOpenChange = (openKeys) => {
    const {onOpenChange} = this.props;
    if (onOpenChange) {
      onOpenChange(openKeys);
    }
  };

  toIcon = (type) => {
    if (type) {
      return <Icon type={type} style={{fontSize: 16, verticalAlign: -2}} />
    } else {
      return null;
    }
  };

  toItem = ({key, title, isFolder, children, href, icon, unreadTotal}) => {
    if (isFolder) {
      const t = <div>{this.toIcon(icon)}{title}</div>;
      return (
        <SubMenu key={key} title={t}>
          {this.toItems(children)}
        </SubMenu>
      );
    } else {
      return (
        <MenuItem key={key}>
          <Link to={href} title={title} className={s.unreadTotalLink}>
            {this.toIcon(icon)}
            {title}
            {unreadTotal && unreadTotal>0 && <span className={s.unreadTotal}>{unreadTotal}</span>}
          </Link>
        </MenuItem>
      );
    }
  };

  toItems = (items) => {
    return items.map(this.toItem);
  };

  getProps = () => {
    const {style, activeKey, openKeys=[]} = this.props;
    return {
      style, openKeys,
      selectedKeys: [activeKey],
      mode: 'inline',
      onOpenChange: this.onOpenChange
    }
  };

  render() {
    return (
      <Menu {...this.getProps()}>
        {this.toItems(this.props.items)}
      </Menu>
    );
  }
}

export default withStyles(s)(Sidebar);
