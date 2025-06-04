import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Seq } from 'immutable';
import {
  commaSeparated,
  Enclose,
  FunctionHeader,
  OpenBrace,
  CloseBrace,
  OpenParen,
  CloseParen,
  OpenBracket,
  CloseBracket,
} from './utils';

describe('commaSeparated', () => {
  it('should return empty array for empty sequence', () => {
    const result = commaSeparated(Seq([]));
    expect(result).toEqual([]);
  });

  it('should return single element without comma for single item sequence', () => {
    const result = commaSeparated(Seq(['foo']));
    expect(result).toEqual(['foo']);
  });

  it('should separate two elements with comma and space', () => {
    const result = commaSeparated(Seq(['foo', 'bar']));
    expect(result).toEqual(['foo', ', ', 'bar']);
  });

  it('should separate multiple elements with commas', () => {
    const result = commaSeparated(Seq(['a', 'b', 'c', 'd']));
    expect(result).toEqual(['a', ', ', 'b', ', ', 'c', ', ', 'd']);
  });

  it('should handle React elements', () => {
    const elements = [
      <span key="1">A</span>,
      <span key="2">B</span>,
      <span key="3">C</span>,
    ];
    const result = commaSeparated(Seq(elements));
    expect(result).toHaveLength(5); // 3 elements + 2 commas
    expect(result[0]).toEqual(elements[0]);
    expect(result[1]).toEqual(', ');
    expect(result[2]).toEqual(elements[1]);
    expect(result[3]).toEqual(', ');
    expect(result[4]).toEqual(elements[2]);
  });

  it('should handle mixed content types', () => {
    const mixed = ['text', 123, <span key="el">Element</span>, null];
    const result = commaSeparated(Seq(mixed));
    expect(result).toHaveLength(7); // 4 elements + 3 commas
    expect(result[0]).toEqual('text');
    expect(result[2]).toEqual(123);
    expect(result[4]).toEqual(<span key="el">Element</span>);
    expect(result[6]).toEqual(null);
  });
});

describe('Enclose', () => {
  it('should wrap children with default parentheses', () => {
    const { container } = render(<Enclose>{['content']}</Enclose>);
    const openParen = container.querySelector('.paren-open');
    const closeParen = container.querySelector('.paren-close');

    expect(openParen?.textContent).toBe('(');
    expect(closeParen?.textContent).toBe(')');
    expect(container.textContent).toBe('(content)');
  });

  it('should wrap array of children with default parentheses', () => {
    const { container } = render(<Enclose>{['hello', ' ', 'world']}</Enclose>);
    expect(container.textContent).toBe('(hello world)');
  });

  it('should use custom open and close elements', () => {
    const { container } = render(
      <Enclose open={<span>[</span>} close={<span>]</span>}>
        {['content']}
      </Enclose>,
    );
    expect(container.textContent).toBe('[content]');
  });

  it('should handle React elements as children', () => {
    const { container } = render(
      <Enclose>
        {[<span key="1">A</span>, ', ', <span key="2">B</span>]}
      </Enclose>,
    );
    expect(container.textContent).toBe('(A, B)');
  });

  it('should handle empty children array', () => {
    const { container } = render(<Enclose>{[]}</Enclose>);
    expect(container.textContent).toBe('()');
  });
});

describe('FunctionHeader', () => {
  it('should render function keyword with identifier and empty params', () => {
    const { container } = render(<FunctionHeader id="myFunc" params={[]} />);

    expect(container.querySelector('.function-header')).toBeTruthy();
    expect(container.querySelector('.keyword')?.textContent).toBe('function');
    expect(container.textContent).toBe('function myFunc()');
  });

  it('should render function with parameters', () => {
    const { container } = render(
      <FunctionHeader id="add" params={['a', ', ', 'b']} />,
    );

    expect(container.textContent).toBe('function add(a, b)');
  });

  it('should handle React elements as identifier', () => {
    const { container } = render(
      <FunctionHeader
        id={<span className="identifier">calculate</span>}
        params={['x']}
      />,
    );

    expect(container.querySelector('.identifier')?.textContent).toBe(
      'calculate',
    );
    expect(container.textContent).toBe('function calculate(x)');
  });

  it('should handle complex parameter list', () => {
    const params = [
      <span key="1">param1</span>,
      ', ',
      <span key="2">param2</span>,
      ', ',
      <span key="3">...rest</span>,
    ];
    const { container } = render(
      <FunctionHeader id="complex" params={params} />,
    );

    expect(container.textContent).toBe(
      'function complex(param1, param2, ...rest)',
    );
  });

  it('should handle empty string as identifier', () => {
    const { container } = render(<FunctionHeader id="" params={[]} />);
    expect(container.textContent).toBe('function ()');
  });
});

describe('Bracket Components', () => {
  describe('OpenBrace', () => {
    it('should render opening brace with correct class', () => {
      const { container } = render(<OpenBrace />);
      const span = container.querySelector('.paren-open');
      expect(span).toBeTruthy();
      expect(span?.textContent).toBe('{');
    });
  });

  describe('CloseBrace', () => {
    it('should render closing brace with correct class', () => {
      const { container } = render(<CloseBrace />);
      const span = container.querySelector('.paren-close');
      expect(span).toBeTruthy();
      expect(span?.textContent).toBe('}');
    });
  });

  describe('OpenParen', () => {
    it('should render opening parenthesis with correct class', () => {
      const { container } = render(<OpenParen />);
      const span = container.querySelector('.paren-open');
      expect(span).toBeTruthy();
      expect(span?.textContent).toBe('(');
    });
  });

  describe('CloseParen', () => {
    it('should render closing parenthesis with correct class', () => {
      const { container } = render(<CloseParen />);
      const span = container.querySelector('.paren-close');
      expect(span).toBeTruthy();
      expect(span?.textContent).toBe(')');
    });
  });

  describe('OpenBracket', () => {
    it('should render opening bracket with correct class', () => {
      const { container } = render(<OpenBracket />);
      const span = container.querySelector('.paren-open');
      expect(span).toBeTruthy();
      expect(span?.textContent).toBe('[');
    });
  });

  describe('CloseBracket', () => {
    it('should render closing bracket with correct class', () => {
      const { container } = render(<CloseBracket />);
      const span = container.querySelector('.paren-close');
      expect(span).toBeTruthy();
      expect(span?.textContent).toBe(']');
    });
  });

  it('should render all brackets in sequence', () => {
    const { container } = render(
      <div>
        <OpenBrace />
        <OpenBracket />
        <OpenParen />
        <CloseParen />
        <CloseBracket />
        <CloseBrace />
      </div>,
    );
    expect(container.textContent).toBe('{[()]}');
  });
});
