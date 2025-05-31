import { useState, useEffect } from "react";
import SyntaxTreeStore from "../stores/SyntaxTreeStore";
import {Context} from "./constructs.jsx";
import Immutable from "immutable";

function getStateFromStores() {
    return {
        context: new Context({node: SyntaxTreeStore.getSyntaxTree(), path: Immutable.List()})
    };
}

const SyntaxTree = () => {
    const [state, setState] = useState(getStateFromStores());

    useEffect(() => {
        const handleChange = () => {
            setState(getStateFromStores());
        };

        SyntaxTreeStore.addChangeListener(handleChange);

        return () => {
            SyntaxTreeStore.removeChangeListener(handleChange);
        };
    }, []);

    return (
        <div className="syntax-tree">
            {state.context.child("body").blockConstruct()}
        </div>
    );
};

export default SyntaxTree;
