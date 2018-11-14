import React, {PropTypes} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {SuperTab} from '../../../components/index';
import s from './EmailAccept.less';
import EmailConfigurationContainer from './EmailConfigurationContainer';
import EmailAcceptConfigurationContainer from './EmailAcceptConfigurationContainer';
import AcceptLogContainer from './AcceptLogContainer';

const props = {
  select: PropTypes.string,
  tabs: PropTypes.array,
  activeKey: PropTypes.string
};

class EmailAccept extends React.Component {
  static propTypes = props;
  static PROPS = Object.keys(props);

  toPage = (activeKey) => {
    switch (activeKey) {
      case 'email':
        return <EmailConfigurationContainer />;
      case 'accept':
        return <EmailAcceptConfigurationContainer /> ;
      case 'log':
        return <AcceptLogContainer /> ;
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

export default withStyles(s)(EmailAccept);
