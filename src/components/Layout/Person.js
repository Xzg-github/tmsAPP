import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Person.less';
import {ModalWithDrag} from '../../components';
import showPopup from '../../standard-business/showPopup';
import execWithLoading from '../../standard-business/execWithLoading';
import helper from '../../common/common';

const LABELS = [
  {key: 'account', title: '用户账号'},
  {key: 'userEmail', title: '邮箱'},
  {key: 'userCellphone', title: '联系电话'},
  {key: 'username', title: '中文名称'},
  {key: 'userEnglishName', title: '英文名称'},
  {key: 'userPosition', title: '岗位'},
  {key: 'institutionGuid', title: '归属机构'},
  {key: 'departmentGuid', title: '归属部门'},
  {key: 'tenantGuid', title: '所属租户'},
  {key: 'tenantId', title: '租户标识'},
];

class Person extends React.Component {
  state = {visible: true};

  getModalProps = () => {
    return {
      className: s.root,
      visible: this.state.visible,
      title: '个人信息',
      width: 350,
      footer: null,
      onCancel: () => this.setState({visible: false}),
      afterClose: this.props.onClose
    };
  };

  render() {
    const data = this.props.data;
    return (
      <ModalWithDrag {...this.getModalProps()}>
        <div>{LABELS.map((item, index) => <div key={index}>{`${item.title}:`}</div>)}</div>
        <div>{LABELS.map((item, index) => <div key={index} data-no={!data[item.key]}>{data[item.key] || '无'}</div>)}</div>
      </ModalWithDrag>
    );
  }
}

const showPerson = () => {
  execWithLoading(async () => {
    const url = '/api/login/person';
    const json = await helper.fetchJson(url);
    if (json.returnCode === 0) {
      showPopup(withStyles(s)(Person), {data: json.result});
    } else {
      helper.showError(json.returnMsg);
    }
  });
};

export default showPerson;
