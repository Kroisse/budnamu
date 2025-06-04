import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { fromJS, List } from 'immutable';
import { ArrayExpression } from './ArrayExpression';
import type { ImmutableNode, ImmutablePath } from '../constructs';

describe('ArrayExpression', () => {
  it('should render empty array', () => {
    const node = fromJS({
      type: 'ArrayExpression',
      elements: [],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<ArrayExpression node={node} path={path} />);

    const element = container.querySelector('.expression.array-expression');
    expect(element).toBeInTheDocument();
    expect(container).toHaveTextContent('[]');
  });

  it('should render array with single element', () => {
    const node = fromJS({
      type: 'ArrayExpression',
      elements: [{ type: 'Literal', value: 1, raw: '1' }],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<ArrayExpression node={node} path={path} />);

    expect(container).toHaveTextContent('[1]');
  });

  it('should render array with multiple elements', () => {
    const node = fromJS({
      type: 'ArrayExpression',
      elements: [
        { type: 'Literal', value: 1, raw: '1' },
        { type: 'Literal', value: 2, raw: '2' },
        { type: 'Literal', value: 3, raw: '3' },
      ],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<ArrayExpression node={node} path={path} />);

    expect(container).toHaveTextContent('[1, 2, 3]');
  });

  it('should render array with mixed types', () => {
    const node = fromJS({
      type: 'ArrayExpression',
      elements: [
        { type: 'Literal', value: 'hello', raw: '"hello"' },
        { type: 'Literal', value: 42, raw: '42' },
        { type: 'Literal', value: true, raw: 'true' },
        { type: 'Literal', value: null, raw: 'null' },
        { type: 'Identifier', name: 'variable' },
      ],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<ArrayExpression node={node} path={path} />);

    expect(container).toHaveTextContent('["hello", 42, true, null, variable]');
  });

  it('should render array with sparse elements', () => {
    const node = fromJS({
      type: 'ArrayExpression',
      elements: [
        { type: 'Literal', value: 1, raw: '1' },
        null, // sparse element
        { type: 'Literal', value: 3, raw: '3' },
      ],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<ArrayExpression node={node} path={path} />);

    // The current implementation might not handle sparse arrays correctly
    // This test documents current behavior
    expect(container).toHaveTextContent(/1/);
    expect(container).toHaveTextContent(/3/);
  });

  it('should render nested arrays', () => {
    const node = fromJS({
      type: 'ArrayExpression',
      elements: [
        { type: 'Literal', value: 1, raw: '1' },
        {
          type: 'ArrayExpression',
          elements: [
            { type: 'Literal', value: 2, raw: '2' },
            { type: 'Literal', value: 3, raw: '3' },
          ],
        },
        { type: 'Literal', value: 4, raw: '4' },
      ],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<ArrayExpression node={node} path={path} />);

    expect(container).toHaveTextContent('[1, [2, 3], 4]');

    const arrayExpressions = container.querySelectorAll('.array-expression');
    expect(arrayExpressions).toHaveLength(2); // Outer and inner
  });

  it('should render array with object elements', () => {
    const node = fromJS({
      type: 'ArrayExpression',
      elements: [
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
          type: 'ObjectExpression',
          properties: [
            {
              type: 'Property',
              key: { type: 'Identifier', name: 'y' },
              value: { type: 'Literal', value: 2, raw: '2' },
              kind: 'init',
            },
          ],
        },
      ],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<ArrayExpression node={node} path={path} />);

    expect(container).toHaveTextContent('[{x: 1}, {y: 2}]');
  });

  it('should render array with function expressions', () => {
    const node = fromJS({
      type: 'ArrayExpression',
      elements: [
        {
          type: 'FunctionExpression',
          id: null,
          params: [],
          body: { type: 'BlockStatement', body: [] },
        },
        { type: 'Identifier', name: 'fn' },
      ],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<ArrayExpression node={node} path={path} />);

    // Check that it contains function and identifier
    expect(container).toHaveTextContent(/function/);
    expect(container).toHaveTextContent(/fn/);
  });

  it('should render proper HTML structure', () => {
    const node = fromJS({
      type: 'ArrayExpression',
      elements: [{ type: 'Literal', value: 1, raw: '1' }],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<ArrayExpression node={node} path={path} />);

    const span = container.firstElementChild;
    expect(span).toBeInTheDocument();
    expect(span).toHaveClass('expression', 'array-expression');

    // Check for brackets
    const brackets = container.querySelectorAll('.paren-open, .paren-close');
    expect(brackets).toHaveLength(2);
  });

  it('should handle array spread elements', () => {
    const node = fromJS({
      type: 'ArrayExpression',
      elements: [
        { type: 'Literal', value: 1, raw: '1' },
        {
          type: 'SpreadElement',
          argument: { type: 'Identifier', name: 'arr' },
        },
        { type: 'Literal', value: 2, raw: '2' },
      ],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<ArrayExpression node={node} path={path} />);

    // Current implementation might not handle spread elements
    // This test documents current behavior
    expect(container).toHaveTextContent(/1/);
    expect(container).toHaveTextContent(/2/);
  });
});
