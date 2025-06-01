import React from 'react';
import { StatementProps } from './types';
import { Context } from '../constructs';
import * as utils from '../utils';

export const FunctionDeclaration: React.FC<StatementProps> = (props) => {
  return utils.renderFunction(new Context(props));
};