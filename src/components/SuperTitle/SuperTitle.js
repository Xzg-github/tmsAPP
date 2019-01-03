import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './SuperTitle.less';
import {Title, SuperToolbar} from '../index';
import classNames from 'classnames';

/**
 * className：样式类
 * title: 标题
 * readonly：是否只读（是否显示按钮）
 * buttons: 按钮组（同supertoolbar）
 * size: 大小样式，与antd中Button的type取值一样
 * onClick: 点击事件
 */

class SuperTitle extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    readonly: PropTypes.bool,
    buttons: PropTypes.array,
    size: PropTypes.oneOf(['small', 'default', 'large']),
    onClick: PropTypes.func
  }

  render() {
    const {className='', title='', readonly=false, buttons=[], size='small', onClick} = this.props;
    return (
      <div className={classNames(s.root, className)}>
        <Title role='title' title={title} className={s[`title_${size}`]}>
          {!readonly && <SuperToolbar role='toolbar' {...{buttons, size, onClick}}/>}
        </Title>
      </div>
    )
  }
}

export default withStyles(s)(SuperTitle);
