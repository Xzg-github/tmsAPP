import React, {PropTypes} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Area.less';
import {SuperTab2, SuperTable, SuperTab, Search, Indent} from '../../../components/index';
import DistrictContainer from './DistrictContainer';
import {Tree} from 'antd';
const TreeNode = Tree.TreeNode;

class Area extends React.Component {
  static propTypes = {
    tabs: PropTypes.array,
    activeKey: PropTypes.string,
    tree: PropTypes.object,
    expand: PropTypes.object,
    select: PropTypes.string,
    inputValue: PropTypes.string,
    searchValue: PropTypes.string
  };

  onInputChange = (e) => {
    const {onInputChange} = this.props;
    onInputChange && onInputChange(e.target.value);
  };

  getSearchProps2 = () => {
    const {treeConfig, searchData, onChange, onClick} = this.props;
    return {
      filters: treeConfig.indexFilters,
      data: searchData,
      config: treeConfig.searchConfig,
      onChange,
      onClick
    }
  };

  getIndexTableProps = () => {
    return {
      cols: this.props.treeConfig.indexTableCols || [],
      items:this.props.indexTableItems || [],
      checkbox: false,
      index: false,
      maxHeight: `calc(100vh - 238px)`,
      callback: {
        onLink: this.props.onLink
      }
    };
  };

  getTabProps = () => {
    return {
      activeKey: this.props.indexActiveKey || 'tree',
      tabs:[
        {key: 'tree', title: '目录', close: false},
        {key: 'index', title: '查询', close: false}
      ],
      onTabChange: this.props.onIndexTabChange
    };
  };

  renderTreeNodes = (data = []) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} dataRef={item} />;
    });
  };

  toTree = () => {
    const {select, expand, onExpand, onSelect, onLoadData} = this.props;
    const props = {
      loadData: onLoadData,
      selectedKeys: [select],
      expandedKeys: Object.keys(expand).filter(key => expand[key]),
      autoExpandParent: false,
      onExpand,
      onSelect
    };
    return (
      <div role='tree'>
        <Tree {...props}>
          {this.renderTreeNodes(this.props.treeData)}
        </Tree>
      </div>
    );
  };

  toTabContent = () => {
    const {indexActiveKey = 'tree'} = this.props;
    return indexActiveKey === 'tree' ? this.toTree() : (
      <div role='search'>
        <Search {...this.getSearchProps2()} />
        <SuperTable {...this.getIndexTableProps()} />
      </div>
    )
  };

  left = () => {
    return (
      <Indent>
        <SuperTab {...this.getTabProps()} />
        {this.toTabContent()}
      </Indent>
    );
  };

  toPage = (activeKey) => {
    switch (activeKey) {
      case 'district':
        return <DistrictContainer />;
    }
  };

  right = () => {
    const {activeKey, tabs, onTabChange} = this.props;
    return (
      <Indent>
        <SuperTab2 tabs={tabs} activeKey={activeKey} callback={{onTabChange}} />
        {this.toPage(activeKey)}
      </Indent>
    );
  };

  render() {
    return (
      <div className={s.root}>
        {this.left()}
        {this.right()}
      </div>
    );
  }
}

export default withStyles(s)(Area);
