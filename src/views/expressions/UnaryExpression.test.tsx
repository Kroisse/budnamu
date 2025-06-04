import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { fromJS, List } from 'immutable';
import { UnaryExpression } from './UnaryExpression';
import type { ImmutableNode, ImmutablePath } from '../constructs';

describe('UnaryExpression', () => {
  it('should render prefix negation operator', () => {
    const node = fromJS({
      type: 'UnaryExpression',
      operator: '-',
      prefix: true,
      argument: {
        type: 'Literal',
        value: 5,
        raw: '5',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<UnaryExpression node={node} path={path} />);

    const element = container.querySelector('.expression.unary-expression');
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('-5');

    const operator = container.querySelector('.operator');
    expect(operator).toBeInTheDocument();
    expect(operator).toHaveTextContent('-');
  });

  it('should render prefix plus operator', () => {
    const node = fromJS({
      type: 'UnaryExpression',
      operator: '+',
      prefix: true,
      argument: {
        type: 'Identifier',
        name: 'x',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<UnaryExpression node={node} path={path} />);

    expect(container).toHaveTextContent('+x');
  });

  it('should render prefix logical NOT operator', () => {
    const node = fromJS({
      type: 'UnaryExpression',
      operator: '!',
      prefix: true,
      argument: {
        type: 'Identifier',
        name: 'isValid',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<UnaryExpression node={node} path={path} />);

    expect(container).toHaveTextContent('!isValid');
  });

  it('should render bitwise NOT operator', () => {
    const node = fromJS({
      type: 'UnaryExpression',
      operator: '~',
      prefix: true,
      argument: {
        type: 'Literal',
        value: 10,
        raw: '10',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<UnaryExpression node={node} path={path} />);

    expect(container).toHaveTextContent('~10');
  });

  it('should render typeof operator with keyword class', () => {
    const node = fromJS({
      type: 'UnaryExpression',
      operator: 'typeof',
      prefix: true,
      argument: {
        type: 'Identifier',
        name: 'value',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<UnaryExpression node={node} path={path} />);

    expect(container).toHaveTextContent('typeof value');

    const operator = container.querySelector('.keyword.operator');
    expect(operator).toBeInTheDocument();
    expect(operator).toHaveTextContent('typeof');
  });

  it('should render delete operator', () => {
    const node = fromJS({
      type: 'UnaryExpression',
      operator: 'delete',
      prefix: true,
      argument: {
        type: 'MemberExpression',
        object: {
          type: 'Identifier',
          name: 'obj',
        },
        property: {
          type: 'Identifier',
          name: 'prop',
        },
        computed: false,
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<UnaryExpression node={node} path={path} />);

    expect(container).toHaveTextContent('deleteobj.prop');
  });

  it('should render void operator', () => {
    const node = fromJS({
      type: 'UnaryExpression',
      operator: 'void',
      prefix: true,
      argument: {
        type: 'Literal',
        value: 0,
        raw: '0',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<UnaryExpression node={node} path={path} />);

    expect(container).toHaveTextContent('void0');
  });

  it('should render postfix increment operator', () => {
    const node = fromJS({
      type: 'UnaryExpression',
      operator: '++',
      prefix: false,
      argument: {
        type: 'Identifier',
        name: 'i',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<UnaryExpression node={node} path={path} />);

    expect(container).toHaveTextContent('i++');

    // Operator should come after the argument
    const operator = container.querySelector('.operator');
    expect(operator).toBeInTheDocument();
    expect(operator?.previousSibling).toHaveTextContent('i');
  });

  it('should render postfix decrement operator', () => {
    const node = fromJS({
      type: 'UnaryExpression',
      operator: '--',
      prefix: false,
      argument: {
        type: 'Identifier',
        name: 'count',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<UnaryExpression node={node} path={path} />);

    expect(container).toHaveTextContent('count--');
  });

  it('should render nested unary expressions', () => {
    const node = fromJS({
      type: 'UnaryExpression',
      operator: '!',
      prefix: true,
      argument: {
        type: 'UnaryExpression',
        operator: '!',
        prefix: true,
        argument: {
          type: 'Identifier',
          name: 'flag',
        },
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<UnaryExpression node={node} path={path} />);

    expect(container).toHaveTextContent('!!flag');

    // Check nested structure
    const unaryExpressions = container.querySelectorAll('.unary-expression');
    expect(unaryExpressions).toHaveLength(2); // Outer and inner
  });

  it('should handle complex argument expressions', () => {
    const node = fromJS({
      type: 'UnaryExpression',
      operator: '-',
      prefix: true,
      argument: {
        type: 'BinaryExpression',
        operator: '+',
        left: {
          type: 'Identifier',
          name: 'a',
        },
        right: {
          type: 'Identifier',
          name: 'b',
        },
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<UnaryExpression node={node} path={path} />);

    expect(container).toHaveTextContent('-a + b');
  });
});
