import createRootContainer from './RootContainer';
import createOrderPageContainer from './OrderPageContainer';
import createEditDialogContainer from './EditPageContainer';

const createBusiness = (urls, statePath, unique='id', onSearch, importCode, jurisdictionKey) => {
  const {Container, afterEditActionCreator} = createOrderPageContainer(urls, statePath, unique, importCode);
  const EditDialogContainer = createEditDialogContainer(urls, statePath.concat('edit'), afterEditActionCreator, onSearch);
  return createRootContainer(urls, statePath, Container, EditDialogContainer, importCode, jurisdictionKey);
};

export default createBusiness;
