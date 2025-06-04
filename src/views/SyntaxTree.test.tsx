import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { parse, type ParseOptions } from '@swc/core';
import { fromJS } from 'immutable';
import { Context, type ImmutableNode } from './constructs';
import { dispatchStatement } from './statements';
import { List } from 'immutable';

describe('SyntaxTree Integration with SWC Structure', () => {
  // SWC parse options matching the ones used in syntaxTreeAtoms.ts
  const SWC_PARSE_OPTIONS: ParseOptions = {
    syntax: 'ecmascript',
    jsx: true,
    target: 'es2022',
    dynamicImport: true,
    privateMethod: true,
    functionBind: true,
    exportDefaultFrom: true,
    exportNamespaceFrom: true,
    decorators: true,
    decoratorsBeforeExport: true,
    topLevelAwait: true,
    importMeta: true,
  };

  it('should parse and render with @swc/core in Node.js', async () => {
    // The exact code from SyntaxTree.tsx DEFAULT_CODE
    const code = `function greet(name) {
  console.log("Hello, " + name + "!");
}

const x = 42;
let y = "hello";`;

    // Use @swc/core for Node.js testing
    const ast = await parse(code, SWC_PARSE_OPTIONS);
    const immutableAST = fromJS(ast);

    console.log('SWC Core parsed AST:', ast);

    const bodyContext = new Context({
      node: immutableAST.get('body') as ImmutableNode,
      path: List(['body']),
    });

    const { container } = render(
      <div className="syntax-tree">
        <div style={{ padding: '20px', border: '1px solid #ccc' }}>
          <h2>Syntax Tree Visualization</h2>
          <div>AST Type: {immutableAST.get('type')}</div>
          {bodyContext.blockConstruct(dispatchStatement)}
        </div>
      </div>,
    );

    // Snapshot test to ensure consistent rendering of all components
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should parse simple function with @swc/core', async () => {
    const code = 'function test(param) { return 42; }';

    const ast = await parse(code, SWC_PARSE_OPTIONS);
    const immutableAST = fromJS(ast);

    const bodyContext = new Context({
      node: immutableAST.get('body') as ImmutableNode,
      path: List(['body']),
    });

    const { container } = render(
      <div>{bodyContext.blockConstruct(dispatchStatement)}</div>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should parse variable declarations with @swc/core', async () => {
    const code = 'const x = 42; let y = "hello";';

    const ast = await parse(code, SWC_PARSE_OPTIONS);
    const immutableAST = fromJS(ast);

    const bodyContext = new Context({
      node: immutableAST.get('body') as ImmutableNode,
      path: List(['body']),
    });

    const { container } = render(
      <div>{bodyContext.blockConstruct(dispatchStatement)}</div>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should parse and render array expressions with @swc/core', async () => {
    const code = 'const arr = [1, 2, "hello"];';

    const ast = await parse(code, SWC_PARSE_OPTIONS);
    const immutableAST = fromJS(ast);

    const bodyContext = new Context({
      node: immutableAST.get('body') as ImmutableNode,
      path: List(['body']),
    });

    const { container } = render(
      <div>{bodyContext.blockConstruct(dispatchStatement)}</div>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should parse and render object expressions with @swc/core', async () => {
    const code = 'const obj = { name: "test", value: 42 };';

    const ast = await parse(code, SWC_PARSE_OPTIONS);
    const immutableAST = fromJS(ast);

    const bodyContext = new Context({
      node: immutableAST.get('body') as ImmutableNode,
      path: List(['body']),
    });

    const { container } = render(
      <div>{bodyContext.blockConstruct(dispatchStatement)}</div>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should parse and render member expressions with @swc/core', async () => {
    const code = 'console.log(obj.property);';

    const ast = await parse(code, SWC_PARSE_OPTIONS);
    const immutableAST = fromJS(ast);

    const bodyContext = new Context({
      node: immutableAST.get('body') as ImmutableNode,
      path: List(['body']),
    });

    const { container } = render(
      <div>{bodyContext.blockConstruct(dispatchStatement)}</div>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
