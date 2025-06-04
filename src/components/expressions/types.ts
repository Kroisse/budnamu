import { ImmutableNode, ImmutablePath } from '../constructs';

export interface ExpressionProps {
  node: ImmutableNode;
  path: ImmutablePath;
  key?: string | number;
}

export type ExpressionComponent = React.FC<ExpressionProps>;
