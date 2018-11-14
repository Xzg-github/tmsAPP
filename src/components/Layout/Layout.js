import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Layout.less';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Loading from '../Loading';
import {Icon} from 'antd';

class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    nav1: PropTypes.string,
    nav2: PropTypes.string,
    settingUrl: PropTypes.string,
    navItems: PropTypes.array,
    sidebars: PropTypes.object,
    openKeys: PropTypes.object,
    onOpenChange: PropTypes.func,
    onMenuClick: PropTypes.func
  };

  state = {expand: true};

  onOpenChange = (openKeys) => {
    const {nav1, onOpenChange} = this.props;
    if (onOpenChange) {
      onOpenChange(nav1, openKeys);
    }
  };

  getSidebarProps = (nav1, nav2) => {
    const {sidebars, openKeys={}} = this.props;
    return {
      activeKey: nav2,
      items: sidebars[nav1] || [],
      onOpenChange: this.onOpenChange,
      openKeys: openKeys[nav1]
    };
  };

  toSidebar = (nav1, nav2) => {
    if (!nav2) {
      return null;
    } else {
      return (
        <aside data-expand={this.state.expand}>
          <div onClick={() => this.setState({expand: !this.state.expand})}><Icon type='right'/></div>
          <div><Sidebar {...this.getSidebarProps(nav1, nav2)} /></div>
        </aside>
      );
    }
  };

  getSelectKey = (nav1) => {
    if (nav1 === 'basic') {
      return 'setting';
    } else {
      return nav1;
    }
  };

  toHeader = (loading, nav1, nav2) => {
    const {navItems: items, settingUrl,messageUrl, onMenuClick,messageCount} = this.props;
    const selectKey = this.getSelectKey(nav1);
    const selectUrl = loading ? '' : `/${nav1}/${nav2}`;
    return <Header {...{items, selectKey, selectUrl, settingUrl,messageUrl, onMenuClick,messageCount}} />;
  };

  render() {
    const {loading, nav1='', nav2='', children} = this.props;
    return (
      <div className={s.root}>
        {this.toHeader(loading, loading || nav1, nav2)}
        {
          loading ? <Loading /> :
          <div>
            {this.toSidebar(nav1, nav2)}
            <section>{children}</section>
          </div>
        }
      </div>
    )
  };
}

export default withStyles(s)(Layout);


