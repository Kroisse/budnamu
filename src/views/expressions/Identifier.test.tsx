import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { fromJS, List } from 'immutable';
import { Identifier } from './Identifier';
import type { ImmutableNode, ImmutablePath } from '../constructs';

describe('Identifier', () => {
  it('should render identifier with correct class', () => {
    const node = fromJS({
      type: 'Identifier',
      name: 'myVariable',
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<Identifier node={node} path={path} />);

    const element = container.querySelector('.expression.identifier');
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('myVariable');
  });

  it('should render single character identifier', () => {
    const node = fromJS({
      type: 'Identifier',
      name: 'x',
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<Identifier node={node} path={path} />);

    expect(
      container.querySelector('.expression.identifier'),
    ).toBeInTheDocument();
    expect(container.textContent).toBe('x');
  });

  it('should render identifier with underscore', () => {
    const node = fromJS({
      type: 'Identifier',
      name: '_privateVar',
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<Identifier node={node} path={path} />);

    expect(container.textContent).toBe('_privateVar');
  });

  it('should render identifier with dollar sign', () => {
    const node = fromJS({
      type: 'Identifier',
      name: '$jquery',
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<Identifier node={node} path={path} />);

    expect(container.textContent).toBe('$jquery');
  });

  it('should render camelCase identifier', () => {
    const node = fromJS({
      type: 'Identifier',
      name: 'getUserById',
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<Identifier node={node} path={path} />);

    expect(container.textContent).toBe('getUserById');
  });

  it('should render CONSTANT_CASE identifier', () => {
    const node = fromJS({
      type: 'Identifier',
      name: 'MAX_VALUE',
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<Identifier node={node} path={path} />);

    expect(container.textContent).toBe('MAX_VALUE');
  });

  it('should render JavaScript keywords as identifiers', () => {
    // Some keywords can appear as identifiers in certain contexts
    const keywords = ['undefined', 'arguments', 'constructor'];

    keywords.forEach((keyword) => {
      const node = fromJS({
        type: 'Identifier',
        name: keyword,
      }) as ImmutableNode;
      const path: ImmutablePath = List(['expression']);

      const { container } = render(<Identifier node={node} path={path} />);

      expect(container.textContent).toBe(keyword);
      expect(
        container.querySelector('.expression.identifier'),
      ).toBeInTheDocument();
    });
  });

  it('should handle empty name gracefully', () => {
    const node = fromJS({
      type: 'Identifier',
      name: '',
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<Identifier node={node} path={path} />);

    const element = container.querySelector('.expression.identifier');
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('');
  });

  it('should handle Unicode identifiers', () => {
    const node = fromJS({
      type: 'Identifier',
      name: 'π',
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<Identifier node={node} path={path} />);

    expect(container.textContent).toBe('π');
  });

  it('should render with proper HTML structure', () => {
    const node = fromJS({
      type: 'Identifier',
      name: 'test',
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<Identifier node={node} path={path} />);

    const span = container.firstElementChild;
    expect(span?.tagName).toBe('SPAN');
    expect(span?.className).toBe('expression identifier');
  });
});
