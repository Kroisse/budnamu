import { useEffect } from "react";
import { useAtom } from "jotai";
import { Context } from "./constructs.jsx";
import { parsedSyntaxTreeAtom, loadRemoteFileAtom } from "../atoms/syntaxTreeAtoms";
import Immutable from "immutable";

const SyntaxTree = () => {
    const [syntaxTree] = useAtom(parsedSyntaxTreeAtom);
    const [, loadRemoteFile] = useAtom(loadRemoteFileAtom);

    useEffect(() => {
        // Load the dispatcher.js file when component mounts
        loadRemoteFile("/src/dispatcher.js");
    }, [loadRemoteFile]);

    const context = new Context({
        node: syntaxTree,
        path: Immutable.List()
    });

    return (
        <div className="syntax-tree">
            {context.child("body").blockConstruct()}
        </div>
    );
};

export default SyntaxTree;