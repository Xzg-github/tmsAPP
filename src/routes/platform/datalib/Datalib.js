import React, {PropTypes} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {SuperTab} from '../../../components/index';
import s from './Datalib.less';
import TransformContainer from './TransformContainer';
import StandardContainer from './StandardContainer';

const props = {
  select: PropTypes.string,
  tabs: PropTypes.array,
  activeKey: PropTypes.string
};

class Datalib extends React.Component {
  static propTypes = props;
  static PROPS = Object.keys(props);

  toPage = (activeKey) => {
    switch (activeKey) {
      case 'transform':
        return <TransformContainer />;
      case 'standard':
        return <StandardContainer /> ;
    }
  };

  over = () => {
    const {activeKey, tabs, onTabChange} = this.props;
    return (
      <div role="supertab">
        <SuperTab tabs={tabs} activeKey={activeKey} callback={{onTabChange}} />
      </div>
    );
  };


  render() {
    const {activeKey} = this.props;
    return (
      <div className={s.root}>
        {this.over()}
        {this.toPage(activeKey)}
      </div>
    );
  }
}

export default withStyles(s)(Datalib);
