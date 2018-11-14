import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Mode.less';
import {ModalWithDrag, SuperTable} from '../../components';
import showPopup from '../../standard-business/showPopup';
import execWithLoading from '../../standard-business/execWithLoading';
import helper from '../../common/common';
import {Input} from 'antd';
const InputSearch = Input.Search;

const TABLE_COLS = [
  {key: 'modeName', title: '模板', link: true},
  {key: 'download', title: '下载', link: '下载'},
];

class Mode extends React.Component {
  state = {visible: true, value: ''};

  download = (id) => {
    execWithLoading(async () => {
      const json = await helper.fetchJson(`/api/common/download/${id}`);
      if (json.returnCode === 0) {
        helper.download(`/api/proxy/file-center-service/${json.result[id]}`, 'mode');
      } else {
        helper.showError(json.returnMsg);
      }
    });
  };

  getTableProps = () => {
    return {
      cols: TABLE_COLS,
      items: this.props.items.filter(item => item.modeName.includes(this.state.value)),
      checkbox: false,
      maxHeight: '400px',
      callback: {
        onLink: (key, rowIndex, item) => this.download(item.template[0].fileUrl)
      }
    };
  };

  getSearchProps = () => {
    return {
      value: this.state.value,
      placeholder: '模板名',
      onChange: (e) => this.setState({value: e.target.value}),
    }
  };

  getModalProps = () => {
    return {
      className: s.root,
      visible: this.state.visible,
      title: '下载导入模板',
      width: 400,
      footer: null,
      onCancel: () => this.setState({visible: false}),
      afterClose: this.props.onClose
    };
  };

  render() {
    return (
      <ModalWithDrag {...this.getModalProps()}>
        <InputSearch {...this.getSearchProps()} />
        <SuperTable {...this.getTableProps()} />
      </ModalWithDrag>
    );
  }
}

const showMode = () => {
  execWithLoading(async () => {
    const url = '/api/login/mode';
    const json = await helper.fetchJson(url);
    if (json.returnCode === 0) {
      showPopup(withStyles(s)(Mode), {items: json.result});
    } else {
      helper.showError(json.returnMsg);
    }
  });
};

export default showMode;
