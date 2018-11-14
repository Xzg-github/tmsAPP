import React, {PropTypes} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './SuperToolbar.less';
import {Menu, Dropdown, Button} from 'antd';
const MenuItem = Menu.Item;

const ButtonType = {
  key: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.string,
  bsStyle: PropTypes.string
};

const CallbackType = {
  onClick: PropTypes.func
};

class SuperToolbar extends React.Component {
  static propTypes = {
    buttons: PropTypes.arrayOf(PropTypes.shape(ButtonType)).isRequired,
    size: PropTypes.oneOf(['small', 'default', 'large']),
    callback: PropTypes.shape(CallbackType)
  };

  onClick = key => {
    const {callback = {}} = this.props;
    if (callback.onClick) {
      callback.onClick(key);
    }
  };

  onMenuClick = ({key}) => {
    this.onClick(key);
  };

  toMenuItem = ({key, title}) => {
    return (
      <MenuItem key={key}>
        {title}
      </MenuItem>
    )
  };

  toButton = ({key, title, bsStyle}) => {
    const onClick = this.onClick.bind(this, key);
    const {size = 'small'} = this.props;
    const props = {key, size, onClick, type: bsStyle};
    return <Button {...props}>{title}</Button>;
  };

  toMenus = (children) => {
    return (
      <Menu onClick={this.onMenuClick}>
        {children.length && children.map(this.toMenuItem)}
      </Menu>
    )
  };

  toToolbar = ({key, title, bsStyle, dropDown, children}) => {
    const onClick = this.onClick.bind(this, key);
    const {size = 'small'} = this.props;
    const props = {key, size, onClick, type: bsStyle};
    if (dropDown) {
      return (
        <Dropdown overlay={this.toMenus(children)} placement="bottomCenter" key={key}>
          <Button {...props}>{title}</Button>
        </Dropdown>
      )
    } else {
      return <Button {...props}>{title}</Button>;
    }
  };

  render() {
    const {buttons, option = {}} = this.props;
    return (
      <div className={s.root} role='toolbar'>
        {
          buttons.map(this.toToolbar)
        }
      </div>
    );
  }
}

export default withStyles(s)(SuperToolbar);
