import React from 'react';
import classNames from 'classnames';

function Card({children, className, noPadding, ...props}) {
  const padding = !noPadding ? true : null;
  return (
    <div className={classNames('pld-card', className)} data-padding={padding} {...props}>
      {children}
    </div>
  );
}

export default Card;
