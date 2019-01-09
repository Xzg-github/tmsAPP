import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {Link} from '../../../../components';
import s from './TodoItem.less';

class TodoItem extends React.Component {
  static propTypes = {
    href: PropTypes.string,
    title: PropTypes.string,
    activeKey: PropTypes.string,
    count: PropTypes.number,
    disabled: PropTypes.bool,
    countColor: PropTypes.string
  };

  onLink = (activeKey = true) => {
    global['__home'] = activeKey;
  };

  toItem = () => {
    const {href, title, count, activeKey, disabled, countColor} = this.props;
    const countStyle = (!disabled && count && countColor) ? {color: countColor} : {};
    return (
      <Link data-role='item' to={href} disabled={disabled} onClick={this.onLink.bind(null, activeKey)}>
        <span style={countStyle}>{disabled ? '┅' : count}</span>
        <span>{title}</span>
      </Link>
    );
  };

  getStatus = (title, disabled) => {
    if (title) {
      return disabled ? 'disabled' : 'normal';
    } else {
      return null;
    }
  };

  render() {
    const {title, disabled} = this.props;
    const status = this.getStatus(title, disabled);
    return (
      <span className={s.root} data-status={status}>
        {title ? this.toItem() : null}
      </span>
    );
  }
}

export default withStyles(s)(TodoItem);
