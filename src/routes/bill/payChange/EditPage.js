import React, {PropTypes}from 'react';
import withStyle from 'isomorphic-style-loader/lib/withStyles';
import s from './receiveChange.less';
import {Indent, Title, SuperForm, SuperTable2, SuperToolbar, SuperTable} from '../../../components';

class EditPage extends React.Component{
  static propTypes = {
    controls: PropTypes.array,
    value: PropTypes.object,
    tables: PropTypes.array
  };

  toForm() {
    const {controls=[], value={}, valid, onChange, onFormSearch, onExitValid} = this.props;
    return (
      <div>
        {controls.map((item, index) => {
          const changeEvent = onChange.bind(null, item.key);
          const searchEvent = onFormSearch.bind(null, item.key);
          const exitValidEvent = onExitValid.bind(null, item.key);
          const props = {
            value: {...value},
            valid: valid === item.key,
            controls: item.data,
            onChange: changeEvent, onSearch: searchEvent, onExitValid: exitValidEvent
          };
          return (
            <div key={index}>
              <Title title = {item.title}/>
              <Indent className={s.form}>
                <SuperForm {...props}/>
              </Indent>
            </div>
          )
        })}
      </div>
    )
  }

  toSuperTable  (){
    const {tables, value={}} = this.props;
    return(
      <div>
        {
          tables.map(item => {
            const newCols = item.cols.filter(col => (col.type !== 'checkbox')&&(col.type !== 'index'));
            const superTableProps = {
              cols: newCols,
              items: value[item.key],
              checkbox: false
            };
            return (
              <div key={item.key}>
                <Title title={item.title} />
                <Indent className={s.tableInfo}>
                  <SuperTable {...superTableProps} />
                </Indent>
              </div>
            );
          })
        }
      </div>
    )
  }

  toSuperTable2() {
    const {tables, value={}, valid, onClick, onContentChange, onExitValid, onSearch, isReadOnly} = this.props;
    return(
      <div>
        {
          tables.map((item, index) => {
          const clickEvent = onClick.bind(null, item.key);
          const contentChange = onContentChange.bind(null, item.key);
          const searchEvent = onSearch.bind(null, item.key);
          const btnProps = {buttons: item.btns, size: 'small', onClick: clickEvent};
          const tableProps = {
            cols: item.cols,
            items: value[item.key] || [],
            valid: valid === item.key,
            callback: {onCheck: contentChange, onSearch: searchEvent, onContentChange: contentChange, onExitValid}
          };
          return (
            <div key={index}>
              <Title title={item.title} />
              <Indent className={s.tableInfo}>
                {!isReadOnly && <SuperToolbar {...btnProps} />}
                <SuperTable2 {...tableProps}/>
              </Indent>
            </div>
          )
        })}
      </div>
    )
  }

  toFooter() {
    const {footerButtons, onClick, AuditFooter, isAudit} = this.props;
    const footerProps = {
      buttons: isAudit ? AuditFooter :footerButtons,
      size: 'default',
      onClick: onClick.bind(null, undefined)
    };
    return (
      <div className={s.footer}>
        <SuperToolbar {...footerProps}/>
      </div>
    )
  }

  render(){
    const {isReadOnly, isAudit} = this.props;
    return (
      <div className={s.root}>
        {this.toForm()}
        {isReadOnly ? this.toSuperTable() : this.toSuperTable2()}
        {(!isReadOnly || isAudit) && this.toFooter()}
      </div>
    )
  }
}

export default withStyle(s)(EditPage);
