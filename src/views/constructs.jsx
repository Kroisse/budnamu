import PropTypes from 'prop-types';
import { Record, List, Seq } from 'immutable';

class Context extends Record({ node: null, path: List() }) {
  get key() {
    return this.path.last();
  }
  isEmpty() {
    return !this.node;
  }
  child(key) {
    return new Context({ node: this.node.get(key), path: this.path.push(key) });
  }
  render(dispatcher) {
    if (this.isEmpty()) {
      return null;
    }
    return dispatcher(this.node, this.key, this.path);
  }
  elements() {
    if (this.isEmpty()) {
      return Seq();
    }
    var path = this.path;
    return this.node.map(
      (e, i) => new Context({ node: e, path: path.push(i) }),
    );
  }
  blockConstruct(dispatchStatement) {
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

const ComplexStatement = () => {
  return <div />;
};

ComplexStatement.propTypes = {
  path: PropTypes.instanceOf(List),
};

const Block = ({ path, statements, dispatchStatement }) => {
  return (
    <div className="block">
      {statements
        .map((e, i) => dispatchStatement(e, i, path.push(i)))
        .toArray()}
    </div>
  );
};

Block.propTypes = {
  path: PropTypes.instanceOf(List),
  statements: PropTypes.instanceOf(List),
  dispatchStatement: PropTypes.func.isRequired,
};

export { Context, Block };
