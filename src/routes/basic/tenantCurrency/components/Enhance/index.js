import EnhanceLoading from '../../../../../components/Enhance/Loading';
import EnhanceDialogs from '../../../../../components/Enhance/Dialogs';

const EnhanceEditDialog = (Container, EditDialog) => {
  return EnhanceDialogs(Container, ['join'], [EditDialog]);
};

export {EnhanceLoading, EnhanceDialogs, EnhanceEditDialog};
