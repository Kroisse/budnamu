import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { fromJS, List } from 'immutable';
import { Identifier } from './Identifier';
import type { ImmutableNode, ImmutablePath } from '../constructs';

describe('Identifier', () => {
  it('should render identifier with correct class', () => {
    const node = fromJS({
      type: 'Identifier',
      value: 'myVariable',
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
      value: 'x',
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<Identifier node={node} path={path} />);

    expect(
      container.querySelector('.expression.identifier'),
    ).toBeInTheDocument();
    expect(container).toHaveTextContent('x');
  });

  it('should render identifier with underscore', () => {
    const node = fromJS({
      type: 'Identifier',
      value: '_privateVar',
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<Identifier node={node} path={path} />);

    expect(container).toHaveTextContent('_privateVar');
  });

  it('should render identifier with dollar sign', () => {
    const node = fromJS({
      type: 'Identifier',
      value: '$jquery',
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<Identifier node={node} path={path} />);

    expect(container).toHaveTextContent('$jquery');
  });

  it('should render camelCase identifier', () => {
    const node = fromJS({
      type: 'Identifier',
      value: 'getUserById',
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<Identifier node={node} path={path} />);

    expect(container).toHaveTextContent('getUserById');
  });

  it('should render CONSTANT_CASE identifier', () => {
    const node = fromJS({
      type: 'Identifier',
      value: 'MAX_VALUE',
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<Identifier node={node} path={path} />);

    expect(container).toHaveTextContent('MAX_VALUE');
  });

  it('should render JavaScript keywords as identifiers', () => {
    // Some keywords can appear as identifiers in certain contexts
    const keywords = ['undefined', 'arguments', 'constructor'];

    keywords.forEach((keyword) => {
      const node = fromJS({
        type: 'Identifier',
        value: keyword,
      }) as ImmutableNode;
      const path: ImmutablePath = List(['expression']);

      const { container } = render(<Identifier node={node} path={path} />);

      expect(container).toHaveTextContent(keyword);
      expect(
        container.querySelector('.expression.identifier'),
      ).toBeInTheDocument();
    });
  });

  it('should handle empty name gracefully', () => {
    const node = fromJS({
      type: 'Identifier',
      value: '',
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
      value: 'π',
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<Identifier node={node} path={path} />);

    expect(container).toHaveTextContent('π');
  });

  it('should render with proper HTML structure', () => {
    const node = fromJS({
      type: 'Identifier',
      value: 'test',
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<Identifier node={node} path={path} />);

    const span = container.firstElementChild;
    expect(span).toBeInTheDocument();
    expect(span).toHaveClass('expression', 'identifier');
  });

  it('should handle SWC TypeScript identifier with value field', () => {
    const node = fromJS({
      type: 'Identifier',
      span: { start: 0, end: 4 },
      ctxt: 1,
      value: 'test',
      optional: false,
      typeAnnotation: null,
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<Identifier node={node} path={path} />);

    expect(container).toHaveTextContent('test');
    expect(
      container.querySelector('.expression.identifier'),
    ).toBeInTheDocument();
  });

  it('should prefer value over name if both exist', () => {
    const node = fromJS({
      type: 'Identifier',
      value: 'preferredValue',
      name: 'fallbackName',
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<Identifier node={node} path={path} />);

    expect(container).toHaveTextContent('preferredValue');
  });
});
