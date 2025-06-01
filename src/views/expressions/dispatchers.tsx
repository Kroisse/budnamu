import React from 'react';
import { Dispatcher } from '../constructs';
import { UnknownExpression } from './UnknownExpression';
import { createExpressionComponents } from './components';

// Forward declare the dispatchers to break circular dependency
export const dispatchExpression: Dispatcher = (e, key, path) => {
  const elem = expressions[e.get('type') as keyof typeof expressions];
  if (typeof elem !== 'undefined') {
    return React.createElement(elem, { key: key, node: e, path: path });
  } else {
    return React.createElement(UnknownExpression, {
      key: key,
      node: e,
      path: path,
    });
  }
};

export const dispatchPattern: Dispatcher = (e, key, path) => {
  const elem = patterns[e.get('type') as keyof typeof patterns];
  if (typeof elem !== 'undefined') {
    return React.createElement(elem, { key: key, node: e, path: path });
  } else {
    return React.createElement(UnknownExpression, {
      key: key,
      node: e,
      path: path,
    });
  }
};

// Create the components with the dispatchers
const { expressions, patterns } = createExpressionComponents({
  dispatchExpression,
  dispatchPattern,
});
