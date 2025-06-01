import React, { useEffect } from 'react';
import { useAtom } from 'jotai';
import { Context, ImmutableNode } from './constructs';
import { dispatchStatement } from './statements';
import {
  parsedSyntaxTreeAtom,
  loadRemoteFileAtom,
  parsingStateAtom,
} from '../atoms/syntaxTreeAtoms';
import { List } from 'immutable';

const SyntaxTree: React.FC = () => {
  const [syntaxTree] = useAtom(parsedSyntaxTreeAtom);
  const [, loadRemoteFile] = useAtom(loadRemoteFileAtom);
  const [parsingState] = useAtom(parsingStateAtom);

  useEffect(() => {
    // Load the entry.jsx file when component mounts
    void loadRemoteFile('/src/entry.tsx');
  }, [loadRemoteFile]);

  const context = new Context({
    node: syntaxTree as ImmutableNode,
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

  return (
    <div className="syntax-tree">
      {context.child('body').blockConstruct(dispatchStatement)}
    </div>
  );
};

export default SyntaxTree;
