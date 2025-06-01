import React from 'react';
import { Dispatcher } from '../constructs';
import UnknownStatement from './UnknownStatement';
import { createStatementComponents } from './components';
import { StatementComponent } from './types';

// Create a mutable reference to hold the statements
let statements: Record<string, StatementComponent> = {};

// Forward declare the dispatcher to break circular dependency
export const dispatchStatement: Dispatcher = (e, key, path) => {
  const elem = statements[e.get('type') as keyof typeof statements];
  if (typeof elem !== 'undefined') {
    return React.createElement(elem, { key: key, node: e, path: path });
  } else {
    return React.createElement(UnknownStatement, {
      key: key,
      node: e,
      path: path,
    });
  }
};

// Create the components with the dispatcher
statements = createStatementComponents({
  statements,
  dispatchStatement,
});

// Export the statement components for external use if needed
export const statementComponents = statements;
