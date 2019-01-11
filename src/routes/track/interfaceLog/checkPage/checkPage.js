import React, {PropTypes} from 'react';
import JSONResult from '../TestResult/index';
import {ModalWithDrag} from '../../../../components/index';

class CheckPage extends React.Component {

  static propTypes = {
    title: PropTypes.string,
    visible: PropTypes.bool,
    onCancel: PropTypes.func,
    height: PropTypes.string,
    result: PropTypes.object
  }

  onClick = (key) => {
    this.props.onClick(key);
  };

  modalProp = () => {
    return {
      title: this.props.title,
      visible: this.props.visible,
      maskClosable: true,
      width: 700,
      onCancel: this.onClick.bind(null, 'close'),
      afterClose: this.props.afterClose,
      footer:null
    }
  }

  render(){
    const {result, height='500px'} = this.props;
    return(
        <ModalWithDrag {...this.modalProp()}>
          <JSONResult result={result} containerHeight={height} />
        </ModalWithDrag>
    )
  }
};

export default CheckPage;
