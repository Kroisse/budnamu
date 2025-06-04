import { atom } from 'jotai';
import { parse, ParseOptions } from '@swc/wasm-web';
import { fromJS } from 'immutable';
import type { ImmutableValue } from '../components/constructs';

// Base atom for storing the syntax tree
export const syntaxTreeAtom = atom<ImmutableValue>(
  fromJS({ type: 'Program', body: [] }) as ImmutableValue,
);

// Atom for storing the current file content
export const fileContentAtom = atom<string>('');

interface ParsingState {
  isLoading: boolean;
  error: string | null;
}

// Atom for tracking parsing state
export const parsingStateAtom = atom<ParsingState>({
  isLoading: false,
  error: null,
});

// Parse options for SWC
const SWC_PARSE_OPTIONS: ParseOptions = {
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
};

// TypeScript parse options for SWC (disabled for now)
// const SWC_TS_PARSE_OPTIONS: ParseOptions = {
//   syntax: 'typescript',
//   tsx: true,
//   target: 'es2022',
//   dynamicImport: true,
//   decorators: true,
// };

// Function to detect if content is TypeScript (disabled for now)
// function isTypeScript(content: string): boolean {
//   // Very conservative heuristics - only explicit TypeScript syntax
//   return (
//     /\.(ts|tsx)$/.test(content) ||
//     /\b(interface|type|declare|namespace|enum|abstract)\b/.test(content) ||
//     /\b(private|protected|public|readonly)\s+[\w$]/.test(content) ||
//     /:\s*[A-Z][\w$]*(<[^>]+>)?(\[\])?(\s*\|\s*[A-Z][\w$]*)*\s*[=;,)]/.test(
//       content,
//     ) ||
//     /\bas\s+[A-Z][\w$]/.test(content) ||
//     /<[A-Z][\w$]*(\s+extends\s+[^>]+)?>/.test(content) ||
//     /\?\s*:/.test(content) // optional properties
//   );
// }

// Derived atom that parses the file content into a syntax tree
export const parsedSyntaxTreeAtom = atom(
  (get) => get(syntaxTreeAtom),
  async (_get, set, content: string) => {
    // Set loading state
    set(parsingStateAtom, { isLoading: true, error: null });

    try {
      // For now, always parse as JavaScript to avoid TypeScript-specific nodes
      // TODO: Add proper TypeScript support later
      const parseOptions = SWC_PARSE_OPTIONS;

      console.log('Parsing JavaScript content with SWC (async)');

      // Use SWC's native async parse function
      const ast = await parse(content, parseOptions);
      set(syntaxTreeAtom, fromJS(ast) as ImmutableValue);
      set(fileContentAtom, content);
      set(parsingStateAtom, { isLoading: false, error: null });

      console.info('SWC async parsing successful:', ast);
    } catch (error) {
      console.error('Failed to parse with SWC:', error);
      set(parsingStateAtom, {
        isLoading: false,
        error: error instanceof Error ? error.message : String(error),
      });
      // Keep the previous valid syntax tree on parse error
    }
  },
);

// Atom for loading remote files
export const loadRemoteFileAtom = atom(
  null,
  async (_get, set, path: string) => {
    try {
      console.info('Loading remote file:', path);
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`Failed to load file: ${response.statusText}`);
      }
      const content = await response.text();
      console.info('File loaded successfully, parsing...');
      await set(parsedSyntaxTreeAtom, content);
    } catch (error) {
      console.error('Failed to load remote file:', error);
    }
  },
);
