import React, {PropTypes} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {Icon} from 'antd';
import Link from '../Link';
import s from './Vertical.less';

const ITEM_TYPE = {
  key: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired
};

/**
 * selectKey: 选中的key
 * url：url优先级高于item中的href
 */
class Vertical extends React.Component {
  static propTypes = {
    selectKey: PropTypes.string,
    url: PropTypes.object,
    items: PropTypes.arrayOf(PropTypes.shape(ITEM_TYPE))
  };

  isSelect = (item) => {
    return item.key === this.props.selectKey;
  };

  getUrl = (item) => {
    return this.props.url[item.key] || item.href;
  };

  toItem = (item) => {
    return (
      <Link key={item.key} to={this.getUrl(item)} data-select={this.isSelect(item)}>
        <span><Icon type={item.icon} /></span>
        <span>{item.title}</span>
      </Link>
    );
  };

  render() {
    return (
      <header className={s.root}>
        {this.props.items.map(this.toItem)}
      </header>
    );
  }
}

export default withStyles(s)(Vertical);
