import React from 'react';
import s from './inputEditor.less'
import withStyles from 'isomorphic-style-loader/lib/withStyles';

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
  constructor(props) {
    super(props);
    this.state = {htmlValue: ''};
  }

  componentDidMount() {
    const {inputKey,menus,color,showLinkImg = true,uploadImgShowBase64 = true,onChange,value} = this.props;
    const {htmlValue} = this.state;
    const elem1 = this.refs.div1;
    const elem2 = this.refs.div2;
    this[inputKey] =  new E(elem1,elem2);
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

    this[inputKey].customConfig.onblur = () => {
      // html 即编辑器中的内容
      this.isEditor = false
    }

    this[inputKey].customConfig.onfocus = () => {
      // html 即编辑器中的内容
      this.isEditor = true
    }

    this[inputKey].create();
    if( value !==  htmlValue){
      this[inputKey].txt.html(value)
    }
    this.setState({
      htmlValue:value
    })
  }
  //只能在componentDidMount去编辑编辑器内容 所以onFocus  componentDidUpdate就失效
  //onblur 时候可以去放入数据
  componentDidUpdate() {
    const {inputKey,value} = this.props;
    this[inputKey].customConfig.onblur = () => {
      this.isEditor = false
    }
    this[inputKey].customConfig.onfocus = () => {
      this.isEditor = true
    }
    if(this.isEditor){
      return
    }

    const {htmlValue} = this.state;
    if( value ===  htmlValue){
      return
    }
    this.setState({
      htmlValue:value
    });
    this[inputKey].txt.html(value)
  }
  render() {
    const {inputKey} = this.props;
    return (
      <div className={s.root}>
     {/*   <div ref={inputKey} style={{height: '90%', width: '100%', border: 'none'}}>
        </div>*/}
        {/* 将生成编辑器 */}
        <div id="div1" ref="div1" style={{ borderBottom: '1px solid #ccc'}}>
        </div>
        <div id="div2" ref="div2" style={{height: '100%', width: '100%', border: 'none'}}>

        </div>

      </div>
    );
  }
}

export default withStyles(s)(InputEditor);
