import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { fromJS, List } from 'immutable';
import { BinaryExpression } from './BinaryExpression';
import type { ImmutableNode, ImmutablePath } from '../constructs';

describe('BinaryExpression', () => {
  it('should render addition expression', () => {
    const node = fromJS({
      type: 'BinaryExpression',
      operator: '+',
      left: {
        type: 'Literal',
        value: 1,
        raw: '1',
      },
      right: {
        type: 'Literal',
        value: 2,
        raw: '2',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<BinaryExpression node={node} path={path} />);

    const element = container.querySelector('.expression.binary-expression');
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('1 + 2');

    const operator = container.querySelector('.operator');
    expect(operator).toBeInTheDocument();
    expect(operator).toHaveTextContent('+');
  });

  it('should render subtraction expression', () => {
    const node = fromJS({
      type: 'BinaryExpression',
      operator: '-',
      left: {
        type: 'Identifier',
        name: 'x',
      },
      right: {
        type: 'Identifier',
        name: 'y',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<BinaryExpression node={node} path={path} />);

    expect(container.textContent).toBe('x - y');
  });

  it('should render multiplication expression', () => {
    const node = fromJS({
      type: 'BinaryExpression',
      operator: '*',
      left: {
        type: 'Literal',
        value: 3,
        raw: '3',
      },
      right: {
        type: 'Literal',
        value: 4,
        raw: '4',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<BinaryExpression node={node} path={path} />);

    expect(container.textContent).toBe('3 * 4');
  });

  it('should render division expression', () => {
    const node = fromJS({
      type: 'BinaryExpression',
      operator: '/',
      left: {
        type: 'Identifier',
        name: 'total',
      },
      right: {
        type: 'Identifier',
        name: 'count',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<BinaryExpression node={node} path={path} />);

    expect(container.textContent).toBe('total / count');
  });

  it('should render comparison operators', () => {
    const operators = ['>', '<', '>=', '<=', '==', '!=', '===', '!=='];

    operators.forEach((op) => {
      const node = fromJS({
        type: 'BinaryExpression',
        operator: op,
        left: {
          type: 'Identifier',
          name: 'a',
        },
        right: {
          type: 'Identifier',
          name: 'b',
        },
      }) as ImmutableNode;
      const path: ImmutablePath = List(['expression']);

      const { container } = render(
        <BinaryExpression node={node} path={path} />,
      );

      expect(container.textContent).toBe(`a ${op} b`);
      expect(container.querySelector('.operator')).toHaveTextContent(op);
    });
  });

  it('should render bitwise operators', () => {
    const operators = ['&', '|', '^', '<<', '>>', '>>>'];

    operators.forEach((op) => {
      const node = fromJS({
        type: 'BinaryExpression',
        operator: op,
        left: {
          type: 'Literal',
          value: 5,
          raw: '5',
        },
        right: {
          type: 'Literal',
          value: 3,
          raw: '3',
        },
      }) as ImmutableNode;
      const path: ImmutablePath = List(['expression']);

      const { container } = render(
        <BinaryExpression node={node} path={path} />,
      );

      expect(container.textContent).toBe(`5 ${op} 3`);
    });
  });

  it('should render nested binary expressions', () => {
    const node = fromJS({
      type: 'BinaryExpression',
      operator: '+',
      left: {
        type: 'BinaryExpression',
        operator: '*',
        left: {
          type: 'Literal',
          value: 2,
          raw: '2',
        },
        right: {
          type: 'Literal',
          value: 3,
          raw: '3',
        },
      },
      right: {
        type: 'Literal',
        value: 4,
        raw: '4',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<BinaryExpression node={node} path={path} />);

    expect(container.textContent).toBe('2 * 3 + 4');

    // Check nested structure
    const binaryExpressions = container.querySelectorAll('.binary-expression');
    expect(binaryExpressions).toHaveLength(2); // Outer and inner
  });

  it('should render string concatenation', () => {
    const node = fromJS({
      type: 'BinaryExpression',
      operator: '+',
      left: {
        type: 'Literal',
        value: 'Hello, ',
        raw: '"Hello, "',
      },
      right: {
        type: 'Identifier',
        name: 'name',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<BinaryExpression node={node} path={path} />);

    expect(container.textContent).toBe('"Hello, " + name');
  });

  it('should render modulo operator', () => {
    const node = fromJS({
      type: 'BinaryExpression',
      operator: '%',
      left: {
        type: 'Identifier',
        name: 'num',
      },
      right: {
        type: 'Literal',
        value: 2,
        raw: '2',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<BinaryExpression node={node} path={path} />);

    expect(container.textContent).toBe('num % 2');
  });

  it('should render instanceof operator', () => {
    const node = fromJS({
      type: 'BinaryExpression',
      operator: 'instanceof',
      left: {
        type: 'Identifier',
        name: 'obj',
      },
      right: {
        type: 'Identifier',
        name: 'Array',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<BinaryExpression node={node} path={path} />);

    expect(container.textContent).toBe('obj instanceof Array');
  });

  it('should render in operator', () => {
    const node = fromJS({
      type: 'BinaryExpression',
      operator: 'in',
      left: {
        type: 'Literal',
        value: 'prop',
        raw: '"prop"',
      },
      right: {
        type: 'Identifier',
        name: 'object',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<BinaryExpression node={node} path={path} />);

    expect(container.textContent).toBe('"prop" in object');
  });
});
