import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { fromJS, List } from 'immutable';
import { ObjectExpression } from './ObjectExpression';
import type { ImmutableNode, ImmutablePath } from '../constructs';

describe('ObjectExpression', () => {
  it('should render empty object', () => {
    const node = fromJS({
      type: 'ObjectExpression',
      properties: [],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<ObjectExpression node={node} path={path} />);

    const element = container.querySelector('.expression.object-expression');
    expect(element).toBeInTheDocument();
    expect(container).toHaveTextContent('{}');
  });

  it('should render object with single property', () => {
    const node = fromJS({
      type: 'ObjectExpression',
      properties: [
        {
          type: 'Property',
          key: { type: 'Identifier', name: 'name' },
          value: { type: 'Literal', value: 'John', raw: '"John"' },
          kind: 'init',
        },
      ],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<ObjectExpression node={node} path={path} />);

    expect(container).toHaveTextContent('{name: "John"}');

    const property = container.querySelector('.property');
    expect(property).toBeInTheDocument();
    expect(property).toHaveTextContent('name: "John"');
  });

  it('should render object with multiple properties', () => {
    const node = fromJS({
      type: 'ObjectExpression',
      properties: [
        {
          type: 'Property',
          key: { type: 'Identifier', name: 'x' },
          value: { type: 'Literal', value: 1, raw: '1' },
          kind: 'init',
        },
        {
          type: 'Property',
          key: { type: 'Identifier', name: 'y' },
          value: { type: 'Literal', value: 2, raw: '2' },
          kind: 'init',
        },
        {
          type: 'Property',
          key: { type: 'Identifier', name: 'z' },
          value: { type: 'Literal', value: 3, raw: '3' },
          kind: 'init',
        },
      ],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<ObjectExpression node={node} path={path} />);

    expect(container).toHaveTextContent('{x: 1, y: 2, z: 3}');

    const properties = container.querySelectorAll('.property');
    expect(properties).toHaveLength(3);
  });

  it('should render object with string literal keys', () => {
    const node = fromJS({
      type: 'ObjectExpression',
      properties: [
        {
          type: 'Property',
          key: { type: 'Literal', value: 'hello world', raw: '"hello world"' },
          value: { type: 'Literal', value: 123, raw: '123' },
          kind: 'init',
        },
        {
          type: 'Property',
          key: { type: 'Literal', value: 'with-dash', raw: '"with-dash"' },
          value: { type: 'Identifier', name: 'value' },
          kind: 'init',
        },
      ],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<ObjectExpression node={node} path={path} />);

    expect(container).toHaveTextContent(
      '{"hello world": 123, "with-dash": value}',
    );
  });

  it('should render object with computed property keys', () => {
    const node = fromJS({
      type: 'ObjectExpression',
      properties: [
        {
          type: 'Property',
          key: { type: 'Identifier', name: 'key' },
          value: { type: 'Literal', value: 'value', raw: '"value"' },
          computed: true,
          kind: 'init',
        },
      ],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<ObjectExpression node={node} path={path} />);

    // Note: The current implementation doesn't handle computed properties differently
    // This test documents current behavior
    expect(container).toHaveTextContent('{key: "value"}');
  });

  it('should render object with method shorthand', () => {
    const node = fromJS({
      type: 'ObjectExpression',
      properties: [
        {
          type: 'Property',
          key: { type: 'Identifier', name: 'method' },
          value: {
            type: 'FunctionExpression',
            id: null,
            params: [],
            body: { type: 'BlockStatement', body: [] },
          },
          kind: 'init',
          method: true,
        },
      ],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<ObjectExpression node={node} path={path} />);

    // Current implementation renders as regular property
    expect(container).toHaveTextContent(/method:/);
  });

  it('should render object with getter/setter', () => {
    const node = fromJS({
      type: 'ObjectExpression',
      properties: [
        {
          type: 'Property',
          key: { type: 'Identifier', name: 'prop' },
          value: {
            type: 'FunctionExpression',
            id: null,
            params: [],
            body: { type: 'BlockStatement', body: [] },
          },
          kind: 'get',
        },
        {
          type: 'Property',
          key: { type: 'Identifier', name: 'prop' },
          value: {
            type: 'FunctionExpression',
            id: null,
            params: [{ type: 'Identifier', name: 'val' }],
            body: { type: 'BlockStatement', body: [] },
          },
          kind: 'set',
        },
      ],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<ObjectExpression node={node} path={path} />);

    // Current implementation doesn't distinguish getters/setters
    const properties = container.querySelectorAll('.property');
    expect(properties).toHaveLength(2);
  });

  it('should render nested objects', () => {
    const node = fromJS({
      type: 'ObjectExpression',
      properties: [
        {
          type: 'Property',
          key: { type: 'Identifier', name: 'outer' },
          value: {
            type: 'ObjectExpression',
            properties: [
              {
                type: 'Property',
                key: { type: 'Identifier', name: 'inner' },
                value: { type: 'Literal', value: true, raw: 'true' },
                kind: 'init',
              },
            ],
          },
          kind: 'init',
        },
      ],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<ObjectExpression node={node} path={path} />);

    expect(container).toHaveTextContent('{outer: {inner: true}}');

    const objectExpressions = container.querySelectorAll('.object-expression');
    expect(objectExpressions).toHaveLength(2); // Outer and inner
  });

  it('should render proper HTML structure', () => {
    const node = fromJS({
      type: 'ObjectExpression',
      properties: [
        {
          type: 'Property',
          key: { type: 'Identifier', name: 'a' },
          value: { type: 'Literal', value: 1, raw: '1' },
          kind: 'init',
        },
      ],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<ObjectExpression node={node} path={path} />);

    const span = container.firstElementChild;
    expect(span).toBeInTheDocument();
    expect(span).toHaveClass('expression', 'object-expression');

    // Check for braces
    const braces = container.querySelectorAll('.paren-open, .paren-close');
    expect(braces).toHaveLength(2);
  });

  it('should handle object with boolean/null values', () => {
    const node = fromJS({
      type: 'ObjectExpression',
      properties: [
        {
          type: 'Property',
          key: { type: 'Identifier', name: 'isActive' },
          value: { type: 'Literal', value: true, raw: 'true' },
          kind: 'init',
        },
        {
          type: 'Property',
          key: { type: 'Identifier', name: 'data' },
          value: { type: 'Literal', value: null, raw: 'null' },
          kind: 'init',
        },
      ],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<ObjectExpression node={node} path={path} />);

    expect(container).toHaveTextContent('{isActive: true, data: null}');
  });
});
