import React, {PropTypes} from 'react';
import {Card, SuperToolbar, SuperTable} from '../../../components';

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
      maxHeight: 'calc(100vh - 124px)',
      callback: {
        onCheck: this.props.onCheck
      }
    };
  };

  render() {
    return (
      <Card>
        <SuperToolbar {...this.toolbarProps()} />
        <div style={{margin: '10px 0 0'}}>
          <SuperTable {...this.tableProps()} />
        </div>
      </Card>
    );
  }
}

export default Position;
