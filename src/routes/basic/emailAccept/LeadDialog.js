import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {Search, SuperTable, ModalWithDrag} from '../../../components';
import helper from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import s from './LeadDialog.less';

const URL_LEAD_LIST ='/api/config/emailAccept/lead_list';
const STATE_PATH = ['temp'];
const action = new Action(STATE_PATH);

class LeadDialog extends React.Component {
  static propTypes = {
    newValue1: PropTypes.object,
    title: PropTypes.string,
    okText: PropTypes.string,
    cancelText: PropTypes.string,
    tableCols: PropTypes.array,
    items: PropTypes.array,
    searchConfig: PropTypes.object,
    searchData: PropTypes.object,
    filters: PropTypes.array,
    onClose: PropTypes.func,
    onOk: PropTypes.func,
    tableItems1: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.initState(props);
    this.onClick = this.onClick.bind(this);
    this.onOk = this.onOk.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.initState(nextProps);
  }

  initState = (props) => {
    this.state = {
      items: this.props.items,
      searchData: {}
    };
  };

  onCheck = (isAll, checked, rowIndex) => {
    isAll && (rowIndex = -1);
    if (rowIndex === -1) {
      this.setState({...this.state, items: this.state.items.map(item => ({...item, checked}))});
    }else {
      let [...items] = this.state.items;
      items[rowIndex] = {...items[rowIndex], checked};
      this.setState({...this.state, items});
    }
  };

  toTable = () => {
    const {tableCols} = this.props;
    const {items} = this.state;
    const props = {
      items,
      cols: tableCols,
      callback: {
        onCheck: this.onCheck
      }
    };
    return <SuperTable {...props} />;
  };

  onChange = (key, value) => {
    this.setState({...this.state, searchData: {...this.state.searchData, [key]: value}});
  };

  async onClick(key) {
    if (key === 'reset') {
      const {items} = this.props;
      this.setState({...this.state, searchData: {}, items});
    }else if (key === 'search') {
      const {searchData} = this.state;
      const url = URL_LEAD_LIST;
      const {returnCode, result, returnMsg} = await helper.fetchJson(url, helper.postOption(searchData));
      if (returnCode !== 0) {
        helper.showError(returnMsg);
        return;
      }
      this.setState({...this.state, items: result});
    }
  };

  toSearch = () => {
    const {filters, searchConfig} = this.props;
    const {searchData} = this.state;
    const props = {
      filters,
      data: searchData,
      config: searchConfig,
      onChange: this.onChange,
      onClick: this.onClick
    };
    return <Search {...props}/>;
  };

  toBody = () => {
    return (
      <div className={s.root}>
        {this.toSearch()}
        <div role="container">{this.toTable()}</div>
      </div>
    );
  };

  toCheckedItems = (items) => {
    let checkedItems = [];
    for(let i = 0; i< items.length; i++){
      if(items[i].checked){
        checkedItems.push(items[i]);
      }
    }
    return checkedItems;
  }

  onOk = () => {
    const {onClose, onOk } = this.props;
    onClose();
    onOk && onOk(this.toCheckedItems(this.state.items));
  };

  getProps = () => {
    const {title, okText, cancelText, onClose} = this.props;
    return {
      title,
      okText,
      cancelText,
      onOk: this.onOk,
      onCancel: onClose,
      width: 700,
      visible: true,
      maskClosable: false,
      okText: this.props.ok,
      cancelText: this.props.cancel
    };
  };


  render() {
    return (
      <ModalWithDrag {...this.getProps()}>
        {this.toBody()}
      </ModalWithDrag>
    );
  }
}

export default withStyles(s)(LeadDialog);
