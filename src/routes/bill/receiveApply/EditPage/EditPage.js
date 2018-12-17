import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EditPage.less';
import {SuperTable2, Card, SuperForm, SuperTitle, SuperToolbar} from '../../../../components';

class EditPage extends React.Component {

  toForm = () => {
    const {controls, value, valid=false, readonly, onChange, onSearch, onExitValid, onAdd} = this.props;
    return controls.map((item, i) => {
      const props = {
        controls: item.data,
        value,
        valid: item.key === valid,
        readonly,
        onChange: onChange.bind(null, item.key),
        onSearch: onSearch.bind(null, item.key),
        onExitValid: onExitValid.bind(null, item.key),
        // onAdd: onAdd.bind(null, item.key)
      };
      return (<div key={i}>
        <SuperTitle title={item.title} style={{marginTop: '10px'}}/>
        <SuperForm {...props}/>
      </div>)
    });
  }

  toTable = () => {
    const {tables, value, valid=false, readonly, onExitValid, onCheck, onContentChange, onClick} = this.props;
    return tables.map((item, i) => {
      const props = {
        maxHeight: '500px',
        cols: item.cols,
        items: value[item.key] || [],
        valid: item.key === valid,
        callback: {
          onCheck: onCheck.bind(null, item.key),
          onExitValid: onExitValid.bind(null, item.key),
          onContentChange: onContentChange.bind(null, item.key)
        }
      };
      const titleProps = {
        title: item.title,
        buttons: item.btns,
        readonly,
        onClick: onClick.bind(null, item.key)
      };
      return (<div key={i} style={{marginTop: '10px'}}>
        <SuperTitle {...titleProps}/>
        <SuperTable2 {...props}/>
      </div>)
    });
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
        {this.toTable()}
        {this.toFooter()}
      </Card>
    );
  }
}

export default withStyles(s)(EditPage);
