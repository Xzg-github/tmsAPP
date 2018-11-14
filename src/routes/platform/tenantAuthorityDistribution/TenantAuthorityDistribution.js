import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './TenantAuthorityDistribution.less';
import Search from '../../../components/Search';
import SuperTree from './components/SuperTree';


class TenantAuthorityDistribution extends React.Component {
  static propTypes = {
    filters: PropTypes.array,
    searchConfig: PropTypes.object,
    searchDataChange: PropTypes.func,
    getTenantAuthority: PropTypes.func,
    cleanSearchData: PropTypes.func,
    notDistributionOnExpand: PropTypes.func,
    notDistributionOnChecked: PropTypes.func,
    distributionOnChecked: PropTypes.func,
    distributionOnExpand: PropTypes.func,
    searchData: PropTypes.object,
    notDistributionExpand: PropTypes.object,
    notDistributionChecked: PropTypes.object,
    distributionExpand: PropTypes.object,
    distributionChecked: PropTypes.object,
    authorityMove: PropTypes.func,
  };

  onClick = (key) => {
    switch (key) {
      case 'search':
        this.props.getTenantAuthority();
        break;
      case 'reset':
        this.props.cleanSearchData();
        break;
      default:
        break;
    }
  };

  renderSearch() {
    const props = {
      config: this.props.searchConfig,
      filters: this.props.filters,
      onSearch: this.props.searchDataChange,
      onChange: this.props.onChange,
      data: this.props.searchData,
      onClick: this.onClick,
    };
    return (<Search {...props}/>)
  }


  renderPublicSuperTree() {
    const defaultTree = {
      root: 'top',
      top: {key: 'top', children: ['notDistributionTree']},
      notDistributionTree: {key: 'notDistributionTree', title: '可分配权限', children: []},
    };
    const props = {
      tree: this.props.notDistributionTree.root ? this.props.notDistributionTree : defaultTree,
      expand: this.props.notDistributionExpand,
      onExpand: this.props.notDistributionOnExpand,
      checked: this.props.notDistributionChecked,
      onCheck: this.props.notDistributionOnChecked,
    };
    return (<SuperTree {...props}/>);
  }

  renderTenantSuperTree() {
    const defaultTree = {
      root: 'top',
      top: {key: 'top', children: ['distributionTree']},
      distributionTree: {key: 'distributionTree', title: '已分配权限', children: []},
    };
    const props = {
      tree: this.props.distributionTree.root ? this.props.distributionTree : defaultTree,
      expand: this.props.distributionExpand,
      onExpand: this.props.distributionOnExpand,
      checked: this.props.distributionChecked,
      onCheck: this.props.distributionOnChecked,
    };
    return (<SuperTree {...props}/>)
  }



  renderPage = () => {
    return (
      <div className={s.root}>
        <div className={s.searchWrap}>
          {this.renderSearch()}
        </div>
        <div className={s.workplace}>
          <div className={s.publicAuthority}>
            {this.renderPublicSuperTree()}
          </div>
          <div className={s.buttons}>
            <img
              src={require('../../../../public/arrow.png')}
              onClick={() => {this.props.authorityMove('moveIn')}}
              alt=""
            />
            <img
              src={require('../../../../public/arrow.png')}
              onClick={() => {this.props.authorityMove('moveOut')}}
              alt="" className={s.arrow}
            />
          </div>
          <div className={s.tenantAuthority}>
            {this.renderTenantSuperTree()}
          </div>
        </div>
      </div>
    );
  };

  render() {
    return this.renderPage();
  }
}

export default withStyles(s)(TenantAuthorityDistribution);
