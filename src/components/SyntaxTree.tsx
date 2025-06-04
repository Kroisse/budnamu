import React, { useEffect } from 'react';
import { useAtom } from 'jotai';
import { Context, type ImmutableNode, type ImmutableValue } from './constructs';
import { dispatchStatement } from './statements';
import {
  parsedSyntaxTreeAtom,
  parsingStateAtom,
} from '../atoms/syntaxTreeAtoms';
import { List, Map } from 'immutable';

const DEFAULT_CODE = `function greet(name) {
  console.log("Hello, " + name + "!");
}

const x = 42;
let y = "hello";`;

const SyntaxTree: React.FC = () => {
  const [syntaxTree, parseSyntaxTree] = useAtom(parsedSyntaxTreeAtom);
  const [parsingState] = useAtom(parsingStateAtom);

  useEffect(() => {
    // Parse default code when component mounts
    void parseSyntaxTree(DEFAULT_CODE);
  }, [parseSyntaxTree]);

  // Ensure syntaxTree is a Map or List before creating context
  let contextNode: ImmutableNode | List<ImmutableValue> | undefined;
  if (Map.isMap(syntaxTree) || List.isList(syntaxTree)) {
    contextNode = syntaxTree;
  }

  const context = new Context({
    node: contextNode,
    path: List(),
  });

  // Show loading state
  if (parsingState.isLoading) {
    return (
      <div className="syntax-tree">
        <div style={{ padding: '20px', textAlign: 'center' }}>
          Parsing code with SWC...
        </div>
      </div>
    );
  }

  // Show error state
  if (parsingState.error) {
    return (
      <div className="syntax-tree">
        <div style={{ padding: '20px', color: 'red' }}>
          Parse Error: {parsingState.error}
        </div>
      </div>
    );
  }

  // Get the body directly as it's a List
  const bodyValue = Map.isMap(context.node) ? context.node.get('body') : null;
  const bodyList = List.isList(bodyValue) ? bodyValue : null;

  console.log('SyntaxTree render:', {
    syntaxTree,
    contextNode: context.node,
    bodyList: bodyList,
  });

  // Create a context with the body list directly
  const bodyContext = new Context({
    node: bodyList,
    path: List(['body']),
  });

  return (
    <div className="syntax-tree">
      <div style={{ padding: '20px', border: '1px solid #ccc' }}>
        <h2>Syntax Tree Visualization</h2>
        <div>
          AST Type:{' '}
          {Map.isMap(context.node) ? context.node.get('type') : 'Unknown'}
        </div>
        {bodyContext.blockConstruct(dispatchStatement)}
      </div>
    </div>
  );
};

export default SyntaxTree;
