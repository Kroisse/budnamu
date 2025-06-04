import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { fromJS, List } from 'immutable';
import { ReturnStatement } from './ReturnStatement';
import type { ImmutableNode, ImmutablePath } from '../constructs';

describe('ReturnStatement', () => {
  it('should render return statement without argument', () => {
    const node = fromJS({
      type: 'ReturnStatement',
      argument: null,
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ReturnStatement node={node} path={path} />);

    const element = container.querySelector('.statement.return-statement');
    expect(element).toBeInTheDocument();
    expect(container).toHaveTextContent('return;');
  });

  it('should render return statement with literal argument', () => {
    const node = fromJS({
      type: 'ReturnStatement',
      argument: {
        type: 'Literal',
        value: 42,
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ReturnStatement node={node} path={path} />);

    expect(container).toHaveTextContent('return 42;');
  });

  it('should render return statement with string literal', () => {
    const node = fromJS({
      type: 'ReturnStatement',
      argument: {
        type: 'Literal',
        value: 'success',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ReturnStatement node={node} path={path} />);

    expect(container).toHaveTextContent('return "success";');
  });

  it('should render return statement with identifier', () => {
    const node = fromJS({
      type: 'ReturnStatement',
      argument: {
        type: 'Identifier',
        value: 'result',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ReturnStatement node={node} path={path} />);

    expect(container).toHaveTextContent('return result;');
  });

  it('should render return statement with binary expression', () => {
    const node = fromJS({
      type: 'ReturnStatement',
      argument: {
        type: 'BinaryExpression',
        operator: '+',
        left: {
          type: 'Identifier',
          value: 'a',
        },
        right: {
          type: 'Identifier',
          value: 'b',
        },
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ReturnStatement node={node} path={path} />);

    expect(container).toHaveTextContent('return a + b;');
  });

  it('should render return statement with call expression', () => {
    const node = fromJS({
      type: 'ReturnStatement',
      argument: {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          value: 'calculate',
        },
        arguments: [
          {
            type: 'Literal',
            value: 10,
          },
        ],
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ReturnStatement node={node} path={path} />);

    expect(container).toHaveTextContent('return calculate(10);');
  });

  it('should render return statement with object expression', () => {
    const node = fromJS({
      type: 'ReturnStatement',
      argument: {
        type: 'ObjectExpression',
        properties: [
          {
            type: 'Property',
            key: { type: 'Identifier', value: 'status' },
            value: { type: 'Literal', value: 'ok' },
            kind: 'init',
          },
        ],
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ReturnStatement node={node} path={path} />);

    expect(container).toHaveTextContent('return');
    expect(container).toHaveTextContent('{');
    expect(container).toHaveTextContent('status');
    expect(container).toHaveTextContent(':');
    expect(container).toHaveTextContent('"ok"');
    expect(container).toHaveTextContent('}');
  });

  it('should render return statement with array expression', () => {
    const node = fromJS({
      type: 'ReturnStatement',
      argument: {
        type: 'ArrayExpression',
        elements: [
          { type: 'Literal', value: 1 },
          { type: 'Literal', value: 2 },
          { type: 'Literal', value: 3 },
        ],
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ReturnStatement node={node} path={path} />);

    expect(container).toHaveTextContent('return [1, 2, 3];');
  });

  it('should render return statement with conditional expression', () => {
    const node = fromJS({
      type: 'ReturnStatement',
      argument: {
        type: 'ConditionalExpression',
        test: {
          type: 'Identifier',
          value: 'condition',
        },
        consequent: {
          type: 'Literal',
          value: true,
        },
        alternate: {
          type: 'Literal',
          value: false,
        },
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ReturnStatement node={node} path={path} />);

    expect(container).toHaveTextContent('return condition ? true : false;');
  });

  it('should have proper HTML structure with argument', () => {
    const node = fromJS({
      type: 'ReturnStatement',
      argument: {
        type: 'Literal',
        value: 100,
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ReturnStatement node={node} path={path} />);

    const div = container.firstElementChild;
    expect(div).toBeInTheDocument();
    expect(div).toHaveClass('statement', 'return-statement');

    const keyword = div?.querySelector('.keyword');
    expect(keyword).toBeInTheDocument();
    expect(keyword).toHaveTextContent('return');
  });

  it('should have proper HTML structure without argument', () => {
    const node = fromJS({
      type: 'ReturnStatement',
      argument: null,
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ReturnStatement node={node} path={path} />);

    const div = container.firstElementChild;
    expect(div).toBeInTheDocument();
    expect(div).toHaveClass('statement', 'return-statement');

    const keyword = div?.querySelector('.keyword');
    expect(keyword).toBeInTheDocument();
    expect(keyword).toHaveTextContent('return');
  });

  it('should handle undefined argument', () => {
    const node = fromJS({
      type: 'ReturnStatement',
      argument: undefined,
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ReturnStatement node={node} path={path} />);

    expect(container).toHaveTextContent('return;');
  });
});
