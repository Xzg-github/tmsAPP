import React from 'react';
import {ModalWithDrag, SuperToolbar, SuperTable, SuperForm, Card} from '../../../../components';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SendInfoDialog.less';

class SendInfoDialog extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      remainingWords: 0
    };
  }

  getProps = () => {
    const {title, onCancel, onOk} = this.props;
    return {
      onCancel,
      onOk,
      title,
      width: 1000,
      visible: true,
      maskClosable: false,
      okText: '发送'
    };
  };

  onChangeOperate = (key,value) => {
    value && this.setState({remainingWords: value.length});
  };

  toContent = () => {
    const {messageContent,onChange,onCheck} = this.props;
    const {remainingWords} = this.state;
    const tableProps = {callback: {onCheck},...this.props,maxHeight:'400px'};
    messageContent.onChange = onChange;
    messageContent.onChangeOperate = this.onChangeOperate;
    let isSystemMessage = this.props.CURRENT_KEY == 0;
    return (
      <div className={s.root}>
        {!isSystemMessage && <Card className={s.pldCard}><SuperToolbar {...this.props} /></Card>}
        {!isSystemMessage && <Card className={s.pldCard}><SuperTable {...tableProps}/></Card>}
        <Card className={s.textArea}>
          <span className={s.wordsTip}>{remainingWords}/1000</span>
          <SuperForm {...this.props.messageContent}/>
        </Card>
      </div>
    );
  };

  render() {
    return (
      <ModalWithDrag {...this.getProps()}>
        {this.toContent()}
      </ModalWithDrag>
    );
  }
}

export default withStyles(s)(SendInfoDialog);
