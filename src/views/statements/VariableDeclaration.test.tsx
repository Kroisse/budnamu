import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Map, List } from 'immutable';
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

  it('should render var keyword with proper spacing', () => {
    const node = Map({
      type: 'VariableDeclaration',
      declarations: List([]),
    });
    const path: ImmutablePath = List(['test']);

    const { container } = render(
      <VariableDeclaration node={node} path={path} />,
    );

    const keyword = container.querySelector('.keyword');
    expect(keyword).toBeTruthy();
    // Check that it includes trailing space
    expect(keyword).toHaveTextContent('var');
    // Check inline style
    expect(keyword).toHaveStyle({ width: '5ex' });
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

  it('should handle different path contexts', () => {
    const node = Map({
      type: 'VariableDeclaration',
      declarations: List([]),
    });

    // Different paths shouldn't affect rendering (only expression prop matters)
    const paths = [
      List(['statements', 0]),
      List(['body', 'statements', 5]),
      List(['test']),
      List([]),
    ];

    paths.forEach((path) => {
      const { container } = render(
        <VariableDeclaration node={node} path={path} />,
      );
      expect(container.querySelector('.variable-declaration')).toBeTruthy();
      expect(container.textContent).toBe('var ;');
    });
  });
});
