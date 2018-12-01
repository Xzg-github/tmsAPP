import React, { PropTypes } from 'react';
import Link from '../Link';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Sidebar.less';
import {Icon} from 'antd';

const ITEM_HEIGHT = 40;

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
 * isFolder：为true表明有下级菜单，此时href被忽略，children存放下级菜单的信息
 * href: isFolder为false时，为跳转页面的url，否则被忽略
 * children：isFolder为true时，存放下级菜单的信息，否则被忽略
 */
const ItemType = {
  key: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  isFolder: PropTypes.bool,
  href: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.shape(ChildType))
};

/**
 * title: 侧边栏的标题
 * mode: 显示模式，默认为expand(展开)
 * activeKey：指定被选中的一级条目的key，不能是二级条目的key
 * items：存放所有侧边栏条目的信息
 * openKeys: 展开条目的key
 * style: 样式
 * onOpenChange: 展开条目信息改变时触发，原型为func(openKeys)
 * onModeChange: 模式改变时触发，原型为func(mode)
 */
class Sidebar extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    mode: PropTypes.oneOf(['collapse', 'expand']),
    activeKey: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape(ItemType)),
    openKeys: PropTypes.array,
    style: PropTypes.object,
    onOpenChange: PropTypes.func,
    onModeChange: PropTypes.func
  };

  onModeChange = () => {
    const mode = this.props.mode || 'expand';
    this.props.onModeChange(mode === 'expand' ? 'collapse' : 'expand');
  };

  isSelect = (item) => {
    return this.props.activeKey === item.key;
  };

  isOpen = (item) => {
    return this.props.openKeys.includes(item.key);
  };

  getHeight = (item) => {
    if (item.isFolder && this.isOpen(item)) {
      return (item.children.length + 1) * ITEM_HEIGHT;
    } else {
      return ITEM_HEIGHT;
    }
  };

  linkProps = (item) => {
    if (item.isFolder) {
      return {
        title: item.title,
        onClick: () => {
          if (this.isOpen(item)) {
            this.props.onOpenChange(this.props.openKeys.filter(key => item.key !== key));
          } else {
            this.props.onOpenChange([...this.props.openKeys, item.key]);
          }
        }
      }
    } else {
      return {
        title: item.title,
        to: item.href,
        'data-select': this.isSelect(item)
      };
    }
  };

  renderChild = (item, index) => {
    return (
      <li key={index}>
        <Link {...this.linkProps(item)} data-role='child-item'>
          <span>{item.title}</span>
        </Link>
      </li>
    );
  };

  renderItem = (item, index) => {
    return (
      <li key={index} style={{height: this.getHeight(item)}}>
        <Link {...this.linkProps(item)} data-role='parent-item'>
          <span>{item.isFolder ? <Icon type='caret-right' data-open={this.isOpen(item)} /> : null}</span>
          <span>{item.title}</span>
        </Link>
        {item.isFolder ? <ul>{item.children.map(this.renderChild)}</ul> : null}
      </li>
    );
  };

  render() {
    return (
      <div className={s.root} data-mode={this.props.mode || 'expand'}>
        <div>
          <span> </span>
          <span>{this.props.title}</span>
        </div>
        <ul>{this.props.items.map(this.renderItem)}</ul>
        <div data-role='shousuo' onClick={this.onModeChange}>
          <div>
            <i />
            <div><Icon type='pld-shousuo' /></div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Sidebar);
