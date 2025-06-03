import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Map, List } from 'immutable';
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
});
