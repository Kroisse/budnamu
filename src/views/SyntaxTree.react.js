import React from "react";
import SyntaxTreeStore from "../stores/SyntaxTreeStore";
import {Context} from "./constructs.react";
import Immutable from "immutable";

function getStateFromStores() {
    return {
        context: new Context({node: SyntaxTreeStore.getSyntaxTree(), path: Immutable.List()})
    };
}

const SyntaxTree = React.createClass({
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

export default SyntaxTree;
