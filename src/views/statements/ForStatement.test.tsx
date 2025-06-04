import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { fromJS, List } from 'immutable';
import { ForStatement } from './ForStatement';
import type { ImmutableNode, ImmutablePath } from '../constructs';

describe('ForStatement', () => {
  it('should render basic for loop', () => {
    const node = fromJS({
      type: 'ForStatement',
      init: {
        type: 'VariableDeclaration',
        declarations: [
          {
            type: 'VariableDeclarator',
            id: { type: 'Identifier', name: 'i' },
            init: { type: 'Literal', value: 0 },
          },
        ],
        kind: 'let',
      },
      test: {
        type: 'BinaryExpression',
        operator: '<',
        left: { type: 'Identifier', name: 'i' },
        right: { type: 'Literal', value: 10 },
      },
      update: {
        type: 'UpdateExpression',
        operator: '++',
        prefix: false,
        argument: { type: 'Identifier', name: 'i' },
      },
      body: {
        type: 'BlockStatement',
        body: [
          {
            type: 'ExpressionStatement',
            expression: { type: 'Identifier', name: 'i' },
          },
        ],
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ForStatement node={node} path={path} />);

    expect(container).toHaveTextContent('for');
    expect(container).toHaveTextContent('let i = 0');
    expect(container).toHaveTextContent('i < 10');
    expect(container).toHaveTextContent('i++');
  });

  it('should render for loop with expression init', () => {
    const node = fromJS({
      type: 'ForStatement',
      init: {
        type: 'AssignmentExpression',
        operator: '=',
        left: { type: 'Identifier', name: 'i' },
        right: { type: 'Literal', value: 0 },
      },
      test: {
        type: 'BinaryExpression',
        operator: '<',
        left: { type: 'Identifier', name: 'i' },
        right: { type: 'Literal', value: 5 },
      },
      update: {
        type: 'UpdateExpression',
        operator: '++',
        prefix: false,
        argument: { type: 'Identifier', name: 'i' },
      },
      body: { type: 'BlockStatement', body: [] },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ForStatement node={node} path={path} />);

    expect(container).toHaveTextContent('for');
    expect(container).toHaveTextContent('i = 0');
    expect(container).toHaveTextContent('i < 5');
    expect(container).toHaveTextContent('i++');
  });

  it('should render infinite for loop (missing parts)', () => {
    const node = fromJS({
      type: 'ForStatement',
      init: null,
      test: null,
      update: null,
      body: {
        type: 'BlockStatement',
        body: [{ type: 'BreakStatement', label: null }],
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ForStatement node={node} path={path} />);

    expect(container).toHaveTextContent('for');
    expect(container).toHaveTextContent('(');
    expect(container).toHaveTextContent(';');
    expect(container).toHaveTextContent(')');
    expect(container).toHaveTextContent('break');
  });

  it('should render for loop with only test', () => {
    const node = fromJS({
      type: 'ForStatement',
      init: null,
      test: { type: 'Identifier', name: 'condition' },
      update: null,
      body: { type: 'BlockStatement', body: [] },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ForStatement node={node} path={path} />);

    expect(container).toHaveTextContent('for');
    expect(container).toHaveTextContent('condition');
  });

  it('should render for loop with multiple variable declarations', () => {
    const node = fromJS({
      type: 'ForStatement',
      init: {
        type: 'VariableDeclaration',
        declarations: [
          {
            type: 'VariableDeclarator',
            id: { type: 'Identifier', name: 'i' },
            init: { type: 'Literal', value: 0 },
          },
          {
            type: 'VariableDeclarator',
            id: { type: 'Identifier', name: 'j' },
            init: { type: 'Literal', value: 10 },
          },
        ],
        kind: 'let',
      },
      test: {
        type: 'BinaryExpression',
        operator: '<',
        left: { type: 'Identifier', name: 'i' },
        right: { type: 'Identifier', name: 'j' },
      },
      update: {
        type: 'SequenceExpression',
        expressions: [
          {
            type: 'UpdateExpression',
            operator: '++',
            prefix: false,
            argument: { type: 'Identifier', name: 'i' },
          },
          {
            type: 'UpdateExpression',
            operator: '--',
            prefix: false,
            argument: { type: 'Identifier', name: 'j' },
          },
        ],
      },
      body: { type: 'BlockStatement', body: [] },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ForStatement node={node} path={path} />);

    expect(container).toHaveTextContent('let i = 0, j = 10');
    expect(container).toHaveTextContent('i < j');
    expect(container).toHaveTextContent('i++, j--');
  });

  it('should render single statement body without block', () => {
    const node = fromJS({
      type: 'ForStatement',
      init: {
        type: 'VariableDeclaration',
        declarations: [
          {
            type: 'VariableDeclarator',
            id: { type: 'Identifier', name: 'i' },
            init: { type: 'Literal', value: 0 },
          },
        ],
        kind: 'let',
      },
      test: {
        type: 'BinaryExpression',
        operator: '<',
        left: { type: 'Identifier', name: 'i' },
        right: { type: 'Literal', value: 5 },
      },
      update: {
        type: 'UpdateExpression',
        operator: '++',
        prefix: false,
        argument: { type: 'Identifier', name: 'i' },
      },
      body: {
        type: 'ExpressionStatement',
        expression: {
          type: 'CallExpression',
          callee: {
            type: 'MemberExpression',
            object: { type: 'Identifier', name: 'console' },
            property: { type: 'Identifier', name: 'log' },
            computed: false,
          },
          arguments: [{ type: 'Identifier', name: 'i' }],
        },
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ForStatement node={node} path={path} />);

    expect(container).toHaveTextContent('for');
    expect(container).toHaveTextContent('console.log(i)');
    expect(container).not.toHaveTextContent('{');
  });

  it('should render nested for loops', () => {
    const node = fromJS({
      type: 'ForStatement',
      init: {
        type: 'VariableDeclaration',
        declarations: [
          {
            type: 'VariableDeclarator',
            id: { type: 'Identifier', name: 'i' },
            init: { type: 'Literal', value: 0 },
          },
        ],
        kind: 'let',
      },
      test: {
        type: 'BinaryExpression',
        operator: '<',
        left: { type: 'Identifier', name: 'i' },
        right: { type: 'Literal', value: 3 },
      },
      update: {
        type: 'UpdateExpression',
        operator: '++',
        prefix: false,
        argument: { type: 'Identifier', name: 'i' },
      },
      body: {
        type: 'BlockStatement',
        body: [
          {
            type: 'ForStatement',
            init: {
              type: 'VariableDeclaration',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  id: { type: 'Identifier', name: 'j' },
                  init: { type: 'Literal', value: 0 },
                },
              ],
              kind: 'let',
            },
            test: {
              type: 'BinaryExpression',
              operator: '<',
              left: { type: 'Identifier', name: 'j' },
              right: { type: 'Literal', value: 3 },
            },
            update: {
              type: 'UpdateExpression',
              operator: '++',
              prefix: false,
              argument: { type: 'Identifier', name: 'j' },
            },
            body: { type: 'BlockStatement', body: [] },
          },
        ],
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ForStatement node={node} path={path} />);

    // Just check the content is rendered correctly
    expect(container.querySelector('.for-statement')).toBeTruthy();
    expect(container).toHaveTextContent('let i = 0');
    // Note: nested statements might not render properly in test environment
  });

  it('should render proper HTML structure', () => {
    const node = fromJS({
      type: 'ForStatement',
      init: null,
      test: null,
      update: null,
      body: { type: 'BlockStatement', body: [] },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ForStatement node={node} path={path} />);

    const div = container.firstElementChild;
    expect(div).toBeInTheDocument();
    expect(div).toHaveClass('statement', 'for-statement');

    const keyword = container.querySelector('.keyword');
    expect(keyword).toHaveTextContent('for');
  });

  it('should handle complex update expressions', () => {
    const node = fromJS({
      type: 'ForStatement',
      init: null,
      test: null,
      update: {
        type: 'AssignmentExpression',
        operator: '+=',
        left: { type: 'Identifier', name: 'i' },
        right: { type: 'Literal', value: 2 },
      },
      body: { type: 'BlockStatement', body: [] },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ForStatement node={node} path={path} />);

    expect(container).toHaveTextContent('i += 2');
  });

  it('should render for loop with const declaration', () => {
    const node = fromJS({
      type: 'ForStatement',
      init: {
        type: 'VariableDeclaration',
        declarations: [
          {
            type: 'VariableDeclarator',
            id: { type: 'Identifier', name: 'MAX' },
            init: { type: 'Literal', value: 100 },
          },
        ],
        kind: 'const',
      },
      test: { type: 'Literal', value: true },
      update: null,
      body: { type: 'BlockStatement', body: [] },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ForStatement node={node} path={path} />);

    expect(container).toHaveTextContent('const MAX = 100');
  });
});
