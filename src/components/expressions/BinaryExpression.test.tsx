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
        value: 'x',
      },
      right: {
        type: 'Identifier',
        value: 'y',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<BinaryExpression node={node} path={path} />);

    expect(container).toHaveTextContent('x - y');
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

    expect(container).toHaveTextContent('3 * 4');
  });

  it('should render division expression', () => {
    const node = fromJS({
      type: 'BinaryExpression',
      operator: '/',
      left: {
        type: 'Identifier',
        value: 'total',
      },
      right: {
        type: 'Identifier',
        value: 'count',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<BinaryExpression node={node} path={path} />);

    expect(container).toHaveTextContent('total / count');
  });

  it('should render comparison operators', () => {
    const operators = ['>', '<', '>=', '<=', '==', '!=', '===', '!=='];

    operators.forEach((op) => {
      const node = fromJS({
        type: 'BinaryExpression',
        operator: op,
        left: {
          type: 'Identifier',
          value: 'a',
        },
        right: {
          type: 'Identifier',
          value: 'b',
        },
      }) as ImmutableNode;
      const path: ImmutablePath = List(['expression']);

      const { container } = render(
        <BinaryExpression node={node} path={path} />,
      );

      expect(container).toHaveTextContent(`a ${op} b`);
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

      expect(container).toHaveTextContent(`5 ${op} 3`);
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

    expect(container).toHaveTextContent('2 * 3 + 4');

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
        value: 'name',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<BinaryExpression node={node} path={path} />);

    expect(container).toHaveTextContent('"Hello, " + name');
  });

  it('should render modulo operator', () => {
    const node = fromJS({
      type: 'BinaryExpression',
      operator: '%',
      left: {
        type: 'Identifier',
        value: 'num',
      },
      right: {
        type: 'Literal',
        value: 2,
        raw: '2',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<BinaryExpression node={node} path={path} />);

    expect(container).toHaveTextContent('num % 2');
  });

  it('should render instanceof operator', () => {
    const node = fromJS({
      type: 'BinaryExpression',
      operator: 'instanceof',
      left: {
        type: 'Identifier',
        value: 'obj',
      },
      right: {
        type: 'Identifier',
        value: 'Array',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<BinaryExpression node={node} path={path} />);

    expect(container).toHaveTextContent('obj instanceof Array');
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
        value: 'object',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<BinaryExpression node={node} path={path} />);

    expect(container).toHaveTextContent('"prop" in object');
  });
});
