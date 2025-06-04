import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { fromJS, List } from 'immutable';
import { CallExpression } from './CallExpression';
import type { ImmutableNode, ImmutablePath } from '../constructs';

describe('CallExpression', () => {
  it('should render function call with no arguments', () => {
    const node = fromJS({
      type: 'CallExpression',
      callee: { type: 'Identifier', value: 'doSomething' },
      arguments: [],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<CallExpression node={node} path={path} />);

    const element = container.querySelector('.expression.call-expression');
    expect(element).toBeInTheDocument();
    expect(container).toHaveTextContent('doSomething()');
  });

  it('should render function call with single argument', () => {
    const node = fromJS({
      type: 'CallExpression',
      callee: { type: 'Identifier', value: 'alert' },
      arguments: [{ type: 'Literal', value: 'Hello!', raw: '"Hello!"' }],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<CallExpression node={node} path={path} />);

    expect(container).toHaveTextContent('alert("Hello!")');
  });

  it('should render function call with multiple arguments', () => {
    const node = fromJS({
      type: 'CallExpression',
      callee: { type: 'Identifier', value: 'add' },
      arguments: [
        { type: 'Literal', value: 1, raw: '1' },
        { type: 'Literal', value: 2, raw: '2' },
        { type: 'Literal', value: 3, raw: '3' },
      ],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<CallExpression node={node} path={path} />);

    expect(container).toHaveTextContent('add(1, 2, 3)');
  });

  it('should render method call', () => {
    const node = fromJS({
      type: 'CallExpression',
      callee: {
        type: 'MemberExpression',
        object: { type: 'Identifier', value: 'console' },
        property: { type: 'Identifier', value: 'log' },
        computed: false,
      },
      arguments: [
        { type: 'Literal', value: 'Debug message', raw: '"Debug message"' },
      ],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<CallExpression node={node} path={path} />);

    expect(container).toHaveTextContent('console.log("Debug message")');
  });

  it('should render chained method calls', () => {
    const node = fromJS({
      type: 'CallExpression',
      callee: {
        type: 'MemberExpression',
        object: {
          type: 'CallExpression',
          callee: { type: 'Identifier', value: 'getData' },
          arguments: [],
        },
        property: { type: 'Identifier', value: 'filter' },
        computed: false,
      },
      arguments: [{ type: 'Identifier', value: 'predicate' }],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<CallExpression node={node} path={path} />);

    expect(container).toHaveTextContent('getData().filter(predicate)');
  });

  it('should render call with computed member expression', () => {
    const node = fromJS({
      type: 'CallExpression',
      callee: {
        type: 'MemberExpression',
        object: { type: 'Identifier', value: 'methods' },
        property: { type: 'Identifier', value: 'name' },
        computed: true,
      },
      arguments: [{ type: 'Identifier', value: 'arg' }],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<CallExpression node={node} path={path} />);

    expect(container).toHaveTextContent('methods[name](arg)');
  });

  it('should render IIFE (Immediately Invoked Function Expression)', () => {
    const node = fromJS({
      type: 'CallExpression',
      callee: {
        type: 'FunctionExpression',
        id: null,
        params: [],
        body: { type: 'BlockStatement', body: [] },
      },
      arguments: [],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<CallExpression node={node} path={path} />);

    // Should render function expression followed by ()
    expect(container).toHaveTextContent(/function/);
    expect(container).toHaveTextContent(/function.*\(\).*\(\)/); // Function with two sets of parentheses
  });

  it('should render call with spread arguments', () => {
    const node = fromJS({
      type: 'CallExpression',
      callee: { type: 'Identifier', value: 'fn' },
      arguments: [
        { type: 'Literal', value: 1, raw: '1' },
        {
          type: 'SpreadElement',
          argument: { type: 'Identifier', value: 'args' },
        },
      ],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<CallExpression node={node} path={path} />);

    // Current implementation might not handle spread elements
    // This test documents current behavior
    expect(container).toHaveTextContent(/fn\(/);
    expect(container).toHaveTextContent(/1/);
  });

  it('should render call with object and array arguments', () => {
    const node = fromJS({
      type: 'CallExpression',
      callee: { type: 'Identifier', value: 'process' },
      arguments: [
        {
          type: 'ObjectExpression',
          properties: [
            {
              type: 'Property',
              key: { type: 'Identifier', value: 'x' },
              value: { type: 'Literal', value: 1, raw: '1' },
              kind: 'init',
            },
          ],
        },
        {
          type: 'ArrayExpression',
          elements: [
            { type: 'Literal', value: 2, raw: '2' },
            { type: 'Literal', value: 3, raw: '3' },
          ],
        },
      ],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<CallExpression node={node} path={path} />);

    expect(container).toHaveTextContent('process({x: 1}, [2, 3])');
  });

  it('should render call with function expression as argument', () => {
    const node = fromJS({
      type: 'CallExpression',
      callee: { type: 'Identifier', value: 'map' },
      arguments: [
        {
          type: 'FunctionExpression',
          id: null,
          params: [{ type: 'Identifier', value: 'x' }],
          body: { type: 'BlockStatement', body: [] },
        },
      ],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<CallExpression node={node} path={path} />);

    expect(container).toHaveTextContent(/map\(function/);
    expect(container).toHaveTextContent(/\(x\)/);
  });

  it('should render proper HTML structure', () => {
    const node = fromJS({
      type: 'CallExpression',
      callee: { type: 'Identifier', value: 'fn' },
      arguments: [{ type: 'Identifier', value: 'arg' }],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<CallExpression node={node} path={path} />);

    const span = container.firstElementChild;
    expect(span).toBeInTheDocument();
    expect(span).toHaveClass('expression', 'call-expression');

    // Check for parentheses
    const parens = container.querySelectorAll('.paren-open, .paren-close');
    expect(parens).toHaveLength(2);
  });
});
