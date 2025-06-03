import { Dispatcher } from '../constructs';
import { UnknownExpression } from './UnknownExpression';
import { createExpressionComponents } from './components';

// Forward declare the dispatchers to break circular dependency
export const dispatchExpression: Dispatcher = (e, key, path) => {
  const Elem = expressions[e.get('type') as keyof typeof expressions];
  if (Elem != null) {
    return <Elem key={key} node={e} path={path} />;
  } else {
    return <UnknownExpression key={key} node={e} path={path} />;
  }
};

export const dispatchPattern: Dispatcher = (e, key, path) => {
  const Elem = patterns[e.get('type') as keyof typeof patterns];
  if (Elem != null) {
    return <Elem key={key} node={e} path={path} />;
  } else {
    return <UnknownExpression key={key} node={e} path={path} />;
  }
};

// Create the components with the dispatchers
const { expressions, patterns } = createExpressionComponents({
  dispatchExpression,
  dispatchPattern,
});
