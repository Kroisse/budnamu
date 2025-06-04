import React from 'react';
import { Dispatcher } from '../constructs';
import { UnknownExpression } from './UnknownExpression';
import { createExpressionComponents } from './components';
import { ExpressionProps } from './types';

// Store references to avoid circular dependency
let expressionsMap: Record<string, React.ComponentType<ExpressionProps>> = {};
let patternsMap: Record<string, React.ComponentType<ExpressionProps>> = {};
let initialized = false;

// Initialize maps lazily
const ensureInitialized = () => {
  if (!initialized) {
    const { expressions, patterns } = createExpressionComponents({
      dispatchExpression,
      dispatchPattern,
    });
    expressionsMap = expressions;
    patternsMap = patterns;
    initialized = true;
  }
};

// Define the dispatchers
export const dispatchExpression: Dispatcher = (e, key, path) => {
  ensureInitialized();

  const type = e.get('type') as string;
  const Elem = expressionsMap[type];

  if (Elem != null) {
    return <Elem key={key} node={e} path={path} />;
  } else {
    return <UnknownExpression key={key} node={e} path={path} />;
  }
};

export const dispatchPattern: Dispatcher = (e, key, path) => {
  ensureInitialized();

  const type = e.get('type') as string;
  const Elem = patternsMap[type];

  if (Elem != null) {
    return <Elem key={key} node={e} path={path} />;
  } else {
    return <UnknownExpression key={key} node={e} path={path} />;
  }
};
