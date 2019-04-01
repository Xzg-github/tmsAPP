import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EditPage.less';
import {SuperTable2, Card, SuperForm, SuperTitle, SuperToolbar} from '../../../../components';

class EditPage extends React.Component {

  toForm = () => {
    const {controls, value, valid=false, onChange, onSearch, onExitValid} = this.props;
    return controls.map((item, i) => {
      const props = {
        controls: item.cols,
        value,
        valid: item.key === valid,
        onChange: onChange.bind(null, item.key),
        onSearch: onSearch.bind(null, item.key),
        onExitValid: onExitValid.bind(null, item.key)
      };
      return (<div key={i} className={s.contenItemBox}>
        <div className={s.superTitle}><SuperTitle title={item.title}/></div>
        <SuperForm {...props}/>
      </div>)
    });
  }

  toTable = () => {
    const {tables, value, valid=false, onExitValid, onCheck, onContentChange, onClick, onTableSearch} = this.props;
    return tables.map((item, i) => {
      const props = {
        maxHeight: '500px',
        cols: item.cols,
        items: value[item.key] || [],
        valid: item.key === valid,
        callback: {
          onCheck: onCheck.bind(null, item.key),
          onExitValid,
          onSearch: onTableSearch.bind(null, item.key),
          onContentChange: onContentChange.bind(null, item.key)
        }
      };
      const titleProps = {
        title: item.title,
        buttons: item.btns,
        onClick: onClick.bind(null, item.key)
      };
      return (<div key={i} className={s.contenItemBox}>
        <div className={s.superTitle}><SuperTitle {...titleProps}/></div>
        <SuperTable2 {...props}/>
      </div>)
    });
  }

  toAmount = () => {
    const {amountInfo, value, isShowAmount} = this.props;
    return isShowAmount ? (<div style={{marginTop: '-10px', marginBottom: '10px'}}>{
      amountInfo.map(it => {
        const className = it.important ? s.important : '';
        const amount = value[it.key] || 0;
        return <span className={className} key={it.key}>{`${it.title}：${amount}   `}</span>;
      })
    }</div>) : null;
  }

  toFallback () {
    const {value, onChange, fallbackInfo, isShowAudit} = this.props;
    const props = {
      allFullFather: true,
      controls: fallbackInfo,
      value,
      onChange
    };
    return isShowAudit ? <SuperForm {...props}/> : null;
  }

  toResultForm () {
    const {value, valid, onChange, resultForm, onExitValid, isShowEndCase} = this.props;
    const props = {
      controls: resultForm.cols,
      valid: valid === resultForm.key,
      value,
      onChange: onChange.bind(null, resultForm.key),
      onExitValid
    };
    return isShowEndCase ? (<div className={s.contenItemBox}>
      <div className={s.superTitle}><SuperTitle title={resultForm.title}/></div>
      <SuperForm {...props}/>
    </div>) : null;
  }

  toFooter = () => {
    const {footerButtons, onClick} = this.props;
    const props = {
      buttons: footerButtons,
      size: 'large',
      onClick: onClick.bind(null, 'footer')
    };
    return <div className={s.footer}><SuperToolbar {...props}/></div>
  }

  render() {
    return (
      <Card className={s.root}>
        {this.toForm()}
        {this.toAmount()}
        {this.toTable()}
        {this.toFallback()}
        {this.toResultForm()}
        {this.toFooter()}
      </Card>
    );
  }
}

export default withStyles(s)(EditPage);
