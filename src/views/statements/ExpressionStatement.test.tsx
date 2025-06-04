import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { fromJS, List } from 'immutable';
import { ExpressionStatement } from './ExpressionStatement';
import type { ImmutableNode, ImmutablePath } from '../constructs';

describe('ExpressionStatement', () => {
  it('should render literal expression statement', () => {
    const node = fromJS({
      type: 'ExpressionStatement',
      expression: {
        type: 'Literal',
        value: 42,
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(
      <ExpressionStatement node={node} path={path} />,
    );

    const element = container.querySelector('.statement.expression-statement');
    expect(element).toBeInTheDocument();
    expect(container).toHaveTextContent('42;');
  });

  it('should render string literal expression statement', () => {
    const node = fromJS({
      type: 'ExpressionStatement',
      expression: {
        type: 'Literal',
        value: 'hello world',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(
      <ExpressionStatement node={node} path={path} />,
    );

    expect(container).toHaveTextContent('"hello world";');
  });

  it('should render identifier expression statement', () => {
    const node = fromJS({
      type: 'ExpressionStatement',
      expression: {
        type: 'Identifier',
        name: 'myVariable',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(
      <ExpressionStatement node={node} path={path} />,
    );

    expect(container).toHaveTextContent('myVariable;');
  });

  it('should render call expression statement', () => {
    const node = fromJS({
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: {
          type: 'MemberExpression',
          object: { type: 'Identifier', name: 'console' },
          property: { type: 'Identifier', name: 'log' },
          computed: false,
        },
        arguments: [
          {
            type: 'Literal',
            value: 'test',
          },
        ],
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(
      <ExpressionStatement node={node} path={path} />,
    );

    expect(container).toHaveTextContent('console.log');
    expect(container).toHaveTextContent('"test"');
    expect(container).toHaveTextContent(';');
  });

  it('should render assignment expression statement', () => {
    const node = fromJS({
      type: 'ExpressionStatement',
      expression: {
        type: 'AssignmentExpression',
        operator: '=',
        left: {
          type: 'Identifier',
          name: 'x',
        },
        right: {
          type: 'Literal',
          value: 10,
        },
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(
      <ExpressionStatement node={node} path={path} />,
    );

    expect(container).toHaveTextContent('x = 10;');
  });

  it('should render update expression statement', () => {
    const node = fromJS({
      type: 'ExpressionStatement',
      expression: {
        type: 'UpdateExpression',
        operator: '++',
        argument: {
          type: 'Identifier',
          name: 'i',
        },
        prefix: false,
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(
      <ExpressionStatement node={node} path={path} />,
    );

    expect(container).toHaveTextContent('i++;');
  });

  it('should render binary expression statement', () => {
    const node = fromJS({
      type: 'ExpressionStatement',
      expression: {
        type: 'BinaryExpression',
        operator: '+',
        left: {
          type: 'Literal',
          value: 1,
        },
        right: {
          type: 'Literal',
          value: 2,
        },
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(
      <ExpressionStatement node={node} path={path} />,
    );

    expect(container).toHaveTextContent('1 + 2;');
  });

  it('should render member expression statement', () => {
    const node = fromJS({
      type: 'ExpressionStatement',
      expression: {
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
    const path: ImmutablePath = List(['statement']);

    const { container } = render(
      <ExpressionStatement node={node} path={path} />,
    );

    expect(container).toHaveTextContent('obj.prop;');
  });

  it('should have proper HTML structure', () => {
    const node = fromJS({
      type: 'ExpressionStatement',
      expression: {
        type: 'Literal',
        value: true,
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(
      <ExpressionStatement node={node} path={path} />,
    );

    const div = container.firstElementChild;
    expect(div).toBeInTheDocument();
    expect(div).toHaveClass('statement', 'expression-statement');
  });

  it('should render complex nested expression', () => {
    const node = fromJS({
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: {
          type: 'MemberExpression',
          object: {
            type: 'Identifier',
            name: 'array',
          },
          property: {
            type: 'Identifier',
            name: 'map',
          },
          computed: false,
        },
        arguments: [
          {
            type: 'FunctionExpression',
            params: [{ type: 'Identifier', name: 'x' }],
            body: {
              type: 'BlockStatement',
              body: [],
            },
          },
        ],
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(
      <ExpressionStatement node={node} path={path} />,
    );

    expect(container).toHaveTextContent('array.map');
    expect(container).toHaveTextContent('function');
    expect(container).toHaveTextContent('x');
    expect(container).toHaveTextContent(';');
  });
});
