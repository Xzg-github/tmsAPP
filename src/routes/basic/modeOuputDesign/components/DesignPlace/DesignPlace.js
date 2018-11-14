import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './DesignPlace.less';
import { SuperTab2 } from '../../../../../components';
import InputEditor from '../InputEditor';
import { Input } from 'antd';

class DesignPlace extends React.Component {
  static propTypes = {
    baseInfo: PropTypes.object,
    onBaseInfo: PropTypes.func,
  };

  onChange = (e) => {
    this.props.onBaseInfo(e.target.value, 'content');
  };

  onEditorChange = (value) => {
    this.props.onBaseInfo(value, 'content');
  };

  renderInput() {
    return(
    <Input
      style={{height: '90%', width: '100%', border: 'none', resize: 'none'}}
      type="textarea"
      value={this.props.baseInfo.content}
      onChange={this.onChange}
    />
    );
  }

  renderEditor() {
    const { baseInfo } = this.props;
    const props = {
      inputKey:'contentEditor',
      value:this.props.baseInfo.content ? this.props.baseInfo.content : '',
      onChange:this.onEditorChange

    };
    return <InputEditor {...props}/>
  }

  toContent = (activeKey) => {
    switch (activeKey) {
      case 'index':
        return this.renderInput();
      case 'editor':
        return this.renderEditor();
    }
  };

  toSuperTab = (activeKey,onTabChange) => {
    let tabs = [
      {
        key: 'index',
        title: '代码',
        close: false,
      },
      {
        key: 'editor',
        title: '设计',
        close: false,
      }
    ];
    return <SuperTab2 {...{tabs, activeKey,onTabChange}} />;
  };

  renderPage = () => {
    const { activeKey ='index' , onTabChange } = this.props;
    return (
      <div className={s.root}>
        {this.toSuperTab(activeKey,onTabChange)}
        {
          this.toContent(activeKey)
        }
      </div>
    );
  }

  render() {
    return this.renderPage();
  }
}

export default withStyles(s)(DesignPlace);

