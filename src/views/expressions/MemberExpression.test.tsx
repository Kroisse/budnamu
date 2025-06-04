import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { fromJS, List } from 'immutable';
import { MemberExpression } from './MemberExpression';
import type { ImmutableNode, ImmutablePath } from '../constructs';

describe('MemberExpression', () => {
  it('should render dot notation member access', () => {
    const node = fromJS({
      type: 'MemberExpression',
      object: { type: 'Identifier', value: 'obj' },
      property: { type: 'Identifier', value: 'prop' },
      computed: false,
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<MemberExpression node={node} path={path} />);

    const element = container.querySelector('.expression.member-expression');
    expect(element).toBeInTheDocument();
    expect(container).toHaveTextContent('obj.prop');

    const operator = container.querySelector('.operator');
    expect(operator).toBeInTheDocument();
    expect(operator).toHaveTextContent('.');
  });

  it('should render bracket notation member access', () => {
    const node = fromJS({
      type: 'MemberExpression',
      object: { type: 'Identifier', value: 'arr' },
      property: { type: 'Literal', value: 0, raw: '0' },
      computed: true,
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<MemberExpression node={node} path={path} />);

    expect(container).toHaveTextContent('arr[0]');

    // Should have brackets instead of dot
    expect(container.querySelector('.operator')).not.toBeInTheDocument();
    const brackets = container.querySelectorAll('.paren-open, .paren-close');
    expect(brackets).toHaveLength(2);
  });

  it('should render computed property with string', () => {
    const node = fromJS({
      type: 'MemberExpression',
      object: { type: 'Identifier', value: 'obj' },
      property: {
        type: 'Literal',
        value: 'key-with-dash',
        raw: '"key-with-dash"',
      },
      computed: true,
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<MemberExpression node={node} path={path} />);

    expect(container).toHaveTextContent('obj["key-with-dash"]');
  });

  it('should render computed property with identifier', () => {
    const node = fromJS({
      type: 'MemberExpression',
      object: { type: 'Identifier', value: 'obj' },
      property: { type: 'Identifier', value: 'key' },
      computed: true,
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<MemberExpression node={node} path={path} />);

    expect(container).toHaveTextContent('obj[key]');
  });

  it('should render chained member access', () => {
    const node = fromJS({
      type: 'MemberExpression',
      object: {
        type: 'MemberExpression',
        object: { type: 'Identifier', value: 'a' },
        property: { type: 'Identifier', value: 'b' },
        computed: false,
      },
      property: { type: 'Identifier', value: 'c' },
      computed: false,
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<MemberExpression node={node} path={path} />);

    expect(container).toHaveTextContent('a.b.c');

    const memberExpressions = container.querySelectorAll('.member-expression');
    expect(memberExpressions).toHaveLength(2); // Outer and inner
  });

  it('should render member access on function call', () => {
    const node = fromJS({
      type: 'MemberExpression',
      object: {
        type: 'CallExpression',
        callee: { type: 'Identifier', value: 'getObject' },
        arguments: [],
      },
      property: { type: 'Identifier', value: 'prop' },
      computed: false,
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<MemberExpression node={node} path={path} />);

    expect(container).toHaveTextContent('getObject().prop');
  });

  it('should render member access on literal', () => {
    const node = fromJS({
      type: 'MemberExpression',
      object: { type: 'Literal', value: 'string', raw: '"string"' },
      property: { type: 'Identifier', value: 'length' },
      computed: false,
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<MemberExpression node={node} path={path} />);

    expect(container).toHaveTextContent('"string".length');
  });

  it('should render member access on array', () => {
    const node = fromJS({
      type: 'MemberExpression',
      object: {
        type: 'ArrayExpression',
        elements: [
          { type: 'Literal', value: 1, raw: '1' },
          { type: 'Literal', value: 2, raw: '2' },
        ],
      },
      property: { type: 'Identifier', value: 'length' },
      computed: false,
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<MemberExpression node={node} path={path} />);

    expect(container).toHaveTextContent('[1, 2].length');
  });

  it('should render computed property with expression', () => {
    const node = fromJS({
      type: 'MemberExpression',
      object: { type: 'Identifier', value: 'arr' },
      property: {
        type: 'BinaryExpression',
        operator: '+',
        left: { type: 'Identifier', value: 'i' },
        right: { type: 'Literal', value: 1, raw: '1' },
      },
      computed: true,
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<MemberExpression node={node} path={path} />);

    expect(container).toHaveTextContent('arr[i + 1]');
  });

  it('should render mixed dot and bracket notation', () => {
    const node = fromJS({
      type: 'MemberExpression',
      object: {
        type: 'MemberExpression',
        object: { type: 'Identifier', value: 'data' },
        property: { type: 'Literal', value: 'items', raw: '"items"' },
        computed: true,
      },
      property: { type: 'Identifier', value: 'first' },
      computed: false,
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<MemberExpression node={node} path={path} />);

    expect(container).toHaveTextContent('data["items"].first');
  });

  it('should render proper HTML structure', () => {
    const node = fromJS({
      type: 'MemberExpression',
      object: { type: 'Identifier', value: 'obj' },
      property: { type: 'Identifier', value: 'prop' },
      computed: false,
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<MemberExpression node={node} path={path} />);

    const span = container.firstElementChild;
    expect(span).toBeInTheDocument();
    expect(span).toHaveClass('expression', 'member-expression');
  });
});
