import React, {PropTypes} from 'react';
import {Card, Title, Indent, SuperForm, SuperToolbar,SuperTable,SuperTable2} from '../../../components';
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './EditPage.less';
import { getObject } from '../../../common/common';

const TABLE_EVENTS = ['onLink','onCheck'];

class EditPage extends React.Component {
  static propTypes = {
    buttons: PropTypes.array,
    controls: PropTypes.array,
    cols: PropTypes.array,
    value: PropTypes.object,
    valid: PropTypes.bool,
    look: PropTypes.bool,
    tabKey: PropTypes.string,
    options: PropTypes.object,
    onChange: PropTypes.func,
    onSearch: PropTypes.func,
    onExitValid: PropTypes.func,
    onClick: PropTypes.func,
    activeKey:PropTypes.string
  };

  formProps = ( props ,readonly =false) => {
    return {
      readonly: (props.look || readonly),
      container: true,
      controls: props.controls,
      value: props.value,
      valid: props.valid ,
      options: props.options,
      onChange: props.onChange,
      onSearch: props.onSearch,
      onExitValid: props.onExitValid,
    };
  };

  tableProps = (props) => {
    return  {
      cols: props.cols,
      items: props.tableItems ? props.tableItems: [],
      callback: getObject(props, TABLE_EVENTS),
      maxHeight: `calc(100vh - 223px)`
    };
  };

  toolbarProps = (props) => {
    return {
      size: 'default',
      buttons: props.buttons,
      onClick: props.onClick.bind(null, props)
    };
  };


  toolbarProps1 = (props) => {
    return {
      size: 'small',
      buttons: props.colsButtons,
      onClick: props.onClick.bind(null, props)
    };
  };

  /*
  * tabKey !== 'add'情况下是显示编辑页面
  * look为true 代表只读
  * */

  render() {
    const props = this.props;
    return (
      <Indent className={s.root}>
        <Title title="基本信息"/>
        <Indent>
          <SuperForm {...this.formProps( props,props.look)} />
        </Indent>
        <div className={s.title}>
          {props.tabKey === 'add'||props.look ? null :<Title title='结算单列表'/>}
        </div>
        <div className={s.btn}>
          {props.tabKey === 'add' || props.look ? null :<SuperToolbar {...this.toolbarProps1(props)} />}
        </div>
        {props.tabKey === 'add' ? null : <SuperTable {...this.tableProps(props)}/>}
        <div style={{ textAlign: 'center' }} className= {s.botButton}>
          {props.look ? null :<SuperToolbar {...this.toolbarProps(props)} />}
        </div>
      </Indent>
    );
  }
}

export default withStyles(s)(EditPage);
