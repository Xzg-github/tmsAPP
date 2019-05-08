import {connect} from 'react-redux';
import EditPage from './EditPage';
import {Action} from '../../../../action-reducer/action';
import {EnhanceLoading} from '../../../../components/Enhance';
import {getPathValue} from '../../../../action-reducer/helper';
import helper from '../../../../common/common';

const PARENT_PATH = ['customerPrice'];
const STATE_PATH = ['customerPrice', 'edit'];

const action = new Action(STATE_PATH);

const URL_DOWNLOAD= '/api/track/file_manager/download';

const getSelfState = (rootState) => {
  const parent = getPathValue(rootState, PARENT_PATH);
  return parent[parent.activeKey];
};

const getFiles = async (list=[]) => {
  let arr = [];
  for (let i in list) {
    const file = list[i];
    if(file.fileFormat === 'id') {
      const locationUrl = helper.getJsonResult(await helper.fetchJson(`${URL_DOWNLOAD}/${file.fileUrl}`));
      arr.push({
        ...file,
          uid: i,
          fileFormat: 'id',
          name: file.fileName,
          status: 'done',
          url: `/api/proxy/file-center-service/${locationUrl[file.fileUrl]}`
      });
    }
  }
  return arr;
};

const onTabChangeActionCreator = (key) => async (dispatch, getState) => {
  dispatch(action.assign({activeKey: key}));
  if (key === 'contract') {
    dispatch(action.assign({status: 'loading'}, key));
    const {contract={}} = getSelfState(getState());
    const files = await getFiles(contract.fileList);
    dispatch(action.assign({fileList: files, status: 'page'}, key));
  }
};

const initActionCreator = () => async (dispatch, getState) => {
  try {
    // 这里可以放三个页签公共的数据处理
    dispatch(action.assign({status: 'page'}));
  } catch (e) {
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}));
  }
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onInit: initActionCreator,
  onTabChange: onTabChangeActionCreator,
};

const Container = connect(mapStateToProps, actionCreators)(EnhanceLoading(EditPage));
export default Container;
