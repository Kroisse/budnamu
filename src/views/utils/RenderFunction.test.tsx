import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Map, List, fromJS } from 'immutable';
import { RenderFunction } from './RenderFunction';
import { Context } from '../constructs';
import type { ImmutablePath } from '../constructs';

describe('RenderFunction', () => {
  it('should render function structure', () => {
    const node = Map({
      type: 'FunctionExpression',
      id: Map({ type: 'Identifier', name: 'myFunction' }),
      params: List([]),
      body: Map({ type: 'BlockStatement', body: List([]) }),
    });
    const path: ImmutablePath = List(['expression']);

    const context = new Context({ node, path });
    const { container } = render(<RenderFunction context={context} />);

    // Check that function header is rendered
    const functionHeader = container.querySelector('.function-header');
    expect(functionHeader).toBeInTheDocument();
    expect(functionHeader).toHaveTextContent('function');

    // Check that it has parentheses
    expect(container).toHaveTextContent('(');
    expect(container).toHaveTextContent(')');
  });

  it('should handle anonymous function (no id)', () => {
    const node = Map({
      type: 'FunctionExpression',
      id: null,
      params: List([]),
      body: Map({ type: 'BlockStatement', body: List([]) }),
    });
    const path: ImmutablePath = List(['expression']);

    const context = new Context({ node, path });
    const { container } = render(<RenderFunction context={context} />);

    // Check function header exists even without name
    const functionHeader = container.querySelector('.function-header');
    expect(functionHeader).toBeInTheDocument();
    expect(functionHeader).toHaveTextContent('function');
  });

  it('should render with parameters', () => {
    const node = Map({
      type: 'FunctionExpression',
      id: Map({ type: 'Identifier', name: 'add' }),
      params: List([
        Map({ type: 'Identifier', name: 'a' }),
        Map({ type: 'Identifier', name: 'b' }),
      ]),
      body: Map({ type: 'BlockStatement', body: List([]) }),
    });
    const path: ImmutablePath = List(['expression']);

    const context = new Context({ node, path });
    const { container } = render(<RenderFunction context={context} />);

    // Should have function header
    const functionHeader = container.querySelector('.function-header');
    expect(functionHeader).toBeInTheDocument();

    // Should render function name
    expect(container).toHaveTextContent('add');

    // Should render parameter names
    expect(container).toHaveTextContent('a');
    expect(container).toHaveTextContent('b');

    // Should have proper structure: function add(a, b) { }
    const text = container.textContent;
    expect(text).toMatch(/function\s+add\s*\(\s*a\s*,\s*b\s*\)/);
  });

  it('should handle arrow function expression', () => {
    const node = Map({
      type: 'ArrowFunctionExpression',
      id: null, // Arrow functions don't have ids
      params: List([Map({ type: 'Identifier', name: 'x' })]),
      body: Map({ type: 'BlockStatement', body: List([]) }),
    });
    const path: ImmutablePath = List(['expression']);

    const context = new Context({ node, path });
    const { container } = render(<RenderFunction context={context} />);

    // Arrow functions should still render with function header structure
    const functionHeader = container.querySelector('.function-header');
    expect(functionHeader).toBeInTheDocument();
  });

  it('should render with destructuring parameters', () => {
    const node = Map({
      type: 'FunctionExpression',
      id: Map({ type: 'Identifier', name: 'processData' }),
      params: List([
        Map({
          type: 'ObjectPattern',
          properties: List([
            Map({
              type: 'Property',
              key: Map({ type: 'Identifier', name: 'name' }),
              value: Map({ type: 'Identifier', name: 'name' }),
            }),
          ]),
        }),
      ]),
      body: Map({ type: 'BlockStatement', body: List([]) }),
    });
    const path: ImmutablePath = List(['expression']);

    const context = new Context({ node, path });
    const { container } = render(<RenderFunction context={context} />);

    // Should render function header
    expect(container.querySelector('.function-header')).toBeInTheDocument();
  });

  it('should handle different node paths', () => {
    const node = Map({
      type: 'FunctionExpression',
      id: Map({ type: 'Identifier', name: 'test' }),
      params: List([]),
      body: Map({ type: 'BlockStatement', body: List([]) }),
    });

    const paths: ImmutablePath[] = [
      List(['expression']),
      List(['body', 'expression']),
      List(['declarations', 0, 'init']),
    ];

    paths.forEach((path) => {
      const context = new Context({ node, path });
      const { container } = render(<RenderFunction context={context} />);
      expect(container.querySelector('.function-header')).toBeInTheDocument();
    });
  });

  it('should render function body with statements', () => {
    // fromJS()를 사용하여 복잡한 JavaScript object를 한 번에 Immutable로 변환
    const node = fromJS({
      type: 'FunctionExpression',
      id: { type: 'Identifier', name: 'greet' },
      params: [{ type: 'Identifier', name: 'name' }],
      body: {
        type: 'BlockStatement',
        body: [
          {
            type: 'ReturnStatement',
            argument: {
              type: 'BinaryExpression',
              operator: '+',
              left: {
                type: 'Literal',
                value: 'Hello, ',
                raw: '"Hello, "',
              },
              right: { type: 'Identifier', name: 'name' },
            },
          },
        ],
      },
    });
    const path: ImmutablePath = List(['expression']);

    const context = new Context({ node, path });
    const { container } = render(<RenderFunction context={context} />);

    // Should render function structure
    expect(container).toHaveTextContent('function');
    expect(container).toHaveTextContent('greet');
    expect(container).toHaveTextContent('name');

    // Should render body content
    expect(container).toHaveTextContent('return');
    expect(container).toHaveTextContent('Hello, ');
    expect(container).toHaveTextContent('+');

    // Check overall structure
    const text = container.textContent;
    expect(text).toContain('function greet(name)');
    expect(text).toContain('{');
    expect(text).toContain('}');
  });

  it('should render arrow function with expression body', () => {
    // fromJS()로 더 간단하게 작성
    const node = fromJS({
      type: 'ArrowFunctionExpression',
      id: null,
      params: [{ type: 'Identifier', name: 'x' }],
      body: {
        type: 'BinaryExpression',
        operator: '*',
        left: { type: 'Identifier', name: 'x' },
        right: { type: 'Literal', value: 2, raw: '2' },
      },
    });
    const path: ImmutablePath = List(['expression']);

    const context = new Context({ node, path });
    const { container } = render(<RenderFunction context={context} />);

    // Should render parameters
    expect(container).toHaveTextContent('x');

    // Should render body expression
    expect(container).toHaveTextContent('*');
    expect(container).toHaveTextContent('2');
  });
});
