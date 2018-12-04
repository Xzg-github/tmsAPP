import React, {PropTypes} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Frame.less';

class Frame extends React.Component {
  static propTypes = {
    contentClass: PropTypes.string,
  };

  render() {
    const {children, contentClass} = this.props;
    return (
      <div className={s.root}>
        <header>
          <i />
          <a href='/login'>返回登录页</a>
        </header>
        <section className={contentClass}>{children}</section>
        <footer>Copyright &copy; 2017 - 2027 深圳市云恋科技有限公司 粤ICP备17104734</footer>
      </div>
    );
  }
}

export default withStyles(s)(Frame);
