import React, { PropTypes } from 'react';
import { getObject } from '../../common/common';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './TreePage.less';
import {SuperTable, SuperToolbar, SuperTree, Card, SuperTab} from '../index';
import {Input, Icon} from 'antd';
const InputSearch = Input.Search;

const TREE_PROPS = ['tree', 'expand', 'select', 'searchValue', 'onExpand', 'onSelect'];
const TABLE_EVENTS = ['onCheck', 'onDoubleClick'];

const props = {
  tableCols: PropTypes.array,
  tableItems: PropTypes.array,
  buttons: PropTypes.array,
  tree: PropTypes.object,
  expand: PropTypes.object,
  select: PropTypes.string,
  searchValue: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  inputValue: PropTypes.string,
  placeholder: PropTypes.string,
  onInputChange: PropTypes.func,
  onClick: PropTypes.func,
  onReload: PropTypes.func  //刷新树按钮响应函数
};

class TreePage extends React.Component {
  static propTypes = props;
  static PROPS = Object.keys(props);

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

  getToolbarProps = () => {
    return {
      buttons: this.props.buttons,
      onClick: this.props.onClick,
    };
  };

  getTreeProps = () => {
    return getObject(this.props, TREE_PROPS);
  };

  getTableProps = () => {
    return {
      cols: this.props.tableCols,
      items: this.props.tableItems,
      maxHeight: 'calc(100vh - 114px)',
      callback: getObject(this.props, TABLE_EVENTS)
    };
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
    const {activeKey = 'tree', onReload} = this.props;
    return activeKey === 'tree' ? (
      <Card noPadding>
        <div><InputSearch {...this.getSearchProps()} />
          {onReload && <a onClick={onReload}><Icon type='reload'/></a>}
        </div>
        <SuperTree {...this.getTreeProps()} />
      </Card>
    ) : (
      <Card noPadding>
        <div><InputSearch {...this.getSearchProps()} /></div>
        <SuperTable {...this.getIndexTableProps()} />
      </Card>
    )
  };

  render = () => {
    return (
      <div className={s.root}>
        <div>
          <SuperTab {...this.getTabProps()} />
          {this.toTabContent()}
        </div>
        <Card>
          <SuperToolbar {...this.getToolbarProps()} />
          <SuperTable {...this.getTableProps()} />
        </Card>
      </div>
    );
  };
}

export default withStyles(s)(TreePage);
