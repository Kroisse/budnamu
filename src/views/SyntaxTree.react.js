var React = require("react");
var SyntaxTreeStore = require("../stores/SyntaxTreeStore");
var {Context} = require("./constructs");

function getStateFromStores() {
    return {
        context: new Context({node: SyntaxTreeStore.getSyntaxTree(), path: Immutable.List()})
    };
}

var SyntaxTree = React.createClass({
    getInitialState() {
        return getStateFromStores();
    },
    componentDidMount() {
        SyntaxTreeStore.addChangeListener(this._onChange);
    },
    componentWillUnmount() {
        SyntaxTreeStore.removeChangeListener(this._onChange);
    },
    render() {
        return (
            <div className="syntax-tree">
                {this.state.context.child("body").blockConstruct()}
            </div>
        );
    },
    _onChange() {
        this.setState(getStateFromStores());
    }
});

module.exports = SyntaxTree;
