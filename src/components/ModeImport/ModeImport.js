import React, { PropTypes } from 'react';
import {Form, Button, Input, Select, Upload, Icon } from 'antd';
import {fetchJson, showError} from '../../common/common';
import ModalWithDrag from '../ModalWithDrag';

const Option = Select.Option;
const FormItem = Form.Item;

class ModeImport extends React.Component {
  static propTypes = {
    config: PropTypes.object,
    onCancel: PropTypes.func,
    onOk: PropTypes.func,
    modeCode: PropTypes.string.isRequired,
    options: PropTypes.array,
    isDetail: PropTypes.bool,
    indexId: PropTypes.string,
    indexKey: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.initState(props);
    this.handelDownLoad = this.handelDownLoad.bind(this);
    this.handelImport = this.handelImport.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.initState(nextProps);
  }

  initState = (props) => {
    this.state = {
      msg: '',
      fileList: [],
      uploading: false,
      modeValue: undefined,
      modeNameStatus: undefined,
      isOk: false,
      percent: 0
    };
  };

  handleChange = (modeValue) => {
    this.setState({...this.state, modeValue, modeNameStatus: undefined});
  };

  async handelDownLoad() {
    if (!this.state.modeValue) {
      this.setState({...this.state, modeNameStatus: 'error'});
      return;
    }
    const url = '/api/config/modeinput/down';
    const {result, returnCode} = await fetchJson(`${url}?id=${this.state.modeValue}`);
    if(returnCode !== 0) {
      showError('获取下载地址失败');
      return;
    }
    window.open(`/api/proxy/file-center-service/${result}`);
  };

  onHandleRemove = (file) => {
    this.setState({...this.state, fileList:[], msg: ''});
  };

  // 附件上传前的操作
  beforeUpload = (file) => {
    this.setState({...this.state, fileList: [file]});
    return false;
  };

  async handelImport() {
    const { fileList, modeValue } = this.state;
    if (!modeValue) {
      this.setState({...this.state, modeNameStatus: 'error'});
      return;
    }
    this.setState({...this.state, uploading: true});
    const formData = new FormData();
    formData.append('file', fileList[0]);
    formData.append('id', modeValue);
    if (this.props.isDetail) {
      formData.append('indexId', this.props.indexId);
      formData.append('indexKey', this.props.indexKey);
    }
    const xhr = new XMLHttpRequest();
    //请求完成
    xhr.onload = (event) => {
      const ret = xhr.responseText; // 服务器返回
      const res = JSON.parse(ret);
      this.setState({...this.state, uploading: false, msg: res.returnMsg, isOk: res.returnCode===0});
    };
    //请求失败
    xhr.onerror = (event) => {
      this.setState({...this.state, uploading: false, msg: '请求失败'});
    };
    //进度条部分
    xhr.upload.onprogress = (evt) => {
      if (evt.lengthComputable) {
        const percentComplete = Math.round(evt.loaded * 100 / evt.total);
        this.setState({...this.state, percent: percentComplete});
      }
    };
    const url = this.props.isDetail ? `/api/proxy/integration_service/excelModel/importExcelContentWithIndex` : `/api/proxy/integration_service/excelModel/importExcelContent`;
    xhr.open('post', url, true);  // true表示异步
    xhr.send(formData);
  };

  onCancel = () => {
    this.state.isOk ? this.props.onOk() : this.props.onCancel();
  };

  toOption = ({value, title}, index) => {
    return <Option key={index} value={value}>{title}</Option>;
  };

  toStartImport = () => {
    const props = {
      size: 'small',
      type: 'primary',
      style: { marginTop: 5, marginBottom: 10},
      onClick: this.handelImport,
      disabled: this.state.fileList.length === 0,
      loading: this.state.uploading
    };
    return <Button {...props}> {this.props.config.startImport} </Button>
  };

  toUpload = () => {
    const props = {
      action: `/api/proxy/integration_service/excelModelConfig/uploadExcelModel`,
      onRemove: this.onHandleRemove,
      fileList: this.state.fileList,
      beforeUpload: this.beforeUpload
    };
    const progress = `${this.props.config.progress}${this.state.percent}%`;
    return (
      <div style={{ marginTop: 10 }}>
        <Upload {...props}>
          <Button size="small"> <Icon size="small" type="upload" /> {this.props.config.selectFile} </Button>
        </Upload>
        {this.toStartImport()}
        <span>{progress}</span>
        <p>{this.props.config.result}</p>
        <Input type="textarea" readOnly autosize={{ minRows: 2, maxRows: 6 }} style={{backgroundColor: '#f0f0f0'}} value={this.state.msg} />
      </div>
    );
  };

  isMatch = (inputValue, option) => {
    return option.props.children.indexOf(inputValue) !== -1;
  };

  toBody = () => {
    const itemProps = {
      label: this.props.config.modeName,
      required: true,
      validateStatus: this.state.modeNameStatus,
      labelCol: {span: 3, offset: 0}
    };
    const selectProps = {
      showSearch: true,
      filterOption: this.isMatch,
      size: 'small',
      style: {width: 200, margin: 5},
      value: this.state.modeValue,
      onChange: this.handleChange
    };
    return (
      <div>
        <FormItem {...itemProps}>
          <Select {...selectProps}>
            {this.props.options.map(this.toOption)}
          </Select>
          <a style={{ marginLeft: 5}} onClick={this.handelDownLoad} >{this.props.config.downLabel}</a>
        </FormItem>
        {this.toUpload()}
      </div>
    );
  };

  getProps = () => {
    const {config} = this.props;
    return {
      title: config.title,
      onCancel: this.onCancel,
      visible: true,
      width: 600,
      maskClosable: false,
      footer: null
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

export default ModeImport;
