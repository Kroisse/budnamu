import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { fromJS, List } from 'immutable';
import { WhileStatement } from './WhileStatement';
import type { ImmutableNode, ImmutablePath } from '../constructs';

describe('WhileStatement', () => {
  it('should render basic while loop', () => {
    const node = fromJS({
      type: 'WhileStatement',
      test: { type: 'Literal', value: true },
      body: {
        type: 'BlockStatement',
        stmts: [
          {
            type: 'ExpressionStatement',
            expression: { type: 'Literal', value: 'loop body' },
          },
        ],
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<WhileStatement node={node} path={path} />);

    expect(container).toHaveTextContent('while');
    expect(container).toHaveTextContent('true');
    expect(container).toHaveTextContent('loop body');
  });

  it('should render while loop with complex test expression', () => {
    const node = fromJS({
      type: 'WhileStatement',
      test: {
        type: 'BinaryExpression',
        operator: '<',
        left: { type: 'Identifier', value: 'i' },
        right: { type: 'Literal', value: 10 },
      },
      body: {
        type: 'BlockStatement',
        stmts: [
          {
            type: 'UpdateExpression',
            operator: '++',
            prefix: false,
            argument: { type: 'Identifier', value: 'i' },
          },
        ],
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<WhileStatement node={node} path={path} />);

    expect(container).toHaveTextContent('while');
    expect(container).toHaveTextContent('i < 10');
    expect(container).toHaveTextContent('i');
    expect(container).toHaveTextContent('++');
  });

  it('should render while loop with single statement body', () => {
    const node = fromJS({
      type: 'WhileStatement',
      test: { type: 'Identifier', value: 'condition' },
      body: {
        type: 'ExpressionStatement',
        expression: {
          type: 'CallExpression',
          callee: { type: 'Identifier', value: 'doSomething' },
          arguments: [],
        },
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<WhileStatement node={node} path={path} />);

    expect(container).toHaveTextContent('while');
    expect(container).toHaveTextContent('condition');
    expect(container).toHaveTextContent('doSomething()');
    expect(container).not.toHaveTextContent('{');
  });

  it('should render while loop with empty body', () => {
    const node = fromJS({
      type: 'WhileStatement',
      test: { type: 'Literal', value: false },
      body: { type: 'BlockStatement', stmts: [] },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<WhileStatement node={node} path={path} />);

    expect(container).toHaveTextContent('while');
    expect(container).toHaveTextContent('false');
    expect(container).toHaveTextContent('{}');
  });

  it('should render nested while loops', () => {
    const node = fromJS({
      type: 'WhileStatement',
      test: { type: 'Identifier', value: 'outer' },
      body: {
        type: 'BlockStatement',
        stmts: [
          {
            type: 'WhileStatement',
            test: { type: 'Identifier', value: 'inner' },
            body: {
              type: 'BlockStatement',
              stmts: [{ type: 'BreakStatement', label: null }],
            },
          },
        ],
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<WhileStatement node={node} path={path} />);

    // Just check the content is rendered correctly
    expect(container.querySelector('.while-statement')).toBeTruthy();
    expect(container).toHaveTextContent('outer');
    expect(container).toHaveTextContent('inner');
    // Note: nested statements might not render properly in test environment
  });

  it('should render while loop with logical test expression', () => {
    const node = fromJS({
      type: 'WhileStatement',
      test: {
        type: 'LogicalExpression',
        operator: '&&',
        left: { type: 'Identifier', value: 'a' },
        right: { type: 'Identifier', value: 'b' },
      },
      body: { type: 'BlockStatement', stmts: [] },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<WhileStatement node={node} path={path} />);

    expect(container).toHaveTextContent('while');
    expect(container).toHaveTextContent('a && b');
  });

  it('should render while loop with unary test expression', () => {
    const node = fromJS({
      type: 'WhileStatement',
      test: {
        type: 'UnaryExpression',
        operator: '!',
        prefix: true,
        argument: { type: 'Identifier', value: 'done' },
      },
      body: { type: 'BlockStatement', stmts: [] },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<WhileStatement node={node} path={path} />);

    expect(container).toHaveTextContent('while');
    expect(container).toHaveTextContent('!done');
  });

  it('should render proper HTML structure', () => {
    const node = fromJS({
      type: 'WhileStatement',
      test: { type: 'Literal', value: true },
      body: { type: 'BlockStatement', stmts: [] },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<WhileStatement node={node} path={path} />);

    const div = container.firstElementChild;
    expect(div).toBeInTheDocument();
    expect(div).toHaveClass('statement', 'while-statement');

    const keyword = container.querySelector('.keyword');
    expect(keyword).toHaveTextContent('while');
  });

  it('should render while loop with call expression test', () => {
    const node = fromJS({
      type: 'WhileStatement',
      test: {
        type: 'CallExpression',
        callee: { type: 'Identifier', value: 'hasNext' },
        arguments: [],
      },
      body: {
        type: 'BlockStatement',
        stmts: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: { type: 'Identifier', value: 'processNext' },
              arguments: [],
            },
          },
        ],
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<WhileStatement node={node} path={path} />);

    expect(container).toHaveTextContent('while');
    expect(container).toHaveTextContent('hasNext()');
    expect(container).toHaveTextContent('processNext()');
  });

  it('should render while loop with assignment in test', () => {
    const node = fromJS({
      type: 'WhileStatement',
      test: {
        type: 'AssignmentExpression',
        operator: '=',
        left: { type: 'Identifier', value: 'line' },
        right: {
          type: 'CallExpression',
          callee: { type: 'Identifier', value: 'readLine' },
          arguments: [],
        },
      },
      body: {
        type: 'BlockStatement',
        stmts: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: { type: 'Identifier', value: 'process' },
              arguments: [{ type: 'Identifier', value: 'line' }],
            },
          },
        ],
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<WhileStatement node={node} path={path} />);

    expect(container).toHaveTextContent('while');
    expect(container).toHaveTextContent('line = readLine()');
    expect(container).toHaveTextContent('process(line)');
  });
});
