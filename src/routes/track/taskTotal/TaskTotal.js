import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import TodoList from './todo/TodoList';
import s from './TaskTotal.less';

class TaskTotal extends React.Component {

  componentDidMount() {
    this.props.onUpdate();
  }

  render() {
    const {service, document, dispatch, bill, count} = this.props;
    return (
      <div className={s.root}>
        <TodoList {...service} count={count} />
        <TodoList {...document} count={count} />
        <TodoList {...dispatch} count={count} />
        <TodoList {...bill} count={count} />
      </div>
    );
  }
}

export default withStyles(s)(TaskTotal);

