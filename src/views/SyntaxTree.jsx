import { useEffect } from "react";
import { useAtom } from "jotai";
import { Context } from "./constructs.jsx";
import { dispatchStatement } from "./statements.jsx";
import { parsedSyntaxTreeAtom, loadRemoteFileAtom, parsingStateAtom } from "../atoms/syntaxTreeAtoms";
import Immutable from "immutable";

const SyntaxTree = () => {
    const [syntaxTree] = useAtom(parsedSyntaxTreeAtom);
    const [, loadRemoteFile] = useAtom(loadRemoteFileAtom);
    const [parsingState] = useAtom(parsingStateAtom);

    useEffect(() => {
        // Load the entry.jsx file when component mounts
        loadRemoteFile("/src/entry.jsx");
    }, [loadRemoteFile]);

    const context = new Context({
        node: syntaxTree,
        path: Immutable.List()
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
            {context.child("body").blockConstruct(dispatchStatement)}
        </div>
    );
};

export default SyntaxTree;
