import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { fromJS, List } from 'immutable';
import { IfStatement } from './IfStatement';
import type { ImmutableNode, ImmutablePath } from '../constructs';

describe('IfStatement', () => {
  it('should render simple if statement without else', () => {
    const node = fromJS({
      type: 'IfStatement',
      test: { type: 'Literal', value: true },
      consequent: {
        type: 'BlockStatement',
        body: [
          {
            type: 'ExpressionStatement',
            expression: { type: 'Literal', value: 'then' },
          },
        ],
      },
      alternate: null,
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<IfStatement node={node} path={path} />);

    expect(container).toHaveTextContent('if');
    expect(container).toHaveTextContent('true');
    expect(container).toHaveTextContent('then');
    expect(container).not.toHaveTextContent('else');
  });

  it('should render if-else statement', () => {
    const node = fromJS({
      type: 'IfStatement',
      test: { type: 'Identifier', name: 'condition' },
      consequent: {
        type: 'BlockStatement',
        body: [
          {
            type: 'ExpressionStatement',
            expression: { type: 'Literal', value: 'then' },
          },
        ],
      },
      alternate: {
        type: 'BlockStatement',
        body: [
          {
            type: 'ExpressionStatement',
            expression: { type: 'Literal', value: 'else' },
          },
        ],
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<IfStatement node={node} path={path} />);

    expect(container).toHaveTextContent('if');
    expect(container).toHaveTextContent('condition');
    expect(container).toHaveTextContent('then');
    expect(container).toHaveTextContent('else');
  });

  it('should render if-else if-else chain', () => {
    const node = fromJS({
      type: 'IfStatement',
      test: { type: 'Identifier', name: 'x' },
      consequent: {
        type: 'BlockStatement',
        body: [
          {
            type: 'ExpressionStatement',
            expression: { type: 'Literal', value: 1 },
          },
        ],
      },
      alternate: {
        type: 'IfStatement',
        test: { type: 'Identifier', name: 'y' },
        consequent: {
          type: 'BlockStatement',
          body: [
            {
              type: 'ExpressionStatement',
              expression: { type: 'Literal', value: 2 },
            },
          ],
        },
        alternate: {
          type: 'BlockStatement',
          body: [
            {
              type: 'ExpressionStatement',
              expression: { type: 'Literal', value: 3 },
            },
          ],
        },
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<IfStatement node={node} path={path} />);

    expect(container).toHaveTextContent('if');
    expect(container).toHaveTextContent('x');
    expect(container).toHaveTextContent('1');
    expect(container).toHaveTextContent('else if');
    expect(container).toHaveTextContent('y');
    expect(container).toHaveTextContent('2');
    expect(container).toHaveTextContent('else');
    expect(container).toHaveTextContent('3');
  });

  it('should render complex test expressions', () => {
    const node = fromJS({
      type: 'IfStatement',
      test: {
        type: 'BinaryExpression',
        operator: '>',
        left: { type: 'Identifier', name: 'x' },
        right: { type: 'Literal', value: 10 },
      },
      consequent: {
        type: 'ExpressionStatement',
        expression: { type: 'Literal', value: 'greater' },
      },
      alternate: null,
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<IfStatement node={node} path={path} />);

    expect(container).toHaveTextContent('if');
    expect(container).toHaveTextContent('x > 10');
    expect(container).toHaveTextContent('greater');
  });

  it('should render single statement without block', () => {
    const node = fromJS({
      type: 'IfStatement',
      test: { type: 'Literal', value: true },
      consequent: {
        type: 'ReturnStatement',
        argument: { type: 'Literal', value: 42 },
      },
      alternate: null,
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<IfStatement node={node} path={path} />);

    expect(container).toHaveTextContent('if');
    expect(container).toHaveTextContent('true');
    expect(container).toHaveTextContent('return 42');
  });

  it('should render nested if statements', () => {
    const node = fromJS({
      type: 'IfStatement',
      test: { type: 'Identifier', name: 'outer' },
      consequent: {
        type: 'BlockStatement',
        body: [
          {
            type: 'IfStatement',
            test: { type: 'Identifier', name: 'inner' },
            consequent: {
              type: 'ExpressionStatement',
              expression: { type: 'Literal', value: 'nested' },
            },
            alternate: null,
          },
        ],
      },
      alternate: null,
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<IfStatement node={node} path={path} />);

    // Just check the content is rendered correctly
    expect(container.querySelector('.if-statement')).toBeTruthy();
    expect(container).toHaveTextContent('outer');
    expect(container).toHaveTextContent('inner');
    expect(container).toHaveTextContent('nested');
  });

  it('should render proper HTML structure', () => {
    const node = fromJS({
      type: 'IfStatement',
      test: { type: 'Literal', value: true },
      consequent: { type: 'BlockStatement', body: [] },
      alternate: null,
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<IfStatement node={node} path={path} />);

    const div = container.firstElementChild;
    expect(div).toBeInTheDocument();
    expect(div).toHaveClass('statement', 'if-statement');

    const keyword = container.querySelector('.keyword');
    expect(keyword).toHaveTextContent('if');
  });

  it('should handle multiple else-if chains', () => {
    const createElseIf = (name: string, value: number, alternate: any) => ({
      type: 'IfStatement',
      test: { type: 'Identifier', name },
      consequent: {
        type: 'ExpressionStatement',
        expression: { type: 'Literal', value },
      },
      alternate,
    });

    const node = fromJS({
      type: 'IfStatement',
      test: { type: 'Identifier', name: 'a' },
      consequent: {
        type: 'ExpressionStatement',
        expression: { type: 'Literal', value: 1 },
      },
      alternate: createElseIf(
        'b',
        2,
        createElseIf('c', 3, createElseIf('d', 4, null)),
      ),
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<IfStatement node={node} path={path} />);

    expect(container).toHaveTextContent('a');
    expect(container).toHaveTextContent('b');
    expect(container).toHaveTextContent('c');
    expect(container).toHaveTextContent('d');
    expect(container.textContent?.match(/else if/g)?.length).toBe(3);
  });

  it('should handle logical expressions in test', () => {
    const node = fromJS({
      type: 'IfStatement',
      test: {
        type: 'LogicalExpression',
        operator: '&&',
        left: { type: 'Identifier', name: 'x' },
        right: { type: 'Identifier', name: 'y' },
      },
      consequent: {
        type: 'ExpressionStatement',
        expression: { type: 'Literal', value: 'both true' },
      },
      alternate: null,
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<IfStatement node={node} path={path} />);

    expect(container).toHaveTextContent('x && y');
    expect(container).toHaveTextContent('both true');
  });

  it('should render empty if statement', () => {
    const node = fromJS({
      type: 'IfStatement',
      test: { type: 'Literal', value: true },
      consequent: { type: 'BlockStatement', body: [] },
      alternate: { type: 'BlockStatement', body: [] },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<IfStatement node={node} path={path} />);

    expect(container).toHaveTextContent('if');
    expect(container).toHaveTextContent('true');
    expect(container).toHaveTextContent('else');
    expect(container).toHaveTextContent('{}');
  });
});
