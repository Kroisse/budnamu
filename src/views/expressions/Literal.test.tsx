import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { fromJS, List } from 'immutable';
import { Literal } from './Literal';
import type { ImmutableNode, ImmutablePath } from '../constructs';

describe('Literal', () => {
  it('should render string literal with correct class', () => {
    const node = fromJS({
      type: 'Literal',
      value: 'hello',
      raw: '"hello"',
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<Literal node={node} path={path} />);

    const element = container.querySelector(
      '.expression.literal.literal-string',
    );
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('"hello"');
  });

  it('should render number literal with correct class', () => {
    const node = fromJS({
      type: 'Literal',
      value: 42,
      raw: '42',
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<Literal node={node} path={path} />);

    const element = container.querySelector(
      '.expression.literal.literal-number',
    );
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('42');
  });

  it('should render boolean literal with correct class', () => {
    const node = fromJS({
      type: 'Literal',
      value: true,
      raw: 'true',
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<Literal node={node} path={path} />);

    const element = container.querySelector(
      '.expression.literal.literal-boolean',
    );
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('true');
  });

  it('should render null literal', () => {
    const node = fromJS({
      type: 'Literal',
      value: null,
      raw: 'null',
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<Literal node={node} path={path} />);

    const element = container.querySelector(
      '.expression.literal.literal-object',
    );
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('null');
  });

  it('should render regex literal', () => {
    const node = fromJS({
      type: 'Literal',
      value: {},
      raw: '/[a-z]+/i',
      regex: {
        pattern: '[a-z]+',
        flags: 'i',
      },
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<Literal node={node} path={path} />);

    const element = container.querySelector(
      '.expression.literal.literal-object',
    );
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('/[a-z]+/i');
  });

  it('should use raw value for display', () => {
    const node = fromJS({
      type: 'Literal',
      value: 'test\nwith\nnewlines',
      raw: '"test\\nwith\\nnewlines"',
    }) as ImmutableNode;
    const path: ImmutablePath = List(['expression']);

    const { container } = render(<Literal node={node} path={path} />);

    // Should display the raw value with escape sequences, not the actual newlines
    expect(container.textContent).toBe('"test\\nwith\\nnewlines"');
  });

  it('should handle numeric literals with different formats', () => {
    const testCases = [
      { value: 255, raw: '0xFF', desc: 'hexadecimal' },
      { value: 8, raw: '0o10', desc: 'octal' },
      { value: 3, raw: '0b11', desc: 'binary' },
      { value: 1000000, raw: '1e6', desc: 'exponential' },
      { value: 1000, raw: '1_000', desc: 'numeric separator' },
    ];

    testCases.forEach(({ value, raw }) => {
      const node = fromJS({
        type: 'Literal',
        value,
        raw,
      }) as ImmutableNode;
      const path: ImmutablePath = List(['expression']);

      const { container } = render(<Literal node={node} path={path} />);

      expect(container.textContent).toBe(raw);
      expect(container.querySelector('.literal-number')).toBeInTheDocument();
    });
  });
});
