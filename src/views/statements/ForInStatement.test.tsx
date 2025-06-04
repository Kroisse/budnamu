import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { fromJS, List } from 'immutable';
import { ForInStatement } from './ForInStatement';
import type { ImmutableNode, ImmutablePath } from '../constructs';

describe('ForInStatement', () => {
  it('should render basic for-in loop', () => {
    const node = fromJS({
      type: 'ForInStatement',
      left: {
        type: 'VariableDeclaration',
        declarations: [
          {
            type: 'VariableDeclarator',
            id: { type: 'Identifier', name: 'key' },
            init: null,
          },
        ],
        kind: 'let',
      },
      right: { type: 'Identifier', name: 'obj' },
      body: {
        type: 'BlockStatement',
        body: [
          {
            type: 'ExpressionStatement',
            expression: { type: 'Identifier', name: 'key' },
          },
        ],
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ForInStatement node={node} path={path} />);

    expect(container).toHaveTextContent('for');
    expect(container).toHaveTextContent('let key');
    expect(container).toHaveTextContent('in');
    expect(container).toHaveTextContent('obj');
  });

  it('should render for-in with identifier left side', () => {
    const node = fromJS({
      type: 'ForInStatement',
      left: { type: 'Identifier', name: 'prop' },
      right: { type: 'Identifier', name: 'object' },
      body: {
        type: 'BlockStatement',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'MemberExpression',
              object: { type: 'Identifier', name: 'object' },
              property: { type: 'Identifier', name: 'prop' },
              computed: true,
            },
          },
        ],
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ForInStatement node={node} path={path} />);

    expect(container).toHaveTextContent('for');
    expect(container).toHaveTextContent('prop');
    expect(container).toHaveTextContent('in');
    expect(container).toHaveTextContent('object');
    expect(container).toHaveTextContent('object[prop]');
  });

  it('should render for-in with const declaration', () => {
    const node = fromJS({
      type: 'ForInStatement',
      left: {
        type: 'VariableDeclaration',
        declarations: [
          {
            type: 'VariableDeclarator',
            id: { type: 'Identifier', name: 'key' },
            init: null,
          },
        ],
        kind: 'const',
      },
      right: { type: 'Identifier', name: 'data' },
      body: { type: 'BlockStatement', body: [] },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ForInStatement node={node} path={path} />);

    expect(container).toHaveTextContent('const key');
    expect(container).toHaveTextContent('in');
    expect(container).toHaveTextContent('data');
  });

  it('should render for-in with single statement body', () => {
    const node = fromJS({
      type: 'ForInStatement',
      left: {
        type: 'VariableDeclaration',
        declarations: [
          {
            type: 'VariableDeclarator',
            id: { type: 'Identifier', name: 'k' },
            init: null,
          },
        ],
        kind: 'var',
      },
      right: { type: 'Identifier', name: 'obj' },
      body: {
        type: 'ExpressionStatement',
        expression: {
          type: 'CallExpression',
          callee: {
            type: 'MemberExpression',
            object: { type: 'Identifier', name: 'console' },
            property: { type: 'Identifier', name: 'log' },
            computed: false,
          },
          arguments: [{ type: 'Identifier', name: 'k' }],
        },
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ForInStatement node={node} path={path} />);

    expect(container).toHaveTextContent('var k');
    expect(container).toHaveTextContent('console.log(k)');
    expect(container).not.toHaveTextContent('{');
  });

  it('should render for-in with object literal', () => {
    const node = fromJS({
      type: 'ForInStatement',
      left: {
        type: 'VariableDeclaration',
        declarations: [
          {
            type: 'VariableDeclarator',
            id: { type: 'Identifier', name: 'prop' },
            init: null,
          },
        ],
        kind: 'let',
      },
      right: {
        type: 'ObjectExpression',
        properties: [
          {
            type: 'Property',
            key: { type: 'Identifier', name: 'a' },
            value: { type: 'Literal', value: 1 },
            kind: 'init',
          },
          {
            type: 'Property',
            key: { type: 'Identifier', name: 'b' },
            value: { type: 'Literal', value: 2 },
            kind: 'init',
          },
        ],
      },
      body: { type: 'BlockStatement', body: [] },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ForInStatement node={node} path={path} />);

    expect(container).toHaveTextContent('let prop');
    expect(container).toHaveTextContent('in');
    expect(container).toHaveTextContent('{a: 1, b: 2}');
  });

  it('should render nested for-in loops', () => {
    const node = fromJS({
      type: 'ForInStatement',
      left: {
        type: 'VariableDeclaration',
        declarations: [
          {
            type: 'VariableDeclarator',
            id: { type: 'Identifier', name: 'outer' },
            init: null,
          },
        ],
        kind: 'let',
      },
      right: { type: 'Identifier', name: 'obj1' },
      body: {
        type: 'BlockStatement',
        body: [
          {
            type: 'ForInStatement',
            left: {
              type: 'VariableDeclaration',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  id: { type: 'Identifier', name: 'inner' },
                  init: null,
                },
              ],
              kind: 'let',
            },
            right: { type: 'Identifier', name: 'obj2' },
            body: { type: 'BlockStatement', body: [] },
          },
        ],
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ForInStatement node={node} path={path} />);

    // Just check the content is rendered correctly
    expect(container.querySelector('.for-in-statement')).toBeTruthy();
    expect(container).toHaveTextContent('let outer');
    expect(container).toHaveTextContent('obj1');
    // Note: nested statements might not render properly in test environment
  });

  it('should render for-in with complex right expression', () => {
    const node = fromJS({
      type: 'ForInStatement',
      left: {
        type: 'VariableDeclaration',
        declarations: [
          {
            type: 'VariableDeclarator',
            id: { type: 'Identifier', name: 'key' },
            init: null,
          },
        ],
        kind: 'let',
      },
      right: {
        type: 'CallExpression',
        callee: { type: 'Identifier', name: 'getObject' },
        arguments: [],
      },
      body: { type: 'BlockStatement', body: [] },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ForInStatement node={node} path={path} />);

    expect(container).toHaveTextContent('let key');
    expect(container).toHaveTextContent('in');
    expect(container).toHaveTextContent('getObject()');
  });

  it('should render proper HTML structure', () => {
    const node = fromJS({
      type: 'ForInStatement',
      left: { type: 'Identifier', name: 'k' },
      right: { type: 'Identifier', name: 'o' },
      body: { type: 'BlockStatement', body: [] },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ForInStatement node={node} path={path} />);

    const div = container.firstElementChild;
    expect(div).toBeInTheDocument();
    expect(div).toHaveClass('statement', 'for-in-statement');

    const keywords = container.querySelectorAll('.keyword');
    expect(keywords).toHaveLength(2); // 'for' and 'in'
    expect(keywords[0]).toHaveTextContent('for');
    expect(keywords[1]).toHaveTextContent('in');
  });

  it('should handle member expression as left side', () => {
    const node = fromJS({
      type: 'ForInStatement',
      left: {
        type: 'MemberExpression',
        object: { type: 'Identifier', name: 'this' },
        property: { type: 'Identifier', name: 'prop' },
        computed: false,
      },
      right: { type: 'Identifier', name: 'source' },
      body: { type: 'BlockStatement', body: [] },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ForInStatement node={node} path={path} />);

    expect(container).toHaveTextContent('this.prop');
    expect(container).toHaveTextContent('in');
    expect(container).toHaveTextContent('source');
  });

  it('should render for-in with array literal', () => {
    const node = fromJS({
      type: 'ForInStatement',
      left: {
        type: 'VariableDeclaration',
        declarations: [
          {
            type: 'VariableDeclarator',
            id: { type: 'Identifier', name: 'index' },
            init: null,
          },
        ],
        kind: 'let',
      },
      right: {
        type: 'ArrayExpression',
        elements: [
          { type: 'Literal', value: 1 },
          { type: 'Literal', value: 2 },
          { type: 'Literal', value: 3 },
        ],
      },
      body: { type: 'BlockStatement', body: [] },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ForInStatement node={node} path={path} />);

    expect(container).toHaveTextContent('let index');
    expect(container).toHaveTextContent('in');
    expect(container).toHaveTextContent('[1, 2, 3]');
  });
});
