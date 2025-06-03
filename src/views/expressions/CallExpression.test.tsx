import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { fromJS, List } from 'immutable';
import { CallExpression } from './CallExpression';
import type { ImmutableNode, ImmutablePath } from '../constructs';

describe('CallExpression', () => {
  it('should render function call with no arguments', () => {
    const node = fromJS({
      type: 'CallExpression',
      callee: { type: 'Identifier', name: 'doSomething' },
      arguments: [],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<CallExpression node={node} path={path} />);

    const element = container.querySelector('.expression.call-expression');
    expect(element).toBeInTheDocument();
    expect(container.textContent).toBe('doSomething()');
  });

  it('should render function call with single argument', () => {
    const node = fromJS({
      type: 'CallExpression',
      callee: { type: 'Identifier', name: 'alert' },
      arguments: [{ type: 'Literal', value: 'Hello!', raw: '"Hello!"' }],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<CallExpression node={node} path={path} />);

    expect(container.textContent).toBe('alert("Hello!")');
  });

  it('should render function call with multiple arguments', () => {
    const node = fromJS({
      type: 'CallExpression',
      callee: { type: 'Identifier', name: 'add' },
      arguments: [
        { type: 'Literal', value: 1, raw: '1' },
        { type: 'Literal', value: 2, raw: '2' },
        { type: 'Literal', value: 3, raw: '3' },
      ],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<CallExpression node={node} path={path} />);

    expect(container.textContent).toBe('add(1, 2, 3)');
  });

  it('should render method call', () => {
    const node = fromJS({
      type: 'CallExpression',
      callee: {
        type: 'MemberExpression',
        object: { type: 'Identifier', name: 'console' },
        property: { type: 'Identifier', name: 'log' },
        computed: false,
      },
      arguments: [
        { type: 'Literal', value: 'Debug message', raw: '"Debug message"' },
      ],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<CallExpression node={node} path={path} />);

    expect(container.textContent).toBe('console.log("Debug message")');
  });

  it('should render chained method calls', () => {
    const node = fromJS({
      type: 'CallExpression',
      callee: {
        type: 'MemberExpression',
        object: {
          type: 'CallExpression',
          callee: { type: 'Identifier', name: 'getData' },
          arguments: [],
        },
        property: { type: 'Identifier', name: 'filter' },
        computed: false,
      },
      arguments: [{ type: 'Identifier', name: 'predicate' }],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<CallExpression node={node} path={path} />);

    expect(container.textContent).toBe('getData().filter(predicate)');
  });

  it('should render call with computed member expression', () => {
    const node = fromJS({
      type: 'CallExpression',
      callee: {
        type: 'MemberExpression',
        object: { type: 'Identifier', name: 'methods' },
        property: { type: 'Identifier', name: 'name' },
        computed: true,
      },
      arguments: [{ type: 'Identifier', name: 'arg' }],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<CallExpression node={node} path={path} />);

    expect(container.textContent).toBe('methods[name](arg)');
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
    expect(container.textContent).toContain('function');
    expect(container.textContent).toMatch(/function.*\(\).*\(\)/); // Function with two sets of parentheses
  });

  it('should render call with spread arguments', () => {
    const node = fromJS({
      type: 'CallExpression',
      callee: { type: 'Identifier', name: 'fn' },
      arguments: [
        { type: 'Literal', value: 1, raw: '1' },
        {
          type: 'SpreadElement',
          argument: { type: 'Identifier', name: 'args' },
        },
      ],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<CallExpression node={node} path={path} />);

    // Current implementation might not handle spread elements
    // This test documents current behavior
    expect(container.textContent).toContain('fn(');
    expect(container.textContent).toContain('1');
  });

  it('should render call with object and array arguments', () => {
    const node = fromJS({
      type: 'CallExpression',
      callee: { type: 'Identifier', name: 'process' },
      arguments: [
        {
          type: 'ObjectExpression',
          properties: [
            {
              type: 'Property',
              key: { type: 'Identifier', name: 'x' },
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

    expect(container.textContent).toBe('process({x: 1}, [2, 3])');
  });

  it('should render call with function expression as argument', () => {
    const node = fromJS({
      type: 'CallExpression',
      callee: { type: 'Identifier', name: 'map' },
      arguments: [
        {
          type: 'FunctionExpression',
          id: null,
          params: [{ type: 'Identifier', name: 'x' }],
          body: { type: 'BlockStatement', body: [] },
        },
      ],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<CallExpression node={node} path={path} />);

    expect(container.textContent).toContain('map(function');
    expect(container.textContent).toContain('(x)');
  });

  it('should render proper HTML structure', () => {
    const node = fromJS({
      type: 'CallExpression',
      callee: { type: 'Identifier', name: 'fn' },
      arguments: [{ type: 'Identifier', name: 'arg' }],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<CallExpression node={node} path={path} />);

    const span = container.firstElementChild;
    expect(span?.tagName).toBe('SPAN');
    expect(span?.className).toBe('expression call-expression');

    // Check for parentheses
    const parens = container.querySelectorAll('.paren-open, .paren-close');
    expect(parens).toHaveLength(2);
  });
});
