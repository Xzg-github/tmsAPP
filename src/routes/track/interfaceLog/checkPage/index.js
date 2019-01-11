import {PropTypes} from 'react';
import styles from './index.less';
import JSONTree from 'react-json-tree';
import theme from './theme';

function TestResult({ result }) {
  return (
    <div className={styles.testResult}>
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
export default TestResult;
