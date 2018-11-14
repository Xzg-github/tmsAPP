import React from 'react';

function Indent({children, style={}, ...props}) {
  Object.assign(style, {paddingLeft: 8, paddingRight: 8});
  return (
    <div style={style} {...props}>
      {children}
    </div>
  );
}

export default Indent;
