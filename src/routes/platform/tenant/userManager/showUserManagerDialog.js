import {createContainer} from './UserManagerDialogContainer';
import showDialog from '../../../../standard-business/showDialog';

const showUserManagerDialog = (config, item) => {
  const props = {
    ...config,
    tenantGuid: item.guid,
    tableItems: [],
    maxRecords: 0,
    currentPage: 1,
    searchData: {}
  };
  showDialog(createContainer, props);
};

export default showUserManagerDialog;

