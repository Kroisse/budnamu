import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { fromJS, List } from 'immutable';
import { BreakStatement } from './BreakStatement';
import type { ImmutableNode, ImmutablePath } from '../constructs';

describe('BreakStatement', () => {
  it('should render break statement without label', () => {
    const node = fromJS({
      type: 'BreakStatement',
      label: null,
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<BreakStatement node={node} path={path} />);

    const element = container.querySelector('.statement.break-statement');
    expect(element).toBeInTheDocument();
    expect(container).toHaveTextContent('break;');
  });

  it('should render break statement with label', () => {
    const node = fromJS({
      type: 'BreakStatement',
      label: {
        type: 'Identifier',
        value: 'outer',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<BreakStatement node={node} path={path} />);

    expect(container).toHaveTextContent('break outer;');
  });

  it('should render break statement with complex label', () => {
    const node = fromJS({
      type: 'BreakStatement',
      label: {
        type: 'Identifier',
        value: 'outerLoop',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<BreakStatement node={node} path={path} />);

    expect(container).toHaveTextContent('break outerLoop;');
  });

  it('should render break statement with underscore label', () => {
    const node = fromJS({
      type: 'BreakStatement',
      label: {
        type: 'Identifier',
        value: '_loop',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<BreakStatement node={node} path={path} />);

    expect(container).toHaveTextContent('break _loop;');
  });

  it('should render break statement with dollar sign label', () => {
    const node = fromJS({
      type: 'BreakStatement',
      label: {
        type: 'Identifier',
        value: '$loop',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<BreakStatement node={node} path={path} />);

    expect(container).toHaveTextContent('break $loop;');
  });

  it('should have proper HTML structure without label', () => {
    const node = fromJS({
      type: 'BreakStatement',
      label: null,
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<BreakStatement node={node} path={path} />);

    const div = container.firstElementChild;
    expect(div).toBeInTheDocument();
    expect(div).toHaveClass('statement', 'break-statement');

    const keyword = div?.querySelector('.keyword');
    expect(keyword).toBeInTheDocument();
    expect(keyword).toHaveTextContent('break');
  });

  it('should have proper HTML structure with label', () => {
    const node = fromJS({
      type: 'BreakStatement',
      label: {
        type: 'Identifier',
        value: 'test',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<BreakStatement node={node} path={path} />);

    const div = container.firstElementChild;
    expect(div).toBeInTheDocument();
    expect(div).toHaveClass('statement', 'break-statement');

    const keyword = div?.querySelector('.keyword');
    expect(keyword).toBeInTheDocument();
    expect(keyword).toHaveTextContent('break');
  });

  it('should handle undefined label', () => {
    const node = fromJS({
      type: 'BreakStatement',
      label: undefined,
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<BreakStatement node={node} path={path} />);

    expect(container).toHaveTextContent('break;');
  });

  it('should render break statement with numeric-like label', () => {
    const node = fromJS({
      type: 'BreakStatement',
      label: {
        type: 'Identifier',
        value: 'loop1',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<BreakStatement node={node} path={path} />);

    expect(container).toHaveTextContent('break loop1;');
  });

  it('should render break statement with CONSTANT_CASE label', () => {
    const node = fromJS({
      type: 'BreakStatement',
      label: {
        type: 'Identifier',
        value: 'MAIN_LOOP',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<BreakStatement node={node} path={path} />);

    expect(container).toHaveTextContent('break MAIN_LOOP;');
  });
});
