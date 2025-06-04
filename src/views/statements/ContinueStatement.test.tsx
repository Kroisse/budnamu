import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { fromJS, List } from 'immutable';
import { ContinueStatement } from './ContinueStatement';
import type { ImmutableNode, ImmutablePath } from '../constructs';

describe('ContinueStatement', () => {
  it('should render continue statement without label', () => {
    const node = fromJS({
      type: 'ContinueStatement',
      label: null,
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ContinueStatement node={node} path={path} />);

    const element = container.querySelector('.statement.continue-statement');
    expect(element).toBeInTheDocument();
    expect(container).toHaveTextContent('continue;');
  });

  it('should render continue statement with label', () => {
    const node = fromJS({
      type: 'ContinueStatement',
      label: {
        type: 'Identifier',
        name: 'outer',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ContinueStatement node={node} path={path} />);

    expect(container).toHaveTextContent('continue outer;');
  });

  it('should render continue statement with complex label', () => {
    const node = fromJS({
      type: 'ContinueStatement',
      label: {
        type: 'Identifier',
        name: 'outerLoop',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ContinueStatement node={node} path={path} />);

    expect(container).toHaveTextContent('continue outerLoop;');
  });

  it('should render continue statement with underscore label', () => {
    const node = fromJS({
      type: 'ContinueStatement',
      label: {
        type: 'Identifier',
        name: '_loop',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ContinueStatement node={node} path={path} />);

    expect(container).toHaveTextContent('continue _loop;');
  });

  it('should render continue statement with dollar sign label', () => {
    const node = fromJS({
      type: 'ContinueStatement',
      label: {
        type: 'Identifier',
        name: '$loop',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ContinueStatement node={node} path={path} />);

    expect(container).toHaveTextContent('continue $loop;');
  });

  it('should have proper HTML structure without label', () => {
    const node = fromJS({
      type: 'ContinueStatement',
      label: null,
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ContinueStatement node={node} path={path} />);

    const div = container.firstElementChild;
    expect(div).toBeInTheDocument();
    expect(div).toHaveClass('statement', 'continue-statement');

    const keyword = div?.querySelector('.keyword');
    expect(keyword).toBeInTheDocument();
    expect(keyword).toHaveTextContent('continue');
  });

  it('should have proper HTML structure with label', () => {
    const node = fromJS({
      type: 'ContinueStatement',
      label: {
        type: 'Identifier',
        name: 'test',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ContinueStatement node={node} path={path} />);

    const div = container.firstElementChild;
    expect(div).toBeInTheDocument();
    expect(div).toHaveClass('statement', 'continue-statement');

    const keyword = div?.querySelector('.keyword');
    expect(keyword).toBeInTheDocument();
    expect(keyword).toHaveTextContent('continue');
  });

  it('should handle undefined label', () => {
    const node = fromJS({
      type: 'ContinueStatement',
      label: undefined,
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ContinueStatement node={node} path={path} />);

    expect(container).toHaveTextContent('continue;');
  });

  it('should render continue statement with numeric-like label', () => {
    const node = fromJS({
      type: 'ContinueStatement',
      label: {
        type: 'Identifier',
        name: 'loop1',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ContinueStatement node={node} path={path} />);

    expect(container).toHaveTextContent('continue loop1;');
  });

  it('should render continue statement with CONSTANT_CASE label', () => {
    const node = fromJS({
      type: 'ContinueStatement',
      label: {
        type: 'Identifier',
        name: 'MAIN_LOOP',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ContinueStatement node={node} path={path} />);

    expect(container).toHaveTextContent('continue MAIN_LOOP;');
  });

  it('should render continue statement with camelCase label', () => {
    const node = fromJS({
      type: 'ContinueStatement',
      label: {
        type: 'Identifier',
        name: 'mainLoop',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['statement']);

    const { container } = render(<ContinueStatement node={node} path={path} />);

    expect(container).toHaveTextContent('continue mainLoop;');
  });
});
