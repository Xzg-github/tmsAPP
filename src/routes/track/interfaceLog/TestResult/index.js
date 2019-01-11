import React, {PropTypes} from 'react';
import styles from './index.less';
import JSONTree from 'react-json-tree';
import theme from './theme';
import withStyle from 'isomorphic-style-loader/lib/withStyles';

function TestResult({ result , containerHeight}) {
  return (
    <div className={styles.testResult} style={{height: containerHeight, overflow: 'auto'}}>
      <div className={styles.inner}>
        {result ? (
          <JSONTree
            data={result}
            theme={theme}
            shouldExpandNode={() => {
              return true;
            }}
          />
        ) : (
          ''
        )}
      </div>
    </div>
  );
}
TestResult.propTypes = {
  result: PropTypes.object
};
export default withStyle(styles)(TestResult);
