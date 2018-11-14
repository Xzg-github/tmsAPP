import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './SuperTree.less';
import {Tree} from 'antd';
const TreeNode = Tree.TreeNode;

const TreeType = {
  root: PropTypes.string
  // 如下均为key-value对，value取值为{key: <string>, title: <string>, parent: <string>, children: <string array>}
};

/**
 * 参数说明：
 *  tree：对象，用于存储一颗树的数据，其root属性表示根节点的key
 *  select：表示选中条目的key
 *  expand：对象，key-value对，key表示条目的key，value为true表示展开，为false表示折叠
 *  onExpand：展开/折叠时触发，原型为function(key, expand)，expand为true表示展开
 *  onSelect：条目选中时触发，原型为function(key)，key标识所选条目
 */
class SuperTree extends React.Component {
  static propTypes = {
    tree: PropTypes.shape(TreeType).isRequired,
    select: PropTypes.string,
    expand: PropTypes.object,
    checked: PropTypes.object,
    onExpand: PropTypes.func,
    onSelect: PropTypes.func,
    onCheck: PropTypes.func,
  };

  onSelect = (keys) => {
    const {onSelect} = this.props;
    if (onSelect && keys.length !== 0) {
      onSelect(keys[0]);
    }
  };

  onExpand = (expandedKeys, {expanded, node}) => {
    const {onExpand} = this.props;
    if (onExpand) {
      onExpand(node.props.eventKey, expanded);
    }
  };

  onCheck = (checkedKeys, {checked, node}) => {
    const {onCheck} = this.props;
    if (onCheck) {
      onCheck(node.props.eventKey, checked);
    }
  };

  toNodes = (tree, keys) => {
    return keys.map(key => {
      const {title, children} = tree[key];
      return (
        <TreeNode key={key} title={title}>
          {children ? this.toNodes(tree, children) : null}
        </TreeNode>
      );
    });
  };

  toTree = () => {
    const {tree} = this.props;
    if (tree.root) {
      return this.toNodes(tree, tree[tree.root].children);
    } else {
      return null;
    }
  };

  render() {
    const {select, expand={}, checked={}} = this.props;
    const props = {
      checkable: true,
      selectedKeys: [select],
      expandedKeys: Object.keys(expand).filter(key => expand[key]),
      checkedKeys: Object.keys(checked).filter(key => checked[key]),
      autoExpandParent: false,
      onSelect: this.onSelect,
      onExpand: this.onExpand,
      onCheck: this.onCheck,
    };
    return <div className={s.root}><Tree {...props}>{this.toTree()}</Tree></div>;
  }
}

export default withStyles(s)(SuperTree);
