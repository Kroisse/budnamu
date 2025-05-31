import { atom } from 'jotai';
import { parse } from '@swc/wasm-web';
import { Seq } from 'immutable';

// Helper function to convert JS objects to Immutable structures
function toImmutable(json) {
  if (Array.isArray(json)) {
    return Seq(json).map(toImmutable).toList();
  }
  if (json && typeof json === 'object' && json !== null) {
    return Seq(json).map(toImmutable).toMap();
  }
  return json;
}

// Base atom for storing the syntax tree
export const syntaxTreeAtom = atom(toImmutable({ type: 'Program', body: [] }));

// Atom for storing the current file content
export const fileContentAtom = atom('');

// Atom for tracking parsing state
export const parsingStateAtom = atom({
  isLoading: false,
  error: null,
});

// Parse options for SWC
const SWC_PARSE_OPTIONS = {
  syntax: 'ecmascript',
  jsx: true,
  target: 'es2022',
  dynamicImport: true,
  privateMethod: true,
  functionBind: true,
  exportDefaultFrom: true,
  exportNamespaceFrom: true,
  decorators: true,
  decoratorsBeforeExport: true,
  topLevelAwait: true,
  importMeta: true,
  preserveAllComments: false,
};

// TypeScript parse options for SWC
const SWC_TS_PARSE_OPTIONS = {
  syntax: 'typescript',
  tsx: true,
  target: 'es2022',
  dynamicImport: true,
  privateMethod: true,
  functionBind: true,
  exportDefaultFrom: true,
  exportNamespaceFrom: true,
  decorators: true,
  decoratorsBeforeExport: true,
  topLevelAwait: true,
  importMeta: true,
  preserveAllComments: false,
};

// Function to detect if content is TypeScript
function isTypeScript(content) {
  // Simple heuristics to detect TypeScript
  return (
    /\.(ts|tsx)$/.test(content) ||
    /\b(interface|type|enum|namespace|declare|abstract|readonly|private|protected|public)\b/.test(
      content,
    ) ||
    /:\s*\w+(\[\])?(\s*\|\s*\w+)*\s*[=;,)]/.test(content)
  );
}

// Derived atom that parses the file content into a syntax tree
export const parsedSyntaxTreeAtom = atom(
  (get) => get(syntaxTreeAtom),
  async (get, set, content) => {
    // Set loading state
    set(parsingStateAtom, { isLoading: true, error: null });

    try {
      // Determine if content is TypeScript
      const isTS = isTypeScript(content);
      const parseOptions = isTS ? SWC_TS_PARSE_OPTIONS : SWC_PARSE_OPTIONS;

      console.log(
        `Parsing ${isTS ? 'TypeScript' : 'JavaScript'} content with SWC (async)`,
      );

      // Use SWC's native async parse function
      const ast = await parse(content, parseOptions);
      set(syntaxTreeAtom, toImmutable(ast));
      set(fileContentAtom, content);
      set(parsingStateAtom, { isLoading: false, error: null });

      console.log('SWC async parsing successful:', ast);
    } catch (error) {
      console.error('Failed to parse with SWC:', error);
      set(parsingStateAtom, { isLoading: false, error: error.message });
      // Keep the previous valid syntax tree on parse error
    }
  },
);

// Atom for loading remote files
export const loadRemoteFileAtom = atom(null, async (get, set, path) => {
  try {
    console.log('Loading remote file:', path);
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load file: ${response.statusText}`);
    }
    const content = await response.text();
    console.log('File loaded successfully, parsing...');
    await set(parsedSyntaxTreeAtom, content);
  } catch (error) {
    console.error('Failed to load remote file:', error);
  }
});
