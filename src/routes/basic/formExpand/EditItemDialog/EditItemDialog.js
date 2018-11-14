import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {Search, SuperTable, SuperForm, ModalWithDrag} from '../../../../components';
import s from './EditItemDialog.less';
import helper from '../../../../common/common';
import showPopup from '../../../../standard-business/showPopup';

class EditItemDialog extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    ok: PropTypes.string,
    cancel: PropTypes.string,
    hideConfig: PropTypes.object,
    controls: PropTypes.array,
    cols: PropTypes.array,
    items: PropTypes.array,
    value: PropTypes.object,
    isEdit: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.initState(props);
  }

  componentWillReceiveProps(nextProps) {
    this.initState(nextProps);
  }

  initState = (props) => {
    this.state = {
      value: props.value,
      valid: false,
      items: props.items,
      searchData:{},
      visible: true
    };
  };

  onCheck = (isAll, checked, rowIndex) => {
    let [...items] = this.state.items;
    isAll && (rowIndex = -1);
    if (rowIndex === -1) {
      items = items.map(item => ({...item, checked}));
    }else {
     items[rowIndex] = {...items[rowIndex], checked};
    }
    this.setState({...this.state, items});
  };

  onChange = (key, value) => {
    let newObj = {[key]: value};
    if(key === 'type') {
      this.props.hideConfig.allHideKeys.map(hideKey => {
        newObj[hideKey] = undefined;
      });
    }else if (key === 'span') {
      newObj[key] = Number(value);
    }
    this.setState({...this.state, value:{...this.state.value, ...newObj}});
  };

  onExitValid = () => {
    this.setState({...this.state, valid: false});
  };

  toTable = () => {
    const props = {
      cols: this.props.cols,
      items: this.state.items,
      maxHeight: '400px',
      callback: {onCheck: this.onCheck}
    };
    return <SuperTable {...props} />;
  };

  onClick = (key) => {
    const {searchData} = this.state;
    switch (key) {
      case 'search':{
        const items = this.props.items.filter(item => {
          let result = true;
          for (let sKey of Object.keys(searchData)) {
            if (searchData[sKey] && searchData[sKey] !== item[sKey]) {
              if (sKey === 'itemKey' || sKey === 'title') {
                if (item[sKey].indexOf(searchData[sKey]) === -1) {
                  result = false;
                  break;
                }
              }else {
                result = false;
                break;
              }
            }
          }
          return result;
        });
        this.setState({...this.state, items});
        break;
      }
      case 'reset':{
        this.setState({...this.state, searchData:{}, items:this.props.items});
        break;
      }
    }
  };

  onSearchDataChange = (key, value) => {
    this.setState({...this.state, searchData:{...this.state.searchData, [key]: value}});
  };

  toSearch = () => {
    const {searchConfig} = this.props;
    if (!searchConfig) return null;
    const props = {
      ...searchConfig,
      data: this.state.searchData,
      onClick: this.onClick,
      onChange: this.onSearchDataChange,
    };
    return <Search {...props} />;
  };

  toMode1 = () => {
    return (
      <div>
        {this.toSearch()}
        {this.toTable()}
      </div>
    )
  };

  toMode2 = () => {
    const {controls, hideConfig} = this.props;
    const {value, valid} = this.state;
    let hideControls = value.type ? hideConfig[value.type] : hideConfig.allHideKeys;
    const props = {
      controls,
      value,
      valid,
      hideControls,
      onChange: this.onChange,
      onExitValid: this.onExitValid
    };
    return <SuperForm {...props} />;
  };

  dealValue = (fields=[], valueList=[]) => {
    return valueList.map(valueObj => {
      let {...newObj} = valueObj;
      fields.map(item => {
        if (!newObj[item.key]) {
          delete newObj[item.key];
        }else if (item.bool) {
          newObj[item.key] = newObj[item.key] === 'true';
        }
      });
      return newObj;
    });
  };

  onOk = () => {
    const {controls, isEdit} = this.props;
    const {value, items} = this.state;
    let result = [];
    if (!isEdit) {
      const checkedItems = items.filter(item => item.checked === true);
      if (checkedItems.length < 1) {
        helper.showError('请先勾选记录');
        return;
      }
      result = checkedItems.map(({...item}) => {delete item.checked; delete item.group; return item});
    }else {
      if (!helper.validValue(controls, value)) {
        this.setState({...this.state, valid: true});
        return;
      }
      let {...newValue} = value;
      result.push(newValue);
      result = this.dealValue(controls, result);
    }
    this.setState({...this.state, visible: false, res: {isOk: true, items: result}});
  };

  getProps = () => {
    const {title, ok, cancel, afterClose} = this.props;
    return {
      onOk: this.onOk,
      onCancel: () => {this.setState({...this.state, visible: false, res: {isOk: false}})},
      afterClose: () => {afterClose(this.state.res)},
      width: 900,
      title,
      visible: this.state.visible,
      maskClosable: false,
      okText: ok,
      cancelText: cancel,
      className: s.root
    };
  };

  render() {
    return (
      <ModalWithDrag {...this.getProps()}>
        {this.props.isEdit ? this.toMode2() : this.toMode1()}
      </ModalWithDrag>
    );
  }
}

export default (config, item, fileds, isEdit) => {
  let value = {};
  if (isEdit) {
    Object.keys(item).map(key => {
      if (key === 'checked') {
      }else if (typeof item[key] === 'boolean') {
        value[key] = item[key] ? 'true' : 'false';
      }else {
        value[key] = item[key];
      }
    });
  }
  const props = {
    ...config,
    title: isEdit ? config.editTitle : config.addTitle,
    value,
    items: fileds.map(({...control}) => {
      control = {...control, ...control.props, itemKey: control.key};
      delete control.key;
      delete control.props;
      return control;
    }),
    isEdit
  };
  return showPopup(withStyles(s)(EditItemDialog), props, true);
};
