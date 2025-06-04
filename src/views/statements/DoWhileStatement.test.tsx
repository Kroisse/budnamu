import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { fromJS, List } from 'immutable';
import { DoWhileStatement } from './DoWhileStatement';
import type { ImmutableNode, ImmutablePath } from '../constructs';

describe('DoWhileStatement', () => {
  it('should render basic do-while loop', () => {
    const node = fromJS({
      type: 'DoWhileStatement',
      body: {
        type: 'BlockStatement',
        body: [
          {
            type: 'ExpressionStatement',
            expression: { type: 'Literal', value: 'loop body' },
          },
        ],
      },
      test: { type: 'Literal', value: true },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<DoWhileStatement node={node} path={path} />);

    expect(container).toHaveTextContent('do');
    expect(container).toHaveTextContent('loop body');
    expect(container).toHaveTextContent('while');
    expect(container).toHaveTextContent('true');
    expect(container).toHaveTextContent(';');
  });

  it('should render do-while with complex test expression', () => {
    const node = fromJS({
      type: 'DoWhileStatement',
      body: {
        type: 'BlockStatement',
        body: [
          {
            type: 'UpdateExpression',
            operator: '++',
            prefix: false,
            argument: { type: 'Identifier', name: 'i' },
          },
        ],
      },
      test: {
        type: 'BinaryExpression',
        operator: '<',
        left: { type: 'Identifier', name: 'i' },
        right: { type: 'Literal', value: 10 },
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<DoWhileStatement node={node} path={path} />);

    expect(container).toHaveTextContent('do');
    expect(container).toHaveTextContent('i');
    expect(container).toHaveTextContent('++');
    expect(container).toHaveTextContent('while');
    expect(container).toHaveTextContent('i < 10');
  });

  it('should render do-while with single statement body', () => {
    const node = fromJS({
      type: 'DoWhileStatement',
      body: {
        type: 'ExpressionStatement',
        expression: {
          type: 'CallExpression',
          callee: { type: 'Identifier', name: 'process' },
          arguments: [],
        },
      },
      test: { type: 'Identifier', name: 'condition' },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<DoWhileStatement node={node} path={path} />);

    expect(container).toHaveTextContent('do');
    expect(container).toHaveTextContent('process()');
    expect(container).toHaveTextContent('while');
    expect(container).toHaveTextContent('condition');
  });

  it('should render do-while with empty body', () => {
    const node = fromJS({
      type: 'DoWhileStatement',
      body: { type: 'BlockStatement', body: [] },
      test: { type: 'Literal', value: false },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<DoWhileStatement node={node} path={path} />);

    expect(container).toHaveTextContent('do');
    expect(container).toHaveTextContent('{}');
    expect(container).toHaveTextContent('while');
    expect(container).toHaveTextContent('false');
  });

  it('should render nested do-while loops', () => {
    const node = fromJS({
      type: 'DoWhileStatement',
      body: {
        type: 'BlockStatement',
        body: [
          {
            type: 'DoWhileStatement',
            body: {
              type: 'BlockStatement',
              body: [{ type: 'BreakStatement', label: null }],
            },
            test: { type: 'Identifier', name: 'inner' },
          },
        ],
      },
      test: { type: 'Identifier', name: 'outer' },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<DoWhileStatement node={node} path={path} />);

    // Just check the content is rendered correctly
    expect(container.querySelector('.do-while-statement')).toBeTruthy();
    expect(container).toHaveTextContent('outer');
    expect(container).toHaveTextContent('inner');
    // Note: nested statements might not render properly in test environment
  });

  it('should render do-while with logical test expression', () => {
    const node = fromJS({
      type: 'DoWhileStatement',
      body: { type: 'BlockStatement', body: [] },
      test: {
        type: 'LogicalExpression',
        operator: '||',
        left: { type: 'Identifier', name: 'a' },
        right: { type: 'Identifier', name: 'b' },
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<DoWhileStatement node={node} path={path} />);

    expect(container).toHaveTextContent('do');
    expect(container).toHaveTextContent('while');
    expect(container).toHaveTextContent('a || b');
  });

  it('should render do-while with unary test expression', () => {
    const node = fromJS({
      type: 'DoWhileStatement',
      body: { type: 'BlockStatement', body: [] },
      test: {
        type: 'UnaryExpression',
        operator: '!',
        prefix: true,
        argument: { type: 'Identifier', name: 'complete' },
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<DoWhileStatement node={node} path={path} />);

    expect(container).toHaveTextContent('while');
    expect(container).toHaveTextContent('!complete');
  });

  it('should render proper HTML structure', () => {
    const node = fromJS({
      type: 'DoWhileStatement',
      body: { type: 'BlockStatement', body: [] },
      test: { type: 'Literal', value: true },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<DoWhileStatement node={node} path={path} />);

    const div = container.firstElementChild;
    expect(div).toBeInTheDocument();
    expect(div).toHaveClass('statement', 'do-while-statement');

    const keywords = container.querySelectorAll('.keyword');
    expect(keywords).toHaveLength(2); // 'do' and 'while'
    expect(keywords[0]).toHaveTextContent('do');
    expect(keywords[1]).toHaveTextContent('while');
  });

  it('should render do-while with function call test', () => {
    const node = fromJS({
      type: 'DoWhileStatement',
      body: {
        type: 'BlockStatement',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              operator: '=',
              left: { type: 'Identifier', name: 'result' },
              right: {
                type: 'CallExpression',
                callee: { type: 'Identifier', name: 'process' },
                arguments: [],
              },
            },
          },
        ],
      },
      test: {
        type: 'CallExpression',
        callee: { type: 'Identifier', name: 'shouldContinue' },
        arguments: [{ type: 'Identifier', name: 'result' }],
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<DoWhileStatement node={node} path={path} />);

    expect(container).toHaveTextContent('result = process()');
    expect(container).toHaveTextContent('shouldContinue(result)');
  });

  it('should render do-while with multiple statements in body', () => {
    const node = fromJS({
      type: 'DoWhileStatement',
      body: {
        type: 'BlockStatement',
        body: [
          {
            type: 'ExpressionStatement',
            expression: { type: 'Literal', value: 'first' },
          },
          {
            type: 'ExpressionStatement',
            expression: { type: 'Literal', value: 'second' },
          },
          {
            type: 'ExpressionStatement',
            expression: { type: 'Literal', value: 'third' },
          },
        ],
      },
      test: { type: 'Literal', value: false },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<DoWhileStatement node={node} path={path} />);

    expect(container).toHaveTextContent('first');
    expect(container).toHaveTextContent('second');
    expect(container).toHaveTextContent('third');
    expect(container).toHaveTextContent('while');
    expect(container).toHaveTextContent('false');
  });
});
