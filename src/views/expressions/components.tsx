import React from 'react';
import { Map } from 'immutable';
import {
  Context,
  ImmutableNode,
  ImmutablePath,
  Dispatcher,
} from '../constructs';
import * as utils from '../utils';

// Import all individual expression components
import { Literal } from './Literal';
import { Identifier } from './Identifier';
import { ThisExpression } from './ThisExpression';
import { ObjectExpression } from './ObjectExpression';
import { ArrayExpression } from './ArrayExpression';
import { MemberExpression } from './MemberExpression';
import { CallExpression } from './CallExpression';
import { NewExpression } from './NewExpression';
import { UnaryExpression } from './UnaryExpression';
import { BinaryExpression } from './BinaryExpression';
import { LogicalExpression } from './LogicalExpression';
import { ConditionalExpression } from './ConditionalExpression';
import { AssignmentExpression } from './AssignmentExpression';
import { UpdateExpression } from './UpdateExpression';
import { FunctionExpression } from './FunctionExpression';
import { SequenceExpression } from './SequenceExpression';

const { openBrace, closeBrace, openBracket, closeBracket } = utils;

export interface ExpressionProps {
  node: ImmutableNode;
  path: ImmutablePath;
  key?: string | number;
}

export type ExpressionComponent = React.FC<ExpressionProps>;

// We'll need to pass these as props to avoid circular dependencies
interface ComponentsWithDispatchers {
  dispatchExpression: Dispatcher;
  dispatchPattern: Dispatcher;
}

// Create expression components factory to avoid circular dependencies
export function createExpressionComponents(
  dispatchers: ComponentsWithDispatchers,
): {
  expressions: Record<string, ExpressionComponent>;
  patterns: Record<string, ExpressionComponent>;
} {
  const { dispatchExpression, dispatchPattern } = dispatchers;

  const expressions: Record<string, ExpressionComponent> = {
    Literal,
    Identifier,
    ThisExpression,
    ObjectExpression,
    ArrayExpression,
    MemberExpression,
    CallExpression,
    NewExpression,
    UnaryExpression,
    BinaryExpression,
    LogicalExpression,
    ConditionalExpression,
    AssignmentExpression,
    UpdateExpression,
    FunctionExpression,
    SequenceExpression,
  };

  const patterns: Record<string, ExpressionComponent> = Map(expressions)
    .merge({
      ObjectPattern: (props: ExpressionProps) => {
        const context = new Context(props);
        const properties = utils.commaSeparated(
          context
            .child('properties')
            .elements()
            .map((e, i) => {
              const key = e.child('key').render(dispatchExpression);
              if (e.node?.get('shorthand')) {
                return (
                  <span key={i} className="property">
                    {key}
                  </span>
                );
              } else {
                const value = e.child('value').render(dispatchPattern);
                return (
                  <span key={i} className="property">
                    {key}: {value}
                  </span>
                );
              }
            }),
        );
        return (
          <span className="expression object-pattern">
            {openBrace}
            <span className="properties">{properties}</span>
            {closeBrace}
          </span>
        );
      },
      ArrayPattern: (props: ExpressionProps) => {
        const context = new Context(props);
        const elements = utils.commaSeparated(
          context
            .child('elements')
            .elements()
            .map((e) => e.render(dispatchPattern)),
        );
        return (
          <span className="expression array-pattern">
            {openBracket}
            {elements}
            {closeBracket}
          </span>
        );
      },
    })
    .toObject() as Record<string, ExpressionComponent>;

  return { expressions, patterns };
}
