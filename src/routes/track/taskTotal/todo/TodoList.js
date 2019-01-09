import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {Title} from '../../../../components';
import TodoItem from './TodoItem';
import TodoItem2 from './TodoItem2';
import s from './TodoList.less';

const COL_NUM = 2;

class TodoList extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    items: PropTypes.array,
    count: PropTypes.object,
    size: PropTypes.oneOf(['small', 'large'])
  };

  toItem = (item, index) => {
    const props = {
      ...item,
      key: index,
      count: this.props.count[item.key] || 0
    };
    return this.props.size === 'large' ? <TodoItem {...props} /> : <TodoItem2 {...props} />;
  };

  toRow = (key, items) => {
    let newItems = items;
    if (items.length < COL_NUM) {
      [...newItems] = items;
      for (let i = items.length; i < COL_NUM; i++) {
        newItems.push({});
      }
    }
    return <div key={key}>{newItems.map(this.toItem)}</div>;
  };

  toRows = (items) => {
    const length = items.length;
    let result = [];
    for (let i = 0; i < length; i += COL_NUM) {
      result.push(this.toRow(i, items.slice(i, i + COL_NUM)));
    }
    return result;
  };

  render() {
    const {title, items} = this.props;
    return (
      <div className={s.root}>
        <Title title={title} />
        {this.toRows(items)}
      </div>
    );
  }
}

export default withStyles(s)(TodoList);
