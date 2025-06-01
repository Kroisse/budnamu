import { ImmutableNode, ImmutablePath } from '../constructs';

export interface StatementProps {
  node: ImmutableNode;
  path: ImmutablePath;
  key?: string | number;
  expression?: boolean;
}

export type StatementComponent = React.FC<StatementProps>;
