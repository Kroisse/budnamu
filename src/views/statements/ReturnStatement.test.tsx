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
    expect(container.textContent).toBe('return;');
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

    expect(container.textContent).toBe('return 42;');
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

    expect(container.textContent).toBe('return "success";');
  });

  it('should render return statement with identifier', () => {
    const node = fromJS({
      type: 'ReturnStatement',
      argument: {
        type: 'Identifier',
        name: 'result',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ReturnStatement node={node} path={path} />);

    expect(container.textContent).toBe('return result;');
  });

  it('should render return statement with binary expression', () => {
    const node = fromJS({
      type: 'ReturnStatement',
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
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ReturnStatement node={node} path={path} />);

    expect(container.textContent).toBe('return a + b;');
  });

  it('should render return statement with call expression', () => {
    const node = fromJS({
      type: 'ReturnStatement',
      argument: {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'calculate',
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

    expect(container.textContent).toBe('return calculate(10);');
  });

  it('should render return statement with object expression', () => {
    const node = fromJS({
      type: 'ReturnStatement',
      argument: {
        type: 'ObjectExpression',
        properties: [
          {
            type: 'Property',
            key: { type: 'Identifier', name: 'status' },
            value: { type: 'Literal', value: 'ok' },
            kind: 'init',
          },
        ],
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ReturnStatement node={node} path={path} />);

    expect(container.textContent).toContain('return');
    expect(container.textContent).toContain('{');
    expect(container.textContent).toContain('status');
    expect(container.textContent).toContain(':');
    expect(container.textContent).toContain('"ok"');
    expect(container.textContent).toContain('}');
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

    expect(container.textContent).toBe('return [1, 2, 3];');
  });

  it('should render return statement with conditional expression', () => {
    const node = fromJS({
      type: 'ReturnStatement',
      argument: {
        type: 'ConditionalExpression',
        test: {
          type: 'Identifier',
          name: 'condition',
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

    expect(container.textContent).toBe('return condition ? true : false;');
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
    expect(div?.tagName).toBe('DIV');
    expect(div?.className).toBe('statement return-statement');
    
    const keyword = div?.querySelector('.keyword');
    expect(keyword).toBeInTheDocument();
    expect(keyword?.textContent).toBe('return');
  });

  it('should have proper HTML structure without argument', () => {
    const node = fromJS({
      type: 'ReturnStatement',
      argument: null,
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ReturnStatement node={node} path={path} />);

    const div = container.firstElementChild;
    expect(div?.tagName).toBe('DIV');
    expect(div?.className).toBe('statement return-statement');
    
    const keyword = div?.querySelector('.keyword');
    expect(keyword).toBeInTheDocument();
    expect(keyword?.textContent).toBe('return');
  });

  it('should handle undefined argument', () => {
    const node = fromJS({
      type: 'ReturnStatement',
      argument: undefined,
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ReturnStatement node={node} path={path} />);

    expect(container.textContent).toBe('return;');
  });
});