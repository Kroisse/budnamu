import React from 'react';
import { StatementProps } from './types';

const UnknownStatement: React.FC<StatementProps> = (props) => {
  const inspect = () => {
    console.log(props.node);
  };

  const e = JSON.stringify(props.node);
  return (
    <div className="statement unknown-statement">
      <span className="inner" onClick={inspect}>
        {'<<'} unknown: {e} {'>>'}
      </span>
    </div>
  );
};

export default UnknownStatement;
