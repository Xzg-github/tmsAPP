import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './SuperToolbar.less';
import {Button, Popconfirm, Icon, Dropdown, Menu} from 'antd';
const MenuItem = Menu.Item;

/**
 * key: 用于标识按钮
 * title: 按钮上的文字
 * bsStyle: 按钮样式，与antd中Button的type取值一样
 * confirm: 触发按钮事件前，是否需要用户确认，以及确认的提示文字；为空串则不会触发确认提示
 * menu: [可选]，下拉菜单项，包含key和title的对象数组，此时点击按钮不会触发onClick事件，只有点击菜单项才会触发
 */
const ButtonType = {
  key: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  bsStyle: PropTypes.string,
  confirm: PropTypes.string,
  menu: PropTypes.array
};

const ButtonEx = ({type, children, ...props}) => {
  props[type === 'primary-o' ? 'data-btn-type' : 'type'] = type;
  return <Button {...props}>{children}</Button>;
};

class SuperToolbar extends React.Component {
  static propTypes = {
    buttons: PropTypes.arrayOf(PropTypes.shape(ButtonType)).isRequired,
    size: PropTypes.oneOf(['small', 'default', 'large']),
    onClick: PropTypes.func
  };

  onClick = (e) => {
    const {onClick, callback={}} = this.props;
    const key = typeof e === 'object' ? e.key : e;
    if (onClick) {
      onClick(key);
    } else if (callback.onClick) {
      // callback被废弃，只是为了兼容旧代码而已
      callback.onClick(key);
    }
  };

  toMenu = (menu) => {
    return (
      <Menu onClick={this.onClick}>
        {menu.map(({key, title}) => <MenuItem key={key}>{title}</MenuItem>)}
      </Menu>
    );
  };

  toButton = ({key, title, bsStyle: type, confirm, menu}) => {
    const onClick = this.onClick.bind(this, key);
    const {size='default'} = this.props;
    if (menu && menu.length) {
      return (
        <Dropdown key={key} trigger={['hover']} overlay={this.toMenu(menu)}>
          <ButtonEx {...{size, type}}>{title}<Icon type='down'/></ButtonEx>
        </Dropdown>
      );
    } else if (!confirm) {
      return <ButtonEx {...{key, size, type, onClick}}>{title}</ButtonEx>;
    } else {
      return (
        <Popconfirm key={key} title={confirm} onConfirm={onClick}>
          <ButtonEx {...{size, type}}>{title}</ButtonEx>
        </Popconfirm>
      );
    }
  };

  render() {
    const {buttons, style={}} = this.props;
    return (
      <div className={s.root} role='toolbar' style={style}>
        {buttons.map(this.toButton)}
      </div>
    );
  }
}

export default withStyles(s)(SuperToolbar);
