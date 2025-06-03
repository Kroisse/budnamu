import React from 'react';

export const OpenParen: React.FC = () => <span className="paren-open">(</span>;
export const CloseParen: React.FC = () => (
  <span className="paren-close">)</span>
);
export const OpenBrace: React.FC = () => (
  <span className="paren-open">{'{'}</span>
);
export const CloseBrace: React.FC = () => (
  <span className="paren-close">{'}'}</span>
);
export const OpenBracket: React.FC = () => (
  <span className="paren-open">[</span>
);
export const CloseBracket: React.FC = () => (
  <span className="paren-close">]</span>
);
