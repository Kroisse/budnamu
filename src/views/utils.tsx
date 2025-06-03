// Re-export everything from the utils folder
export {
  commaSeparated,
  FunctionHeader,
  Enclose,
  RenderFunction,
  OpenParen,
  CloseParen,
  OpenBrace,
  CloseBrace,
  OpenBracket,
  CloseBracket,
} from './utils/index';

// Keep renderFunction as a wrapper for backwards compatibility
import { Context } from './constructs';
import { RenderFunction } from './utils/index';

export function renderFunction(context: Context) {
  return <RenderFunction context={context} />;
}