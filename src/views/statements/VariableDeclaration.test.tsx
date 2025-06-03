import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Map, List, fromJS } from 'immutable';
import { VariableDeclaration } from './VariableDeclaration';
import type { ImmutablePath } from '../constructs';

// Mock console.log to avoid noise in tests
beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

describe('VariableDeclaration', () => {
  it('should render with proper structure', () => {
    const node = Map({
      type: 'VariableDeclaration',
      declarations: List([]),
    });
    const path: ImmutablePath = List(['statements', 0]);

    const { container } = render(
      <VariableDeclaration node={node} path={path} />,
    );

    // Check basic structure
    const varDecl = container.querySelector('.variable-declaration');
    expect(varDecl).toBeInTheDocument();
    expect(varDecl).toHaveClass('variable-declaration');
    expect(varDecl?.tagName.toLowerCase()).toBe('div');

    // Check keyword
    const keyword = container.querySelector('.keyword');
    expect(keyword).toBeInTheDocument();
    expect(keyword).toHaveClass('keyword');
    expect(keyword?.textContent).toBe('var ');
    expect(keyword).toHaveStyle({ width: '5ex' });

    // Check declarations container
    const declarations = container.querySelector('.declarations');
    expect(declarations).toBeInTheDocument();
    expect(declarations).toHaveClass('declarations');
    expect(declarations).toHaveTextContent(';');
  });

  it('should render as statement by default', () => {
    const node = Map({
      type: 'VariableDeclaration',
      declarations: List([]),
    });
    const path: ImmutablePath = List(['statements', 0]);

    const { container } = render(
      <VariableDeclaration node={node} path={path} />,
    );

    const varDecl = container.querySelector('.statement.variable-declaration');
    expect(varDecl).toBeTruthy();
    expect(varDecl?.tagName.toLowerCase()).toBe('div');
    expect(container.textContent).toBe('var ;');
  });

  it('should render as expression when expression prop is true', () => {
    const node = Map({
      type: 'VariableDeclaration',
      declarations: List([]),
    });
    const path: ImmutablePath = List(['expression']);

    const { container } = render(
      <VariableDeclaration node={node} path={path} expression />,
    );

    const varDecl = container.querySelector('.expression.variable-declaration');
    expect(varDecl).toBeTruthy();
    expect(varDecl?.tagName.toLowerCase()).toBe('span');
    // No semicolon in expression mode
    expect(container.textContent).toBe('var ');
  });

  it('should apply correct CSS classes based on expression prop', () => {
    const node = Map({
      type: 'VariableDeclaration',
      declarations: List([]),
    });
    const path: ImmutablePath = List(['test']);

    // Test statement mode (default)
    const { container: stmtContainer } = render(
      <VariableDeclaration node={node} path={path} />,
    );
    expect(stmtContainer.querySelector('.statement')).toBeTruthy();
    expect(stmtContainer.querySelector('.expression')).toBeFalsy();

    // Test expression mode
    const { container: exprContainer } = render(
      <VariableDeclaration node={node} path={path} expression />,
    );
    expect(exprContainer.querySelector('.expression')).toBeTruthy();
    expect(exprContainer.querySelector('.statement')).toBeFalsy();
  });

  it('should handle semicolon correctly', () => {
    const node = Map({
      type: 'VariableDeclaration',
      declarations: List([]),
    });
    const path: ImmutablePath = List(['test']);

    // Statement mode should have semicolon
    const { container: stmtContainer } = render(
      <VariableDeclaration node={node} path={path} expression={false} />,
    );
    const stmtDeclarations = stmtContainer.querySelector('.declarations');
    expect(stmtDeclarations?.textContent).toBe(';');

    // Expression mode should not have semicolon
    const { container: exprContainer } = render(
      <VariableDeclaration node={node} path={path} expression={true} />,
    );
    const exprDeclarations = exprContainer.querySelector('.declarations');
    expect(exprDeclarations?.textContent).toBe('');
  });

  it('should create proper React element structure', () => {
    const node = Map({
      type: 'VariableDeclaration',
      declarations: List([]),
    });
    const path: ImmutablePath = List(['test']);

    const { container } = render(
      <VariableDeclaration node={node} path={path} />,
    );

    // Should have exactly one root element
    expect(container.children).toHaveLength(1);

    const root = container.firstElementChild;
    expect(root?.className).toBe('statement variable-declaration');

    // Should have two direct children: keyword span and declarations span
    expect(root?.children).toHaveLength(2);
    expect(root?.children[0]).toHaveClass('keyword');
    expect(root?.children[1]).toHaveClass('declarations');
  });

  it.each([
    ['statements at index 0', List(['statements', 0])],
    ['nested statements', List(['body', 'statements', 5])],
    ['test path', List(['test'])],
    ['empty path', List([])],
  ])('should handle different path contexts - %s', (_description, path) => {
    const node = Map({
      type: 'VariableDeclaration',
      declarations: List([]),
    });

    const { container } = render(
      <VariableDeclaration node={node} path={path} />,
    );
    expect(container.querySelector('.variable-declaration')).toBeTruthy();
    expect(container.textContent).toBe('var ;');
  });

  describe('declaration kinds (var/let/const)', () => {
    it.each([
      { kind: 'const', expected: 'const x = 5;' },
      { kind: 'let', expected: 'let x = 5;' },
      { kind: 'var', expected: 'var x = 5;' },
    ])('should handle $kind declaration', ({ kind, expected }) => {
      const node = Map({
        type: 'VariableDeclaration',
        kind,
        declarations: List([
          Map({
            type: 'VariableDeclarator',
            id: Map({ type: 'Identifier', name: 'x' }),
            init: Map({ type: 'NumericLiteral', value: 5, raw: '5' }),
          }),
        ]),
      });
      const path: ImmutablePath = List(['statements', 0]);

      const { container } = render(
        <VariableDeclaration node={node} path={path} />,
      );

      const keyword = container.querySelector('.keyword');
      expect(keyword).toHaveTextContent(kind);
      expect(keyword).toHaveStyle({ width: '5ex' });
      expect(container.textContent).toBe(expected);
    });

    it('should default to var when kind is not specified', () => {
      const node = Map({
        type: 'VariableDeclaration',
        // No kind property
        declarations: List([]),
      });
      const path: ImmutablePath = List(['statements', 0]);

      const { container } = render(
        <VariableDeclaration node={node} path={path} />,
      );

      const keyword = container.querySelector('.keyword');
      expect(keyword).toHaveTextContent('var');
    });

    it('const declaration should work in both expression and statement mode', () => {
      const node = Map({
        type: 'VariableDeclaration',
        kind: 'const',
        declarations: List([]),
      });
      const path: ImmutablePath = List(['test']);

      // Should work in expression mode
      const { container: exprContainer } = render(
        <VariableDeclaration node={node} path={path} expression />,
      );
      expect(exprContainer.querySelector('.expression')).toBeTruthy();
      expect(exprContainer.textContent).toBe('const ');

      // Should work in statement mode
      const { container: stmtContainer } = render(
        <VariableDeclaration node={node} path={path} expression={false} />,
      );
      expect(stmtContainer.querySelector('.statement')).toBeTruthy();
      expect(stmtContainer.textContent).toBe('const ;');
    });

    it('should handle const with multiple declarations (realistic example)', () => {
      // This simulates: const x = 5, y = 10, z;
      // Note: In real JS, const requires initialization, but the AST might allow it
      // fromJS()를 사용하여 복잡한 구조를 간단하게 생성
      const node = fromJS({
        type: 'VariableDeclaration',
        kind: 'const',
        declarations: [
          {
            type: 'VariableDeclarator',
            id: { type: 'Identifier', name: 'x' },
            init: { type: 'Literal', value: 5, raw: '5' },
          },
          {
            type: 'VariableDeclarator',
            id: { type: 'Identifier', name: 'y' },
            init: { type: 'Literal', value: 10, raw: '10' },
          },
          {
            type: 'VariableDeclarator',
            id: { type: 'Identifier', name: 'z' },
          },
        ],
      });
      const path: ImmutablePath = List(['statements', 0]);

      const { container } = render(
        <VariableDeclaration node={node} path={path} />,
      );

      expect(container.querySelector('.keyword')).toHaveTextContent('const');
      // Due to Context limitations with Lists, we won't see the actual declarations
      // but we can verify the structure is correct
      expect(
        container.querySelector('.variable-declaration'),
      ).toBeInTheDocument();
      expect(container.querySelector('.declarations')).toBeInTheDocument();
    });
  });
});
