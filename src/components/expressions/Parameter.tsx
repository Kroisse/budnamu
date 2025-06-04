import React from 'react';
import { ExpressionProps } from './types';
import { Context } from '../constructs';
import { dispatchExpression } from './dispatchers';

export const Parameter: React.FC<ExpressionProps> = (props) => {
  const context = new Context(props);

  // Handle SWC Parameter node - extract the pattern (usually an Identifier)
  const pat = context.child('pat');

  if (!pat.isEmpty()) {
    // Check if it's an SWC Identifier
    const patNode = pat.node;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    if (patNode && (patNode as any).get('type') === 'Identifier') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const name = (patNode as any).get('value') as string;
      if (name != null) {
        return (
          <span className="expression parameter">
            <span className="expression identifier">{name}</span>
          </span>
        );
      }
    }
    // Otherwise try to render normally
    return (
      <span className="expression parameter">
        {pat.render(dispatchExpression)}
      </span>
    );
  }

  // Fallback - just render the value if it's a simple identifier
  const value = props.node.get('value');
  if (value != null) {
    return <span className="expression parameter identifier">{value}</span>;
  }

  return <span className="expression parameter">param</span>;
};
