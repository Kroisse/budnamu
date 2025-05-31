import React from "react";
import Immutable from "immutable";


class Context extends Immutable.Record({node: null, path: Immutable.List()}) {
    get key() {
        return this.path.last();
    }
    isEmpty() {
        return !this.node;
    }
    child(key) {
        return new Context({node: this.node.get(key), path: this.path.push(key)});
    }
    render(dispatcher) {
        if (this.isEmpty()) {
            return null;
        }
        return dispatcher(this.node, this.key, this.path);
    }
    elements() {
        if (this.isEmpty()) {
            return Immutable.Seq();
        }
        var path = this.path;
        return this.node.map((e, i) => new Context({node: e, path: path.push(i)}));
    }
    blockConstruct() {
        if (this.isEmpty()) {
            return null;
        }
        return <Block key={this.key} path={this.path} statements={this.node} />
    }
}


const ComplexStatement = React.createClass({
    propTypes: {
        path: React.PropTypes.instanceOf(Immutable.List)
    },
    render() {
        return (
            <div />
        );
    }
});


const Block = React.createClass({
    propTypes: {
        path: React.PropTypes.instanceOf(Immutable.List),
        statements: React.PropTypes.instanceOf(Immutable.List)
    },
    render() {
        // Dynamic import is converted to a lazy import at the top
        const path = this.props.path;
        return (
            <div className="block">
                {this.props.statements.map((e, i) => dispatchStatement(e, i, path.push(i))).toArray()}
            </div>
        );
    }
});


export { Context, Block };

// Circular dependency workaround - will be set by statements.js
let dispatchStatement = null;
export function setDispatchStatement(fn) {
    dispatchStatement = fn;
}
