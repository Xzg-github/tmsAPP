import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Contract.less';
import {Indent, SuperForm, SuperToolbar} from '../../../../../components';
import PictureWall from './PictureWall/PictureWall';

class Contract extends React.Component {

  toSuperForm = () => {
    const {controls, value, valid, onChange, onSearch, onExitValid} = this.props;
    const props = {
      controls,
      value,
      valid,
      onChange,
      onSearch,
      onExitValid,
    };
    return <SuperForm {...props}/>
  }


  toPicture = () => {
    const {fileList, uploadText, handleImgChange} = this.props;
    const props = {fileList, uploadText, handleImgChange};
    return <PictureWall {...props}/>
  }

  toFooter = () => {
    const {editType, footerBtns, onClick} = this.props;
    const props = {
      buttons: footerBtns.filter(o => o.showIn && o.showIn.includes(editType)),
      onClick
    };
    return <Indent className={s.footer}><SuperToolbar {...props}/></Indent>
  }

  render() {
    return (
      <Indent className={s.root}>
        {this.toSuperForm()}
        {this.toPicture()}
        {this.toFooter()}
      </Indent>
    );
  }
}

export default withStyles(s)(Contract);
