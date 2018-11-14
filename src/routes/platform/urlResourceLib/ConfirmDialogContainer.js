import { connect } from 'react-redux';
import ConfirmDialog from '../../../components/ConfirmDialog';
import {fetchJson, showSuccessMsg, showError} from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {search} from '../../../common/search';

const STATE_PATH = ['platform', 'urlResourceLib','confirm'];
const action = new Action(STATE_PATH);
const CLOSE_ACTION = action.assignParent({confirm: undefined});

const URL_DEL = '/api/platform/urlResourceLib/del';
const URL_LIST = '/api/platform/urlResourceLib/list';

const unfold = (foldObj, separator, parentName) => {
  separator = separator || ".";
  parentName = parentName || "";
  let unfoldObj = {};

  if (typeof foldObj === "object") {
    for (let fieldName in foldObj) {
      if (foldObj.hasOwnProperty(fieldName)) {
        if (typeof foldObj[fieldName] === "object") {
          if (foldObj[fieldName] instanceof Array) {     // 数据为数组的处理函数
            let array = {};
            foldObj[fieldName].forEach((obj) => {       // 把数组对象[{key1: value, key2: value},{key1: value, key2: value}]根据key值转成对象数组{key1: []， key2: []}
              Object.keys(obj).forEach((key) => {
                if (Object.keys(array).indexOf(key) === -1) {
                  array[key] = [];                        // 对象数组初始化
                }
                array[key].push(typeof obj[key] === 'object' ? obj[key].title : obj[key]);
              });
            });
            Object.keys(array).forEach((key) => {     //
              const newKey = fieldName + separator + key;
              unfoldObj[newKey] = array[key].join(',');
            });
          } else {   // 数据为对象是的处理函数
            (function () {
              const _parentName = parentName ? (parentName + separator + fieldName) : fieldName;
              const _unfoldObj = unfold(foldObj[fieldName], separator, _parentName);
              for (let _fieldName in _unfoldObj) {
                if (_unfoldObj.hasOwnProperty(_fieldName)) {
                  unfoldObj[_fieldName] = _unfoldObj[_fieldName];
                }
              }
            })();
          }
        } else {
          const prefix = parentName ? (parentName + separator + fieldName) : fieldName;
          unfoldObj[prefix] = foldObj[fieldName];
        }
      }
    }
  } else {
    return foldObj;
  }
  return unfoldObj;
};

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const okActionCreator = () => async (dispatch, getState) => {
  const {checkedId} = getSelfState(getState());
  const res = await fetchJson(`${URL_DEL}/${checkedId}`, 'delete');
  if (res.returnCode) {
    showError(res.returnMsg);
    dispatch(CLOSE_ACTION);
  } else {
    const data = await search(URL_LIST, 0, 10,{});
    let dataReset = [];
    data.result.data.map(item => {
      dataReset.push(unfold(item, '_'))
    });
    data.result.data = dataReset;
    dispatch(action.assignParent({tableItems: data.result.data}));
    showSuccessMsg('删除成功');
    dispatch(CLOSE_ACTION);
  }
};


const cancelActionCreator = () => (dispatch) => {
  dispatch(CLOSE_ACTION);
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onOk: okActionCreator,
  onCancel: cancelActionCreator
};

const ConfirmDialogContainer = connect(mapStateToProps, actionCreators)(ConfirmDialog);

export default ConfirmDialogContainer;

