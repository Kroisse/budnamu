import { atom } from 'jotai';
import * as acorn from 'acorn';
import Immutable from 'immutable';

// Helper function to convert JS objects to Immutable structures
function toImmutable(json) {
    if (Array.isArray(json)) {
        return Immutable.Seq(json).map(toImmutable).toList();
    }
    if (json && (json instanceof acorn.Node || json.constructor === Object)) {
        return Immutable.Seq(json).map(toImmutable).toMap();
    }
    return json;
}

// Base atom for storing the syntax tree
export const syntaxTreeAtom = atom(
    toImmutable({ type: "Program", body: [] })
);

// Atom for storing the current file content
export const fileContentAtom = atom('');

// Derived atom that parses the file content into a syntax tree
export const parsedSyntaxTreeAtom = atom(
    (get) => get(syntaxTreeAtom),
    (get, set, content) => {
        try {
            const tree = acorn.parse(content, {
                ecmaVersion: 'latest',
                sourceType: 'module',
                allowImportExportEverywhere: true,
                allowAwaitOutsideFunction: true,
                allowReturnOutsideFunction: true,
                allowSuperOutsideMethod: true,
                allowHashBang: true
            });
            set(syntaxTreeAtom, toImmutable(tree));
            set(fileContentAtom, content);
        } catch (error) {
            console.error('Failed to parse JavaScript:', error);
            // Keep the previous valid syntax tree on parse error
        }
    }
);

// Atom for loading remote files
export const loadRemoteFileAtom = atom(
    null,
    async (get, set, path) => {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`Failed to load file: ${response.statusText}`);
            }
            const content = await response.text();
            set(parsedSyntaxTreeAtom, content);
        } catch (error) {
            console.error('Failed to load remote file:', error);
        }
    }
);