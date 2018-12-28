import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Layout.less';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Loading from '../Loading';
import { Breadcrumb } from 'antd';
const BreadcrumbItem = Breadcrumb.Item;

const HeaderV = Header.Vertical;

const getUsername = () => {
  const username = 'username=';
  const cookie = document.cookie;
  const begin = cookie.indexOf(username) + username.length;
  const end = cookie.indexOf(';', begin);
  return unescape(cookie.substring(begin, end < 0 ? cookie.length : end));
};

class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    nav1: PropTypes.string,
    nav2: PropTypes.string,
    settingUrl: PropTypes.string,
    navigation: PropTypes.array,
    sidebars: PropTypes.object,
    openKeys: PropTypes.object,
    onOpenChange: PropTypes.func,
    onMenuClick: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {mode: 'expand', username: getUsername(), url: {}};
  }

  componentWillReceiveProps(props) {
    if (!props.loading) {
      this.setState({url: Object.assign({}, this.state.url, {[props.nav1]: `/${props.nav1}/${props.nav2}`})});
    }
  }

  onOpenChange = (openKeys) => {
    const {nav1, onOpenChange} = this.props;
    if (onOpenChange) {
      onOpenChange(nav1, openKeys);
    }
  };

  findNavItem = (key) => {
    return this.props.navigation.find(item => item.key === key);
  };

  headerProps = (selectKey) => {
    return {
      selectKey,
      url: this.state.url,
      setting: this.findNavItem('basic'),
      message: this.findNavItem('message'),
      messageCount: this.props.messageCount,
      username: this.state.username,
      onMenuClick: this.props.onMenuClick
    };
  };

  headerVProps = (selectKey) => {
    const keys = ['basic', 'message'];
    return {
      selectKey,
      url: this.state.url,
      items: this.props.navigation.filter(item => !keys.includes(item.key))
    };
  };

  sidebarProps = (nav1, nav2) => {
    const item = this.props.navigation.find(item => item.key === nav1) || {};
    return {
      mode: this.state.mode,
      title: item.title,
      activeKey: nav2,
      items: this.props.sidebars[nav1] || [],
      openKeys: (this.props.openKeys || {})[nav1],
      onOpenChange: this.onOpenChange,
      onModeChange: mode => this.setState({mode})
    };
  };

  toPageTitle = () => {
    const {pageTitles, nav2} = this.props;
    return (
      <Breadcrumb separator=">">
        {pageTitles[nav2].map((item, index) => (<BreadcrumbItem key={index}>{item}</BreadcrumbItem>))}
      </Breadcrumb>
    );
  };

  render() {
    const {loading, nav1='', nav2='', children} = this.props;
    return (
      <div className={s.root}>
        <Header {...this.headerProps(loading || nav1)} />
        <div>
          <HeaderV {...this.headerVProps(loading || nav1)} />
          <aside>{nav2 ? <Sidebar {...this.sidebarProps(nav1, nav2)} /> : null}</aside>
          {nav2 ? this.toPageTitle() : null}
          {loading ? <Loading /> : <section>{children}</section>}
        </div>
      </div>
    )
  };
}

export default withStyles(s)(Layout);


