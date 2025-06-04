import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { fromJS, List } from 'immutable';
import { SwitchStatement } from './SwitchStatement';
import type { ImmutableNode, ImmutablePath } from '../constructs';

describe('SwitchStatement', () => {
  it('should render basic switch statement', () => {
    const node = fromJS({
      type: 'SwitchStatement',
      discriminant: { type: 'Identifier', name: 'value' },
      cases: [
        {
          type: 'SwitchCase',
          test: { type: 'Literal', value: 1 },
          consequent: [
            {
              type: 'ExpressionStatement',
              expression: { type: 'Literal', value: 'one' },
            },
            { type: 'BreakStatement', label: null },
          ],
        },
        {
          type: 'SwitchCase',
          test: { type: 'Literal', value: 2 },
          consequent: [
            {
              type: 'ExpressionStatement',
              expression: { type: 'Literal', value: 'two' },
            },
            { type: 'BreakStatement', label: null },
          ],
        },
      ],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<SwitchStatement node={node} path={path} />);

    expect(container).toHaveTextContent('switch');
    expect(container).toHaveTextContent('value');
    expect(container).toHaveTextContent('case 1:');
    expect(container).toHaveTextContent('one');
    expect(container).toHaveTextContent('case 2:');
    expect(container).toHaveTextContent('two');
    expect(container.textContent?.match(/break/g)?.length).toBe(2);
  });

  it('should render switch with default case', () => {
    const node = fromJS({
      type: 'SwitchStatement',
      discriminant: { type: 'Identifier', name: 'type' },
      cases: [
        {
          type: 'SwitchCase',
          test: { type: 'Literal', value: 'A' },
          consequent: [
            {
              type: 'ReturnStatement',
              argument: { type: 'Literal', value: 'Type A' },
            },
          ],
        },
        {
          type: 'SwitchCase',
          test: null, // default case
          consequent: [
            {
              type: 'ReturnStatement',
              argument: { type: 'Literal', value: 'Unknown type' },
            },
          ],
        },
      ],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<SwitchStatement node={node} path={path} />);

    expect(container).toHaveTextContent('switch');
    expect(container).toHaveTextContent('type');
    expect(container).toHaveTextContent('case "A":');
    expect(container).toHaveTextContent('Type A');
    expect(container).toHaveTextContent('default:');
    expect(container).toHaveTextContent('Unknown type');
  });

  it('should render switch with fall-through cases', () => {
    const node = fromJS({
      type: 'SwitchStatement',
      discriminant: { type: 'Identifier', name: 'day' },
      cases: [
        {
          type: 'SwitchCase',
          test: { type: 'Literal', value: 'Monday' },
          consequent: [], // fall through
        },
        {
          type: 'SwitchCase',
          test: { type: 'Literal', value: 'Tuesday' },
          consequent: [], // fall through
        },
        {
          type: 'SwitchCase',
          test: { type: 'Literal', value: 'Wednesday' },
          consequent: [
            {
              type: 'ExpressionStatement',
              expression: { type: 'Literal', value: 'Weekday' },
            },
            { type: 'BreakStatement', label: null },
          ],
        },
      ],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<SwitchStatement node={node} path={path} />);

    expect(container).toHaveTextContent('case "Monday":');
    expect(container).toHaveTextContent('case "Tuesday":');
    expect(container).toHaveTextContent('case "Wednesday":');
    expect(container).toHaveTextContent('Weekday');
  });

  it('should render switch with complex discriminant', () => {
    const node = fromJS({
      type: 'SwitchStatement',
      discriminant: {
        type: 'CallExpression',
        callee: { type: 'Identifier', name: 'getType' },
        arguments: [{ type: 'Identifier', name: 'obj' }],
      },
      cases: [
        {
          type: 'SwitchCase',
          test: { type: 'Literal', value: 'string' },
          consequent: [{ type: 'BreakStatement', label: null }],
        },
      ],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<SwitchStatement node={node} path={path} />);

    expect(container).toHaveTextContent('switch');
    expect(container).toHaveTextContent('getType(obj)');
    expect(container).toHaveTextContent('case "string":');
  });

  it('should render switch with multiple statements per case', () => {
    const node = fromJS({
      type: 'SwitchStatement',
      discriminant: { type: 'Identifier', name: 'action' },
      cases: [
        {
          type: 'SwitchCase',
          test: { type: 'Literal', value: 'start' },
          consequent: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: { type: 'Identifier', name: 'initialize' },
                arguments: [],
              },
            },
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: { type: 'Identifier', name: 'begin' },
                arguments: [],
              },
            },
            { type: 'BreakStatement', label: null },
          ],
        },
      ],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<SwitchStatement node={node} path={path} />);

    expect(container).toHaveTextContent('case "start":');
    expect(container).toHaveTextContent('initialize()');
    expect(container).toHaveTextContent('begin()');
    expect(container).toHaveTextContent('break');
  });

  it('should render empty switch statement', () => {
    const node = fromJS({
      type: 'SwitchStatement',
      discriminant: { type: 'Identifier', name: 'x' },
      cases: [],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<SwitchStatement node={node} path={path} />);

    expect(container).toHaveTextContent('switch');
    expect(container).toHaveTextContent('x');
    expect(container).toHaveTextContent('{}');
  });

  it('should render switch with expression test cases', () => {
    const node = fromJS({
      type: 'SwitchStatement',
      discriminant: { type: 'Identifier', name: 'x' },
      cases: [
        {
          type: 'SwitchCase',
          test: {
            type: 'BinaryExpression',
            operator: '+',
            left: { type: 'Literal', value: 1 },
            right: { type: 'Literal', value: 1 },
          },
          consequent: [
            {
              type: 'ExpressionStatement',
              expression: { type: 'Literal', value: 'two' },
            },
          ],
        },
      ],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<SwitchStatement node={node} path={path} />);

    expect(container).toHaveTextContent('case 1 + 1:');
    expect(container).toHaveTextContent('two');
  });

  it('should render nested switch statements', () => {
    const node = fromJS({
      type: 'SwitchStatement',
      discriminant: { type: 'Identifier', name: 'outer' },
      cases: [
        {
          type: 'SwitchCase',
          test: { type: 'Literal', value: 1 },
          consequent: [
            {
              type: 'SwitchStatement',
              discriminant: { type: 'Identifier', name: 'inner' },
              cases: [
                {
                  type: 'SwitchCase',
                  test: { type: 'Literal', value: 'a' },
                  consequent: [{ type: 'BreakStatement', label: null }],
                },
              ],
            },
            { type: 'BreakStatement', label: null },
          ],
        },
      ],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<SwitchStatement node={node} path={path} />);

    // Just check the content is rendered correctly
    expect(container.querySelector('.switch-statement')).toBeTruthy();
    expect(container).toHaveTextContent('outer');
    expect(container).toHaveTextContent('inner');
  });

  it('should render proper HTML structure', () => {
    const node = fromJS({
      type: 'SwitchStatement',
      discriminant: { type: 'Identifier', name: 'x' },
      cases: [
        {
          type: 'SwitchCase',
          test: { type: 'Literal', value: 1 },
          consequent: [],
        },
      ],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<SwitchStatement node={node} path={path} />);

    const div = container.firstElementChild;
    expect(div).toBeInTheDocument();
    expect(div).toHaveClass('statement', 'switch-statement');

    const keyword = container.querySelector('.keyword');
    expect(keyword).toHaveTextContent('switch');

    const caseHeaders = container.querySelectorAll('.case-header');
    expect(caseHeaders).toHaveLength(1);
  });

  it('should render switch with identifier case values', () => {
    const node = fromJS({
      type: 'SwitchStatement',
      discriminant: { type: 'Identifier', name: 'status' },
      cases: [
        {
          type: 'SwitchCase',
          test: { type: 'Identifier', name: 'STATUS_OK' },
          consequent: [
            {
              type: 'ReturnStatement',
              argument: { type: 'Literal', value: true },
            },
          ],
        },
        {
          type: 'SwitchCase',
          test: { type: 'Identifier', name: 'STATUS_ERROR' },
          consequent: [
            {
              type: 'ReturnStatement',
              argument: { type: 'Literal', value: false },
            },
          ],
        },
      ],
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<SwitchStatement node={node} path={path} />);

    expect(container).toHaveTextContent('case STATUS_OK:');
    expect(container).toHaveTextContent('case STATUS_ERROR:');
    expect(container).toHaveTextContent('return true');
    expect(container).toHaveTextContent('return false');
  });
});
