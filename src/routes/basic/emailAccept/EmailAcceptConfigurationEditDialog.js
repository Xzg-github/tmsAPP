import React, { PropTypes } from 'react';
import {SuperForm, SuperTable2, SuperToolbar, ModalWithDrag} from '../../../components';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EmailAcceptConfigurationEditDialog.less';
import {getObject} from '../../../common/common';
import ReactDOM from 'react-dom';

const TOOLBAR_EVENTS = ['onClick'];

class EmailAcceptConfigurationEditDialog extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    container: PropTypes.object,
    config: PropTypes.object,
    controls: PropTypes.array,
    value: PropTypes.object,
    toolbars: PropTypes.array,
    tableCols: PropTypes.array,
    tableItems: PropTypes.array,
    valid: PropTypes.bool,
    onCancel: PropTypes.func,
    onOk: PropTypes.func,
    onChange: PropTypes.func,
    onSearch: PropTypes.func,
    onExitValid: PropTypes.func,
    onContentChange: PropTypes.func,
  };

  toForm = () => {
    const {controls, value, onChange, onSearch, onExitValid, valid, editControls, editControls1, edit} = this.props;
    let props = {};
    if(edit){
      if(value && value.active === "active_unactivated"){
        props = {
          controls: editControls1,
          value,
          size: 'small',
          onChange,
          onSearch,
          onExitValid,
          valid
        };
      }else{
        props = {
          controls: editControls,
          value,
          size: 'small',
          onChange,
          onSearch,
          onExitValid,
          valid
        };
      }
    }else {
      props = {
        controls: controls,
        value,
        size: 'small',
        onChange,
        onSearch,
        onExitValid,
        valid
      };
    }
    return <SuperForm {...props} bsSize='small' colNum={3}/>;
  };

  toTable = () => {
    const {tableCols, tableItems, onContentChange, onContentSearch, onExitValid, form} = this.props;
    const valid = !form && this.props.valid;
    const props = {
      cols: tableCols,
      items: tableItems,
      valid,
      callback: {
        onCheck: onContentChange,
        onContentChange,
        onSearch: onContentSearch,
        onExitValid
      }
    };
    return <div role="container"><SuperTable2 {...props} /></div>;
  };

  toToolbar = () => {
    const props = {
      buttons: this.props.toolbars,
      option: {bsSize: 'small'},
      callback: getObject(this.props, TOOLBAR_EVENTS)
    };
    return <div role="toolbar"><SuperToolbar {...props} /></div>;
  };

  getProps = (title, config, onOk, onCancel) => {
    return {
      title, onOk, onCancel,
      visible: true,
      maskClosable: false,
      okText: config.ok,
      cancelText: config.cancel,
      getContainer: () => ReactDOM.findDOMNode(this).firstChild
    };
  };

  render() {
    const { tableCols, tableItems, onContentChange, title, config, onOk, onCancel, edit} = this.props;
    return (
      <div className={s.root}>
        <div />
        <ModalWithDrag {...this.getProps(title, config, onOk, onCancel)} width="900px">
          {this.toForm()}
          {!edit && this.toToolbar()}
          {!edit && this.toTable(tableCols, tableItems, onContentChange)}
        </ModalWithDrag>
      </div>
    );
  }
}

export default withStyles(s)(EmailAcceptConfigurationEditDialog);







