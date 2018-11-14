import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SystemConfig.less';
import {Title, SuperToolbar, Card} from '../../../components';
import {Checkbox} from 'antd';
const CheckboxGroup = Checkbox.Group;

class SystemConfig extends React.Component {

  toSection = ({title, options=[]}, index) => {
    const {value=[], onChange} = this.props;
    return (
      <div key={index}>
        <Title title={title} />
        <CheckboxGroup value={value} options={options} onChange={onChange} />
      </div>
    )
  };

  render() {
    const {buttons, sections, onClick} = this.props;
    return (
      <div className={s.root}>
        <Card>
          {sections.map(this.toSection)}
          <SuperToolbar buttons={buttons} onClick={onClick} size='default'/>
        </Card>
      </div>
    );
  };
}

export default withStyles(s)(SystemConfig);
