import React from 'react';
import { Context } from '../constructs';
import { dispatchStatement } from '../statements';
import {
  dispatchExpression,
  dispatchPattern,
} from '../expressions/dispatchers';
import { commaSeparated } from './commaSeparated';
import { FunctionHeader } from './FunctionHeader';

interface RenderFunctionProps {
  context: Context;
}

export const RenderFunction: React.FC<RenderFunctionProps> = ({ context }) => {
  // Get identifier using dispatcher
  const id = context.child('id').render(dispatchExpression);

  const params = commaSeparated(
    context
      .child('params')
      .elements()
      .map((e) => e.render(dispatchPattern)),
  );
  const body = context.child('body').render(dispatchStatement);

  return (
    <>
      <FunctionHeader id={id} params={params} /> {body}
    </>
  );
};
