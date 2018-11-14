import React, {PropTypes} from 'react';
import {getObject} from '../../common/common';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import SuperTab from  '../../components/SuperTab';
import s from './TabPage.less';

/**
 * 功能：创建一个包含TAB标签的页面组件
 * 参数：
 *  getComponent：原型func(activeKey)，该函数应该依据activeKey返回一个组件(表达当前选卡的内容)
 * 返回值：React组件
 */
const createTabPage = (getComponent) => {
  class TabPage extends React.Component {
    static propTypes = {
      activeKey: PropTypes.string.isRequired,
      tabs: PropTypes.array.isRequired,
      onTabChange: PropTypes.func,
      onTabClose: PropTypes.func
    };

    tabContent = (activeKey) => {
      const Component = getComponent(activeKey);
      return Component && <Component close={this.props.onTabClose.bind(null, activeKey)} />;
    };

    render() {
      return (
        <div className={s.root}>
          <SuperTab {...getObject(this.props, SuperTab.PROPS)} />
          {this.tabContent(this.props.activeKey)}
        </div>
      );
    }
  }
  return withStyles(s)(TabPage);
};

const createCommonTabPage = (OrderPageContainer, EditPageContainer) => {
  const getComponent = (activeKey) => {
    if (activeKey === 'index') {
      return OrderPageContainer
    } else {
      return EditPageContainer;
    }
  };
  return createTabPage(getComponent);
};

export default createTabPage;
export {createCommonTabPage};
