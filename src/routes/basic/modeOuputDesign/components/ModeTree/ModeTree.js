import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ModeTree.less';
import SuperTree from '../../../../../components/SuperTree'

class ModeTree extends React.Component {
  static propTypes = {
    modeListTree: PropTypes.object,
    onGetDataSet: PropTypes.func,
    expand: PropTypes.object,
    onExpand: PropTypes.func,
  };

  onExpand = (key, expand) => {    // 折叠事件
    this.props.onExpand('modeListExpand', {[key]: expand})
  }

  onSelect = (key) => {           // 选中事件
    this.props.onGetDataSet(this.props.modeListTree[`${key}`])
  }

  renderSuperTree() {
    const props = {
      tree: this.props.modeListTree,
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

export default withStyles(s)(ModeTree);

