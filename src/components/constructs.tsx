import React, { ReactNode } from 'react';
import { Record, List, Seq, Map } from 'immutable';

// Define recursive type for immutable values
export type ImmutableValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ImmutableNode
  | List<ImmutableValue>;

export type ImmutableNode = Map<string, ImmutableValue>;
export type ImmutablePath = List<string | number>;
export type Dispatcher = (
  node: ImmutableNode,
  key: string | number,
  path: ImmutablePath,
) => ReactNode;

interface ContextData {
  node: ImmutableNode | List<ImmutableValue> | null;
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
    let childNode = null;

    if (Map.isMap(this.node)) {
      childNode = this.node.get(key);
    }

    let node: ImmutableNode | List<ImmutableValue> | null = null;

    if (Map.isMap(childNode)) {
      // Ensure it's a Map with string keys
      const entries: [string, ImmutableValue][] = [];
      childNode.forEach((value, k) => {
        if (typeof k === 'string') {
          entries.push([k, value]);
        }
      });
      node = Map(entries);
    } else if (List.isList(childNode)) {
      // Handle List nodes directly
      node = childNode;
    }

    return new Context({
      node: node,
      path: this.path.push(key),
    });
  }
  render(dispatcher: Dispatcher): ReactNode {
    if (this.isEmpty() || !this.node || !Map.isMap(this.node)) {
      return null;
    }
    return dispatcher(this.node, this.key ?? '', this.path);
  }
  elements(): Seq.Indexed<Context> {
    if (this.isEmpty()) {
      return Seq.Indexed<Context>();
    }
    const path = this.path;
    // Check if node is a List
    if (!List.isList(this.node)) {
      return Seq.Indexed<Context>();
    }

    // Type guard ensures this.node is a List
    const list = this.node;
    return list.toSeq().map((e, i) => {
      // Ensure e is a Map with string keys
      let node: ImmutableNode | null = null;
      if (Map.isMap(e)) {
        // Create a new Map with string keys only
        const entries: [string, ImmutableValue][] = [];
        e.forEach((value, key) => {
          if (typeof key === 'string') {
            entries.push([key, value]);
          }
        });
        node = Map(entries);
      }
      return new Context({
        node: node,
        path: path.push(i),
      });
    });
  }
  blockConstruct(dispatchStatement: Dispatcher): ReactNode {
    if (this.isEmpty()) {
      return null;
    }

    // Handle case where node is actually the statements list directly
    let childNode = null;
    if (Map.isMap(this.node) && typeof this.key === 'string') {
      childNode = this.node.get(this.key);
    }
    let statements: List<ImmutableValue> | null = null;

    if (List.isList(childNode)) {
      // Convert to list of properly typed nodes
      const convertedList = childNode
        .map((item) => {
          if (Map.isMap(item)) {
            const entries: [string, ImmutableValue][] = [];
            item.forEach((value, key) => {
              if (typeof key === 'string') {
                entries.push([key, value]);
              }
            });
            return Map(entries);
          }
          return null;
        })
        .filter((item) => item !== null);

      if (convertedList.size > 0) {
        statements = convertedList;
      }
    } else if (List.isList(this.node)) {
      // Convert to list of properly typed nodes
      const convertedList = this.node
        .map((item) => {
          if (Map.isMap(item)) {
            const entries: [string, ImmutableValue][] = [];
            item.forEach((value, key) => {
              if (typeof key === 'string') {
                entries.push([key, value]);
              }
            });
            return Map(entries);
          }
          return null;
        })
        .filter((item) => item !== null);

      if (convertedList.size > 0) {
        statements = convertedList;
      }
    }

    if (!statements) {
      return null;
    }

    return (
      <Block
        key={this.key}
        path={this.path}
        statements={statements}
        dispatchStatement={dispatchStatement}
      />
    );
  }
}

interface BlockProps {
  path: ImmutablePath;
  statements: List<ImmutableValue>;
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
        .map((e, i) => {
          // Only dispatch if e is a Map (ImmutableNode)
          if (Map.isMap(e)) {
            return dispatchStatement(e, i, path.push(i));
          }
          return null;
        })
        .filter((item) => item !== null)
        .toArray()}
    </div>
  );
};

export { Context, Block };
export type { BlockProps };
