import { StatementComponent } from './types';

// Import all individual statement components
import { VariableDeclaration } from './VariableDeclaration';
import { FunctionDeclaration } from './FunctionDeclaration';
import { ClassDeclaration } from './ClassDeclaration';
import { MethodDefinition } from './MethodDefinition';
import { ExpressionStatement } from './ExpressionStatement';
import { BlockStatement } from './BlockStatement';
import { IfStatement } from './IfStatement';
import { SwitchStatement } from './SwitchStatement';
import { WhileStatement } from './WhileStatement';
import { DoWhileStatement } from './DoWhileStatement';
import { ForStatement } from './ForStatement';
import { ForInStatement } from './ForInStatement';
import { LabeledStatement } from './LabeledStatement';
import { TryStatement } from './TryStatement';
import { ReturnStatement } from './ReturnStatement';
import { ThrowStatement } from './ThrowStatement';
import { ContinueStatement } from './ContinueStatement';
import { BreakStatement } from './BreakStatement';

// Removed unused destructuring

// Removed unused helper functions

// Factory function to create statement components
export function createStatementComponents(): Record<
  string,
  StatementComponent
> {
  const statements: Record<string, StatementComponent> = {
    VariableDeclaration,
    FunctionDeclaration,
    ClassDeclaration,
    MethodDefinition,
    ExpressionStatement,
    BlockStatement,
    IfStatement,
    SwitchStatement,
    WhileStatement,
    DoWhileStatement,
    ForStatement,
    ForInStatement,
    LabeledStatement,
    TryStatement,
    ReturnStatement,
    ThrowStatement,
    ContinueStatement,
    BreakStatement,
  };

  return statements;
}
