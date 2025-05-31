import React, { ReactNode } from 'react';
import { Record, List, Seq, Map } from 'immutable';

type ImmutableNode = Map<string, any>;
type ImmutablePath = List<string | number>;
type Dispatcher = (node: ImmutableNode, key: string | number, path: ImmutablePath) => ReactNode;

interface ContextData {
  node: ImmutableNode | null;
  path: ImmutablePath;
}

class Context extends Record<ContextData>({ node: null, path: List() }) {
  get key(): string | number | undefined {
    return this.path.last();
  }
  isEmpty(): boolean {
    return !this.node;
  }
  child(key: string): Context {
    return new Context({ node: this.node.get(key), path: this.path.push(key) });
  }
  render(dispatcher: Dispatcher): ReactNode {
    if (this.isEmpty()) {
      return null;
    }
    return dispatcher(this.node, this.key, this.path);
  }
  elements(): Seq.Indexed<Context> {
    if (this.isEmpty()) {
      return Seq();
    }
    const path = this.path;
    return this.node.map(
      (e, i) => new Context({ node: e, path: path.push(i) }),
    );
  }
  blockConstruct(dispatchStatement: Dispatcher): ReactNode {
    if (this.isEmpty()) {
      return null;
    }
    return (
      <Block
        key={this.key}
        path={this.path}
        statements={this.node}
        dispatchStatement={dispatchStatement}
      />
    );
  }
}

const ComplexStatement: React.FC = () => {
  return <div />;
};

interface BlockProps {
  path: ImmutablePath;
  statements: List<ImmutableNode>;
  dispatchStatement: Dispatcher;
}

const Block: React.FC<BlockProps> = ({ path, statements, dispatchStatement }) => {
  return (
    <div className="block">
      {statements
        .map((e, i) => dispatchStatement(e, i, path.push(i)))
        .toArray()}
    </div>
  );
};

export { Context, Block };
export type { ImmutableNode, ImmutablePath, Dispatcher, BlockProps };
