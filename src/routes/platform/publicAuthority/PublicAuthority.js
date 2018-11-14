import React, { PropTypes } from 'react';
import withStyles from '../../../../node_modules/isomorphic-style-loader/lib/withStyles';
import { getObject } from '../../../common/common';
import s from './PublicAuthority.less';
import {SuperTable, SuperForm, SuperToolbar, SuperTree, Card, SuperTab} from '../../../components';
import {Input} from 'antd';
const InputSearch = Input.Search;

const TREE_PROPS = ['tree', 'expand', 'select', 'searchValue', 'onExpand', 'onSelect'];

class PublicAuthority extends React.Component {
  static propTypes = {
    formCols: PropTypes.array,
    formData: PropTypes.object,
    toolbar: PropTypes.array,
    itemCols: PropTypes.array,
    tableItems: PropTypes.array,
    select: PropTypes.string,
    onSave: PropTypes.func,
    onUpdate: PropTypes.func,
    onRemove: PropTypes.func,
    formDataChange: PropTypes.func,
    onPageNumberChange: PropTypes.func,
    onPageSizeChange: PropTypes.func,
    onExpand: PropTypes.func,
    onSelect: PropTypes.func,
    onLink: PropTypes.func,
  };

  fromDataChange = (key, value) => {    // formData数据更新
    this.props.formDataChange(key, value);
  };

  onClick = (key) => {       // Toolbar点击事件
    switch (key) {
      case 'save':
        this.props.onSave();
        break;
      case 'update':
        this.props.onUpdate();
        break;
      case 'remove':
        this.props.onRemove();
        break;
      default:
        break;
    }
  };

  renderSuperTree() {
    const defaultTree = {
      root: 'top',
      top: {key: 'top', children: ['publicAuthority']},
      publicAuthority: {key: 'publicAuthority', title: '公共权限字典', children: []},
    };
    const props = {
      tree: this.props.treeData || defaultTree,
      select: this.props.select,
      onSelect: this.props.onSelect,
      onExpand: this.props.onExpand,
      expand: this.props.expand,
    };
    return (<SuperTree {...props}/>)
  }

  renderSuperForm() {
    const props = {
      valid: this.props.valid,
      controls: this.props.formCols,
      colNum: 3,
      value: this.props.formData,
      onChange: this.fromDataChange,
      onExitValid: this.props.onExitValid,
      container: true
    };
    return (<SuperForm {...props}/>)
  }


  renderSuperToolbar() {
    const props = {
      buttons: this.props.toolbar,
      callback: {onClick: this.onClick},
    };
    return (<SuperToolbar {...props}/>)
  }

  renderSuperTable() {
    const props = {
      cols: this.props.itemCols,
      items: this.props.tableItems,
      checkbox: false,
      maxHeight: `calc(100vh - 215px)`,
      callback: {
        onLink: this.props.onLink,
      }
    };
    return (<SuperTable {...props}/>)
  }

  getTreeProps = () => {
    const defaultTree = {
      root: 'top',
      top: {key: 'top', children: ['publicAuthority']},
      publicAuthority: {key: 'publicAuthority', title: '公共权限字典', children: []},
    };
    let props = getObject(this.props, TREE_PROPS);
    props.tree = this.props.treeData || defaultTree;
    return props;
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
      onSearch: this.props.onClick.bind(null, 'search')
    }
  };

  getTabProps = () => {
    return {
      activeKey: this.props.activeKey || 'tree',
      tabs: this.props.tabs ? [
        {key: 'tree', title: '目录', close: false},
        {key: 'index', title: '索引', close: false}
      ] : [
        {key: 'tree', title: '目录', close: false}
      ],
      onTabChange: this.props.onTabChange
    };
  };

  getIndexTableProps = () => {
    return {
      cols: this.props.indexTableCols || [],
      items:this.props.indexTableItems || [],
      checkbox: false,
      index: false,
      maxHeight: `calc(100vh - 160px)`,
      callback: {
        onLink: this.props.onLink
      }
    };
  };

  toTabContent = () => {
    const {activeKey = 'tree'} = this.props;
    return activeKey === 'tree' ? (
      <Card noPadding>
        <div><InputSearch {...this.getSearchProps()} /></div>
        <SuperTree {...this.getTreeProps()} />
      </Card>
    ) : (
      <Card noPadding>
        <div><InputSearch {...this.getSearchProps()} /></div>
        <SuperTable {...this.getIndexTableProps()} />
      </Card>
    )
  };

  renderPage = () => {
    return (
      <div className={s.root}>
        <div>
          <SuperTab {...this.getTabProps()} />
          {this.toTabContent()}
        </div>
        <Card>
          {this.renderSuperForm()}
          {this.renderSuperToolbar()}
          {this.renderSuperTable()}
        </Card>
      </div>
    );
  };

  render() {
    return this.renderPage();
  }
}

export default withStyles(s)(PublicAuthority);
