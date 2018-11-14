import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './DataSet.less';
import SuperTree from '../../../../../components/SuperTree'

class DataSet extends React.Component {
  static propTypes = {
    dataSourceTree: PropTypes.object,
    expand: PropTypes.object,
    onExpand: PropTypes.func,
  };


  onExpand = (key, expand) => {    // 折叠事件
    this.props.onExpand('dataSourceExpand', {[key]: expand})
  }

  onSelect = (key) => {           // 选中事件

  };

  renderSuperTree() {
    const tree = this.props.dataSourceTree.root ? this.props.dataSourceTree :
      {root: 'top', top: {key: 'top', children: ['0']}, 0: {key: '0', title: '数据源', children: []}};
    const props = {
      tree: tree,
      expand: this.props.expand,
      onExpand: this.onExpand,
      onSelect: this.onSelect,
    }
    return <SuperTree {...props}/>
  }

  renderPage = () => {
    return (
      <div className={s.root}>
        {this.renderSuperTree()}
      </div>
    );
  }

  render() {
    return this.renderPage();
  }
}

export default withStyles(s)(DataSet);

