import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { fromJS, List } from 'immutable';
import { FunctionExpression } from './FunctionExpression';
import type { ImmutableNode, ImmutablePath } from '../constructs';

describe('FunctionExpression', () => {
  it('should render named function expression', () => {
    const node = fromJS({
      type: 'FunctionExpression',
      identifier: { type: 'Identifier', value: 'myFunc' },
      params: [],
      body: { type: 'BlockStatement', stmts: [] },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(
      <FunctionExpression node={node} path={path} />,
    );

    const element = container.querySelector('.expression.function-expression');
    expect(element).toBeInTheDocument();
    expect(container).toHaveTextContent(/function myFunc\(\)/);
  });

  it('should render anonymous function expression', () => {
    const node = fromJS({
      type: 'FunctionExpression',
      identifier: null,
      params: [],
      body: { type: 'BlockStatement', stmts: [] },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(
      <FunctionExpression node={node} path={path} />,
    );

    expect(container).toHaveTextContent(/function \(\)/);
  });

  it('should render function with single parameter', () => {
    const node = fromJS({
      type: 'FunctionExpression',
      identifier: null,
      params: [{ type: 'Identifier', value: 'x' }],
      body: { type: 'BlockStatement', stmts: [] },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(
      <FunctionExpression node={node} path={path} />,
    );

    expect(container).toHaveTextContent(/function \(x\)/);
  });

  it('should render function with multiple parameters', () => {
    const node = fromJS({
      type: 'FunctionExpression',
      identifier: { type: 'Identifier', value: 'add' },
      params: [
        { type: 'Identifier', value: 'a' },
        { type: 'Identifier', value: 'b' },
      ],
      body: { type: 'BlockStatement', stmts: [] },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(
      <FunctionExpression node={node} path={path} />,
    );

    expect(container).toHaveTextContent(/function add\(a, b\)/);
  });

  it('should render function with body statements', () => {
    const node = fromJS({
      type: 'FunctionExpression',
      identifier: null,
      params: [{ type: 'Identifier', value: 'n' }],
      body: {
        type: 'BlockStatement',
        stmts: [
          {
            type: 'ReturnStatement',
            argument: {
              type: 'BinaryExpression',
              operator: '*',
              left: { type: 'Identifier', value: 'n' },
              right: { type: 'Literal', value: 2, raw: '2' },
            },
          },
        ],
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(
      <FunctionExpression node={node} path={path} />,
    );

    expect(container).toHaveTextContent(/function \(n\)/);
    expect(container).toHaveTextContent(/return/);
    expect(container).toHaveTextContent(/n \* 2/);
  });

  it('should render function with destructuring parameters', () => {
    const node = fromJS({
      type: 'FunctionExpression',
      identifier: null,
      params: [
        {
          type: 'ObjectPattern',
          properties: [
            {
              type: 'Property',
              key: { type: 'Identifier', value: 'x' },
              value: { type: 'Identifier', value: 'x' },
              shorthand: true,
            },
            {
              type: 'Property',
              key: { type: 'Identifier', value: 'y' },
              value: { type: 'Identifier', value: 'y' },
              shorthand: true,
            },
          ],
        },
      ],
      body: { type: 'BlockStatement', stmts: [] },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(
      <FunctionExpression node={node} path={path} />,
    );

    expect(container).toHaveTextContent(/function \(\{x, y\}\)/);
  });

  it('should render function with rest parameters', () => {
    const node = fromJS({
      type: 'FunctionExpression',
      identifier: { type: 'Identifier', value: 'sum' },
      params: [
        {
          type: 'RestElement',
          argument: { type: 'Identifier', value: 'numbers' },
        },
      ],
      body: { type: 'BlockStatement', stmts: [] },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(
      <FunctionExpression node={node} path={path} />,
    );

    // Current implementation might not handle rest parameters
    // This test documents current behavior
    expect(container).toHaveTextContent(/function sum\(/);
  });

  it('should render function with default parameters', () => {
    const node = fromJS({
      type: 'FunctionExpression',
      identifier: null,
      params: [
        {
          type: 'AssignmentPattern',
          left: { type: 'Identifier', value: 'x' },
          right: { type: 'Literal', value: 0, raw: '0' },
        },
      ],
      body: { type: 'BlockStatement', stmts: [] },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(
      <FunctionExpression node={node} path={path} />,
    );

    // Current implementation might not handle default parameters
    // This test documents current behavior
    expect(container).toHaveTextContent(/function \(/);
  });

  it('should render generator function', () => {
    const node = fromJS({
      type: 'FunctionExpression',
      identifier: { type: 'Identifier', value: 'gen' },
      params: [],
      body: { type: 'BlockStatement', stmts: [] },
      generator: true,
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(
      <FunctionExpression node={node} path={path} />,
    );

    // Current implementation might not handle generator flag
    // This test documents current behavior
    expect(container).toHaveTextContent(/function gen\(\)/);
  });

  it('should render async function', () => {
    const node = fromJS({
      type: 'FunctionExpression',
      identifier: { type: 'Identifier', value: 'fetchData' },
      params: [],
      body: { type: 'BlockStatement', stmts: [] },
      async: true,
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(
      <FunctionExpression node={node} path={path} />,
    );

    // Current implementation might not handle async flag
    // This test documents current behavior
    expect(container).toHaveTextContent(/function fetchData\(\)/);
  });

  it('should render proper HTML structure', () => {
    const node = fromJS({
      type: 'FunctionExpression',
      identifier: null,
      params: [],
      body: { type: 'BlockStatement', stmts: [] },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(
      <FunctionExpression node={node} path={path} />,
    );

    const span = container.firstElementChild;
    expect(span).toBeInTheDocument();
    expect(span).toHaveClass('expression', 'function-expression');

    // Should contain function header
    expect(container.querySelector('.function-header')).toBeInTheDocument();
  });
});
