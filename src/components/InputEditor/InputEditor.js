import React, { PropTypes } from 'react';
import s from './inputEditor.less'
import withStyles from 'isomorphic-style-loader/lib/withStyles';


const PROPS = {
  inputKey: PropTypes.string,
  menus: PropTypes.array,
  color: PropTypes.array,
  uploadImgShowBase64: PropTypes.boolean,
  showLinkImg: PropTypes.boolean,
  onSearch: PropTypes.func
};

const defaultMenus = [
  'head',  // 标题
  'bold',  // 粗体
  'fontSize',  // 字号
  'fontName',  // 字体
  'italic',  // 斜体
  'underline',  // 下划线
  'strikeThrough',  // 删除线
  'foreColor',  // 文字颜色
  'backColor',  // 背景颜色
  'link',  // 插入链接
  'list',  // 列表
  'justify',  // 对齐方式
  'quote',  // 引用
  'image',  // 插入图片
  'table',  // 表格
  'code',  // 插入代码
];

class InputEditor extends React.Component {


  componentDidMount() {
    const {inputKey,menus,color,showLinkImg = true,uploadImgShowBase64 = true,onChange,value} = this.props;
    const elem = this.refs[inputKey];
    this[inputKey] = new E(elem);
    //配置菜单
    menus && (this[inputKey].customConfig.menus = menus);
    //配置颜色
    color && (this[inputKey].customConfig.menus = color);
    //配置菜单
    this[inputKey].customConfig.menus = defaultMenus;
    if(menus){
      this[inputKey].customConfig.menus = menus
    }
    this[inputKey].customConfig.uploadImgShowBase64 = uploadImgShowBase64; //是否可以上传图片
    this[inputKey].customConfig.showLinkImg = showLinkImg; //隐藏网络图片

    this[inputKey].customConfig.onchange = html => {
      onChange && onChange(html);
    };
    //配置编辑区域的 z-index
    this[inputKey].customConfig.zIndex = 0;
    this[inputKey].create();
    this[inputKey].txt.html(value)
  }

  componentDidUpdate() {
    const {inputKey,value} = this.props;
    this[inputKey].txt.html(value)
  }
  render() {
    const {inputKey} = this.props;

    return (
      <div className={s.root}>
        <div ref={inputKey}>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(InputEditor);
