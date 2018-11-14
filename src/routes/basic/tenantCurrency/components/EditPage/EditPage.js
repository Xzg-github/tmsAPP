import React from 'react';
import ReactDOM from 'react-dom';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Checkbox, Row, Col } from 'antd';
import s from './EditPage.less';
import {ModalWithDrag} from '../../../../../components';
const CheckboxGroup = Checkbox.Group;

class EditPage extends React.Component {
  getWidth = () => {
    const {size} = this.props;
    if (size === 'small') {
      return 416;
    } else if (size === 'middle') {
      return 700;
    } else if (size === 'large') {
      return 910;
    } else {
      return 520;
    }
  };

  getProps = () => {
    const {title, config, onOk, onCancel} = this.props;
    return {
      title, onOk, onCancel,
      width: this.getWidth(),
      visible: true,
      maskClosable: false,
      okText: config.ok,
      cancelText: config.cancel,
      getContainer: () => ReactDOM.findDOMNode(this).firstChild
    };
  };

  onChange = (checkedValues) => {
    return this.props.onChange(checkedValues)
  };

  toMapCheckedBox =() => {
    const {options} = this.props;
    return options.map((item) => {
      const title = item.title;
     return <Checkbox key= {item.value} value= {item.value}>{title}</Checkbox>
    })
  };

  toCheckedBox = () => {
    return (
      <CheckboxGroup onChange={this.onChange}>
        <Row>
          <div  className={s.root}>
            <Col span={100}>{this.toMapCheckedBox()}</Col>
          </div>
        </Row>
      </CheckboxGroup>
    )
  };


  getColNumber = () => {
    if (this.props.size === 'middle' || this.props.size === 'large') {
      return 3;
    } else {
      return 2;
    }
  };

  render() {
    return (
      <div>
        <div />
        <ModalWithDrag {...this.getProps()}>
            {this.toCheckedBox()}
        </ModalWithDrag>
      </div>
    );
  }
}

export default withStyles(s)(EditPage);

