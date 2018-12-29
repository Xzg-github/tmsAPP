import React, { PropTypes } from 'react';
import {Button, Input} from 'antd';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Dialog.less';
import {SuperForm, ModalWithDrag} from '../../../../src/components';

class Dialog extends React.Component {
  static propTypes = {
    formControls: PropTypes.array,
    textAreaControls: PropTypes.array,
    changeDialogState: PropTypes.func,
    editData: PropTypes.object,
    dialogState: PropTypes.bool,
    dialogType: PropTypes.string,
    onAdd: PropTypes.func,
    onClearEditData: PropTypes.func,
  };

  state = {
    fromData: this.props.editData,
  };

  onCancel = () => {
    this.props.onClearEditData();
    this.props.changeDialogState(false)
  }

  onOk = () => {
    let postData = this.state.fromData;
    if (this.props.dialogType === 'edit') {
      postData.id = this.props.editData.id
    } else if (this.props.dialogType === 'copyAdd') {
      delete postData.id;
    }
    this.props.onAdd(postData, this.props.dialogType);
    this.onCancel();
  }

  onChange = (key, value) => {
    const obj = this.state.fromData;
    this.setState({
      fromData: {
        ...obj,
        [key]: value
      }
    });
  }

  textareaChange = (e, key) => {
    const value = e.target.value;
    this.setState({ fromData: {...this.state.fromData, [key]: value} });
  }

  renderTextArea() {
    return (
      this.props.textAreaControls.map((textarea, index) =>
        <div className={s.textareaWrap} key={index}>
          <span className={s.textareaTip}>{textarea.title}</span>
          <Input
            key={index}
            type="textarea"
            readOnly={textarea.type === 'readonly'? 'readOnly' : null}
            rows={textarea.rows}
            className={s.textarea}
            value={this.state.fromData[textarea.key]}
            onChange={(e) => this.textareaChange(e, textarea.key)}
          />
        </div>
      )
    );
  }

  renderBody() {
    const props = {
      controls: this.props.formControls,
      value: this.state.fromData,
      colNum: 2,
      onChange: this.onChange,
    }
    return (
      <div>
        <SuperForm {...props}/>
        {this.renderTextArea()}
      </div>
    );
  }

  render() {
    return (
      <ModalWithDrag
        wrapClassName="addDialog"
        visible={this.props.dialogState}
        closable={false}
        title={this.props.dialogType === 'add' ? '新增' : '编辑'}
        footer={
          <div style={{textAlign: 'right'}}>
            <Button size='default' onClick={() => this.onCancel()}>取消</Button>
            <Button size='default' type='primary' onClick={() => this.onOk()}>保存</Button>
          </div>
        }
      >
        {this.renderBody()}
      </ModalWithDrag>
    );
  }
}

export default withStyles(s)(Dialog);
