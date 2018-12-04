import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import withStyles from '../../../../../node_modules/isomorphic-style-loader/lib/withStyles';
import s from './OrderTabPage.less';
import {Search, SuperTable, SuperPagination, SuperToolbar, Card, SuperTab2} from '../../../../components/index';

const props = {
  subTabs: PropTypes.array,
  subActiveKey: PropTypes.string,
  tableCols: PropTypes.array,
  tableItems: PropTypes.object,
  buttons: PropTypes.object,
  filters: PropTypes.array,
  searchData: PropTypes.object,
  searchConfig: PropTypes.object,
  maxRecords: PropTypes.object,
  currentPage: PropTypes.object,
  pageSize: PropTypes.object,
  pageSizeType: PropTypes.array,
  description: PropTypes.string,
  paginationConfig: PropTypes.object  // 该属性将被description替代
};

class OrderTabPage extends React.Component {
  static propTypes = props;
  static PROPS = Object.keys(props);

  constructor(props) {
    super(props);
    this.state = {height: 36};
  }

  onHeightChange = (height) => {
    this.setState({height});
  };

  getContainer = () => {
    return document.body;
  };

  onHandleClick = (key) => {
    const {subActiveKey, onClick, onClickReset, onClickSearch, onConfig} = this.props;
    switch (key) {
      case 'reset': {
        onClickReset();
        break;
      }
      case 'search': {
        onClickSearch();
        break;
      }
      case 'config': {
        onConfig();
        break;
      }
      default:
        onClick && onClick(subActiveKey, key);
    }
  };

  toSearch = () => {
    const {filters, searchConfig, searchData, onChange, onSearch} = this.props;
    const props = {
      filters,
      data: searchData,
      config: searchConfig,
      getContainer: this.getContainer,
      onHeightChange: this.onHeightChange,
      onChange,
      onSearch,
      onClick: this.onHandleClick
    };
    return <Search {...props}/>;
  };

  toToolbar = () => {
    const {subActiveKey, buttons} = this.props;
    const props = {
      buttons: buttons[subActiveKey].concat({key: 'config', title: '配置字段'}),
      size: 'small',
      onClick: this.onHandleClick
    };
    return <SuperToolbar {...props} />;
  };

  toTable = () => {
    const {subActiveKey, tableCols, tableItems, buttons, sortInfo, filterInfo, onCheck, onDoubleClick, onLink, onTableChange} = this.props;
    const extra = buttons.length ? 0 : -32;
    const props = {
      sortInfo: sortInfo[subActiveKey],
      filterInfo: filterInfo[subActiveKey],
      cols: tableCols,
      items: tableItems[subActiveKey] || [],
      callback: {
        onCheck: onCheck.bind(null, subActiveKey),
        onDoubleClick: onDoubleClick ? onDoubleClick.bind(null, subActiveKey) : undefined,
        onLink: onLink ? onLink.bind(null, subActiveKey) : undefined,
        onTableChange: onTableChange.bind(null, subActiveKey)
      },
      maxHeight: `calc(100vh - ${this.state.height + 225 + extra}px)`
    };
    return <SuperTable {...props}/>;
  };

  toPagination = () => {
    const {subActiveKey, maxRecords, pageSize, currentPage, pageSizeType, onPageNumberChange, onPageSizeChange} = this.props;
    let props = {
      maxRecords: maxRecords[subActiveKey],
      pageSize: pageSize[subActiveKey],
      currentPage: currentPage[subActiveKey],
      pageSizeType,
      onPageNumberChange,
      onPageSizeChange
    };
    if (!props.description && this.props.paginationConfig) {
      props.description = this.props.paginationConfig.pageDesp;
    }
    return <SuperPagination {...props}/>;
  };

  toTab = () => {
    const {subTabs, subActiveKey, onSubTabChange} = this.props;
    const props = {
      activeKey: subActiveKey,
      tabs: subTabs,
      onTabChange: onSubTabChange
    };
    return <SuperTab2 {...props} />;
  };

  render = () => {
    return (
      <div className={s.root}>
        <Card >
          {this.toSearch()}
        </Card>
        <Card>
          {this.toTab()}
          {this.toToolbar()}
          {this.toTable()}
          {this.toPagination()}
        </Card>
      </div>
    );
  };
}

export default withStyles(s)(OrderTabPage);
