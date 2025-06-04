import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { fromJS, List } from 'immutable';
import { Parameter } from './Parameter';
import type { ImmutableNode, ImmutablePath } from '../constructs';

describe('Parameter', () => {
  it('should render parameter with pattern', () => {
    const node = fromJS({
      type: 'Parameter',
      span: { start: 115, end: 119 },
      decorators: [],
      pat: {
        type: 'Identifier',
        span: { start: 115, end: 119 },
        ctxt: 3,
        value: 'name',
        optional: false,
        typeAnnotation: null,
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['parameter']);

    const { container } = render(<Parameter node={node} path={path} />);

    expect(container).toHaveTextContent('name');
    expect(
      container.querySelector('.expression.parameter'),
    ).toBeInTheDocument();
  });

  it('should render parameter with fallback value', () => {
    const node = fromJS({
      type: 'Parameter',
      value: 'testParam',
    }) as ImmutableNode;
    const path: ImmutablePath = List(['parameter']);

    const { container } = render(<Parameter node={node} path={path} />);

    expect(container).toHaveTextContent('testParam');
    expect(
      container.querySelector('.expression.parameter.identifier'),
    ).toBeInTheDocument();
  });

  it('should render default parameter fallback', () => {
    const node = fromJS({
      type: 'Parameter',
    }) as ImmutableNode;
    const path: ImmutablePath = List(['parameter']);

    const { container } = render(<Parameter node={node} path={path} />);

    expect(container).toHaveTextContent('param');
    expect(
      container.querySelector('.expression.parameter'),
    ).toBeInTheDocument();
  });
});
