import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ModeOutputDesign.less';
import ModeTree from './components/ModeTree/ModeTree';
import DataSet from './components/DataSet/DataSet';
import Setting from './components/Setting/Setting';
import DesignPlace from './components/DesignPlace/DesignPlace';
import ConfirmDialog from '../../../components/ConfirmDialog';

class ModeOutputDesign extends React.Component {
  static propTypes = {
    setting: PropTypes.array,
    baseInfo: PropTypes.object,
    modeListTree: PropTypes.object,
    dataSourceTree: PropTypes.object,
    modeListExpand: PropTypes.object,
    dataSourceExpand: PropTypes.object,
    onGetDataSet: PropTypes.func,
    onBaseInfo: PropTypes.func,
    onExpand: PropTypes.func,
    onAddData: PropTypes.func,
    onSaveData: PropTypes.func,
    onDelData: PropTypes.func,
  };

  state = {
    isConfirmDialog: false,
    confirmDialogType: null,
  }

  onSettingClick = (key) => {
    switch (key) {
      case 'save':
        this.props.onSaveData();
        break;
      case 'add': {
        this.addData();
        break;
      }
      case 'del': {
        this.openConfirmDialog('del');
        break;
      }
      case 'preview': {
        this.preview();
        break;
      }
      default:
        break;
    }
  }

  openConfirmDialog = (type) => {
    this.setState({ isConfirmDialog: true, confirmDialogType: type });
  };

  closeConfirmDialog = () => {
    this.setState({ isConfirmDialog: false, confirmDialogType: null });
  };

  addData = () => {   // 判断模板名称reportName是否已存在，弹出确认框
    let reportName = [];
    Object.keys(this.props.modeListTree).forEach((key) => {
      if (this.props.modeListTree[key].title === this.props.baseInfo.reportName) {
        reportName.push(this.props.modeListTree[key].title);
      }
    });
    if (reportName.length > 0) {
      this.openConfirmDialog('add');
    } else {
      this.props.onAddData();
    }
  };

  preview = () => {
    const baseInfo = this.props.baseInfo;
    const previewUrl = `/api/proxy/report_service/report/demo/${baseInfo.outputType}/${baseInfo.id}`;
    window.open(previewUrl);
  };

  delOk = () => {
    this.props.onDelData();
    this.closeConfirmDialog();
  };

  addOk = () => {
    this.props.onAddData();
    this.closeConfirmDialog();
  };


  renderModeTree () {
    const props = {
      modeListTree: this.props.modeListTree,
      onGetDataSet: this.props.onGetDataSet,
      expand: this.props.modeListExpand,
      onExpand: this.props.onExpand,
    };
    return <div className={s.modeTree}>
      <ModeTree {...props}/>
    </div>
  }

  renderWorkplaceWrap () {
    const props = {};
    return (
      <div className={s.workplace_wrap}>
        {this.renderSetting()}
        {this.renderWorkplace()}
      </div>
    );
  }

  renderSetting () {
    const props = {
      setting: this.props.setting,
      onClick: this.onSettingClick,
      baseInfo: this.props.baseInfo,
      onBaseInfo: this.props.onBaseInfo,
    };
    return (
      <div className={s.setting}>
        <Setting {...props}/>
      </div>
    );
  }

  renderWorkplace () {
    return (
      <div className={s.workplace}>
        {this.renderDesignplace()}
        {this.renderToolWrap()}
      </div>
    );
  }

  renderDesignplace () {
    const props = {
      baseInfo: this.props.baseInfo,
      onBaseInfo: this.props.onBaseInfo,
      onTabChange: this.props.onTabChange,
      activeKey:this.props.activeKey
    };
    return (
      <div className={s.designplace}>
        <DesignPlace {...props}/>
      </div>
    );
  }

  renderToolWrap () {
    return (
      <div className={s.tool_wrap}>
        {this.renderTool()}
        {this.renderDataSet()}
      </div>
    );
  }

  renderTool () {
    const props = {};
    return <div className={s.tool}><p>{this.props.dataContent ? this.props.dataContent : ''}</p></div>
  }

  renderDataSet() {
    const props = {
      dataSourceTree: this.props.dataSourceTree,
      expand: this.props.dataSourceExpand,
      onExpand: this.props.onExpand,
    };
    return <div className={s.dataSet}>
      <DataSet {...props}/>
    </div>
  }

  renderConfirmDialog() {
    const confirmDialogConfig =  {
      del: {title: '删除',content: '是否确认删除所选数据？', onOk: this.delOk},
      add: {title: '新增',content: '模板名称已存在是否继续新增？', onOk: this.addOk}
    };
    const props = {
      ...confirmDialogConfig[this.state.confirmDialogType],
      ok: '确认',
      cancel: '取消',
      onCancel: () => { this.closeConfirmDialog() },
    };
    return <ConfirmDialog {...props}/>
  }

  renderPage = () => {
    return (
      <div className={s.root}>
        <div className={s.wrap}>
          {this.renderModeTree()}
          {this.renderWorkplaceWrap()}
        </div>
        {this.state.isConfirmDialog ? this.renderConfirmDialog() : null}
      </div>
    );
  }

  render() {
    return this.renderPage();
  }
}

export default withStyles(s)(ModeOutputDesign);
