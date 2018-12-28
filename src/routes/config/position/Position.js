import React, {PropTypes} from 'react';
import {SuperToolbar, SuperTable, Indent} from '../../../components';

class Position extends React.Component {
  static propTypes = {
    buttons: PropTypes.array,
    cols: PropTypes.array,
    items: PropTypes.array,
    checkedRows: PropTypes.array,
    onClick: PropTypes.func,
    onCheck: PropTypes.func
  };

  toolbarProps = () => {
    return {
      buttons: this.props.buttons,
      onClick: this.props.onClick
    };
  };

  tableProps = () => {
    return {
      isolation: true,
      cols: this.props.cols,
      items: this.props.items,
      checkedRows: this.props.checkedRows,
      maxHeight: 'calc(100vh - 145px)',
      callback: {
        onCheck: this.props.onCheck
      }
    };
  };

  render() {
    return (
      <Indent>
        <SuperToolbar {...this.toolbarProps()} />
        <div style={{margin: '5px 0 0'}}>
          <SuperTable {...this.tableProps()} />
        </div>
      </Indent>
    );
  }
}

export default Position;
