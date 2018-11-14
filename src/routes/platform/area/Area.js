import React, {PropTypes} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Area.less';
import {SuperTab2, SuperTable, SuperTab, SuperTree, Card, Search} from '../../../components/index';
import DistrictContainer from './DistrictContainer';
import SiteContainer from './SiteContainer';
import ContactContainer from './ContactContainer';
import {getObject} from '../../../common/common';
import {Input} from 'antd';
const InputSearch = Input.Search;

class Area extends React.Component {
  static propTypes = {
    tabs: PropTypes.array,
    activeKey: PropTypes.string,
    tree: PropTypes.object,
    expand: PropTypes.object,
    select: PropTypes.string,
    inputValue: PropTypes.string,
    searchValue: PropTypes.string,
    onTreeSearch: PropTypes.func
  };

  onInputChange = (e) => {
    const {onInputChange} = this.props;
    onInputChange && onInputChange(e.target.value);
  };

  getSearchProps = () => {
    return {
      value: this.props.inputValue || '',
      placeholder: this.props.placeholder,
      onChange: this.onInputChange,
      onSearch: this.props.onTreeSearch
    }
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
      maxHeight: `calc(100vh - 160px)`,
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

  toTabContent = () => {
    const {indexActiveKey = 'tree'} = this.props;
    const props = getObject(this.props, ['tree', 'expand', 'select', 'searchValue', 'onExpand', 'onSelect']);
    return indexActiveKey === 'tree' ? (
      <Card noPadding>
        <div><InputSearch {...this.getSearchProps()} /></div>
        <SuperTree {...props} />
      </Card>
    ) : (
      <Card noPadding>
        <Search {...this.getSearchProps2()} />
        <SuperTable {...this.getIndexTableProps()} />
      </Card>
    )
  };

  left = () => {
    return (
      <div>
        <SuperTab {...this.getTabProps()} />
        {this.toTabContent()}
      </div>
    );
  };

  toPage = (activeKey) => {
    switch (activeKey) {
      case 'district':
        return <DistrictContainer />;
      case 'site':
        return <SiteContainer /> ;
      case 'contact':
        return <ContactContainer /> ;
    }
  };

  right = () => {
    const {activeKey, tabs, onTabChange} = this.props;
    return (
      <Card>
        <SuperTab2 tabs={tabs} activeKey={activeKey} callback={{onTabChange}} />
        {this.toPage(activeKey)}
      </Card>
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
