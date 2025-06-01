import React, { ReactNode } from 'react';
import { Record, List, Seq, Map } from 'immutable';

type ImmutableNode = Map<string, unknown>;
type ImmutablePath = List<string | number>;
type Dispatcher = (
  node: ImmutableNode,
  key: string | number,
  path: ImmutablePath,
) => ReactNode;

interface ContextData {
  node: ImmutableNode | null;
  path: ImmutablePath;
}

class Context extends Record<ContextData>({ node: null, path: List() }) {
  get key(): string | number | undefined {
    return this.path.last();
  }
  isEmpty(): boolean {
    return this.node == null;
  }
  child(key: string): Context {
    const childNode = this.node?.get(key);
    return new Context({
      node: childNode instanceof Map ? (childNode as ImmutableNode) : null,
      path: this.path.push(key),
    });
  }
  render(dispatcher: Dispatcher): ReactNode {
    if (this.isEmpty() || !this.node) {
      return null;
    }
    return dispatcher(this.node, this.key ?? '', this.path);
  }
  elements(): Seq<number, Context> {
    if (this.isEmpty()) {
      return Seq();
    }
    const path = this.path;
    // Type assertion needed due to Immutable.js typing limitations
    const seq = this.node?.toSeq() ?? Seq();
    return seq.map(
      (e, i) =>
        new Context({ node: e as ImmutableNode, path: path.push(i as number) }),
    ) as unknown as Seq<number, Context>;
  }
  blockConstruct(dispatchStatement: Dispatcher): ReactNode {
    if (this.isEmpty()) {
      return null;
    }
    return (
      <Block
        key={this.key}
        path={this.path}
        statements={this.node as unknown as List<ImmutableNode>}
        dispatchStatement={dispatchStatement}
      />
    );
  }
}

interface BlockProps {
  path: ImmutablePath;
  statements: List<ImmutableNode>;
  dispatchStatement: Dispatcher;
}

const Block: React.FC<BlockProps> = ({
  path,
  statements,
  dispatchStatement,
}) => {
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
