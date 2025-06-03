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
    expect(container.textContent).toBe('break;');
  });

  it('should render break statement with label', () => {
    const node = fromJS({
      type: 'BreakStatement',
      label: {
        type: 'Identifier',
        name: 'outer',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<BreakStatement node={node} path={path} />);

    expect(container.textContent).toBe('break outer;');
  });

  it('should render break statement with complex label', () => {
    const node = fromJS({
      type: 'BreakStatement',
      label: {
        type: 'Identifier',
        name: 'outerLoop',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<BreakStatement node={node} path={path} />);

    expect(container.textContent).toBe('break outerLoop;');
  });

  it('should render break statement with underscore label', () => {
    const node = fromJS({
      type: 'BreakStatement',
      label: {
        type: 'Identifier',
        name: '_loop',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<BreakStatement node={node} path={path} />);

    expect(container.textContent).toBe('break _loop;');
  });

  it('should render break statement with dollar sign label', () => {
    const node = fromJS({
      type: 'BreakStatement',
      label: {
        type: 'Identifier',
        name: '$loop',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<BreakStatement node={node} path={path} />);

    expect(container.textContent).toBe('break $loop;');
  });

  it('should have proper HTML structure without label', () => {
    const node = fromJS({
      type: 'BreakStatement',
      label: null,
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<BreakStatement node={node} path={path} />);

    const div = container.firstElementChild;
    expect(div?.tagName).toBe('DIV');
    expect(div?.className).toBe('statement break-statement');
    
    const keyword = div?.querySelector('.keyword');
    expect(keyword).toBeInTheDocument();
    expect(keyword?.textContent).toBe('break');
  });

  it('should have proper HTML structure with label', () => {
    const node = fromJS({
      type: 'BreakStatement',
      label: {
        type: 'Identifier',
        name: 'test',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<BreakStatement node={node} path={path} />);

    const div = container.firstElementChild;
    expect(div?.tagName).toBe('DIV');
    expect(div?.className).toBe('statement break-statement');
    
    const keyword = div?.querySelector('.keyword');
    expect(keyword).toBeInTheDocument();
    expect(keyword?.textContent).toBe('break');
  });

  it('should handle undefined label', () => {
    const node = fromJS({
      type: 'BreakStatement',
      label: undefined,
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<BreakStatement node={node} path={path} />);

    expect(container.textContent).toBe('break;');
  });

  it('should render break statement with numeric-like label', () => {
    const node = fromJS({
      type: 'BreakStatement',
      label: {
        type: 'Identifier',
        name: 'loop1',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<BreakStatement node={node} path={path} />);

    expect(container.textContent).toBe('break loop1;');
  });

  it('should render break statement with CONSTANT_CASE label', () => {
    const node = fromJS({
      type: 'BreakStatement',
      label: {
        type: 'Identifier',
        name: 'MAIN_LOOP',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<BreakStatement node={node} path={path} />);

    expect(container.textContent).toBe('break MAIN_LOOP;');
  });
});