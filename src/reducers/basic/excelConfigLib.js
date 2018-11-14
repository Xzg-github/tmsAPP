import {createReducer} from '../../action-reducer/reducer';
import {mapReducer} from '../../action-reducer/combine';

const create = (key) => {
  const prefix = ['basic', key];
  const edit = createReducer(prefix.concat('edit'));
  const toEdit = ({activeKey}, {payload={}}) => {
    const key = payload.currentKey || activeKey;
    return key !== 'index' ? {keys: [key], reducer: edit} : {};
  };
  return createReducer(prefix, mapReducer(toEdit));
};

const reducer = create('excelConfigLib');

export default reducer;
