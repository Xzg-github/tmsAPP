import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {ModalWithDrag} from '../../../components';
import SuperTree from './SuperTree';
import s from './DistributionDialog.less';

class DistributionDialog extends React.Component {
  static propTypes = {
    distributionOnChecked: PropTypes.func,
    distributionOnExpand: PropTypes.func,
    distributionExpand: PropTypes.object,
    distributionChecked: PropTypes.object,
  };

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

  getProps = () => {
    const {title, ok, cancel, onOk, onCancel} = this.props;
    return {
      title, onOk, onCancel,
      visible: true,
      maskClosable: false,
      okText: ok,
      cancelText: cancel,
      getContainer: () => ReactDOM.findDOMNode(this).firstChild
    };
  };

  render() {
    const { title, Ok, Cancel} = this.props;
    return (
      <div className={s.root}>
        <div />
        <ModalWithDrag {...this.getProps(title, Ok, Cancel)}>
          {this.renderTenantSuperTree()}
        </ModalWithDrag>
      </div>
    );
  }
}

export default withStyles(s) (DistributionDialog);
