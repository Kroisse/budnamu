import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { fromJS, List } from 'immutable';
import { FunctionDeclaration } from './FunctionDeclaration';
import type { ImmutableNode, ImmutablePath } from '../constructs';

describe('FunctionDeclaration', () => {
  it('should render basic function declaration', () => {
    const node = fromJS({
      type: 'FunctionDeclaration',
      identifier: {
        type: 'Identifier',
        value: 'greet',
      },
      params: [
        {
          type: 'Parameter',
          pat: {
            type: 'Identifier',
            value: 'name',
          },
        },
      ],
      body: {
        type: 'BlockStatement',
        stmts: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'MemberExpression',
                object: { type: 'Identifier', value: 'console' },
                property: { type: 'Identifier', value: 'log' },
                computed: false,
              },
              arguments: [
                {
                  spread: null,
                  expression: { type: 'StringLiteral', value: 'hello' },
                },
              ],
            },
          },
        ],
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(
      <FunctionDeclaration node={node} path={path} />,
    );

    console.log('Test - rendered HTML:', container.innerHTML);

    expect(container).toHaveTextContent('function');
    expect(container).toHaveTextContent('greet');
    expect(container).toHaveTextContent('name');
    expect(container).toHaveTextContent('console.log');
    expect(container).toHaveTextContent('hello');
  });
});
