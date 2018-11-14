import ModeOutput from './ModeOutput';
import showPopup from '../../standard-business/showPopup';

const showModeOutputDialog = (modeCode, paramid, filter={}) => {
  const props = {
    isShow: true,
    modeCode, paramid, filter
  };
  return showPopup(ModeOutput, props);
};

export default showModeOutputDialog;
