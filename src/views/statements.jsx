import React from 'react';
import { Map } from 'immutable';
import { Context } from './constructs.jsx';
import { dispatchExpression, dispatchPattern } from './expressions.jsx';
import * as utils from './utils.jsx';
const { openBrace, closeBrace, openParen, closeParen } = utils;

const statements = {
  VariableDeclaration: ({ expression = false, ...props }) => {
    const context = new Context(props);

    const renderDeclaration = (context, i) => {
      const id = context.child('id').render(dispatchPattern);
      const init = context.child('init').render(dispatchExpression);
      if (init !== null) {
        return (
          <span className="declaration" key={i}>
            {id} <span className="operator">{'='}</span> {init}
          </span>
        );
      } else {
        return (
          <span className="declaration" key={i}>
            {id}
          </span>
        );
      }
    };

    const declarations = context
      .child('declarations')
      .elements()
      .map(renderDeclaration);
    const declarationsList = utils.commaSeparated(declarations);
    const tag = expression ? 'span' : 'div';
    return React.createElement(
      tag,
      {
        className:
          (expression ? 'expression' : 'statement') + ' variable-declaration',
      },
      <span className="keyword" style={{ width: '5ex' }}>
        var{' '}
      </span>,
      <span className="declarations">
        {declarationsList}
        {expression ? '' : ';'}
      </span>,
    );
  },

  FunctionDeclaration: (props) => {
    return utils.renderFunction(new Context(props));
  },

  ClassDeclaration: (props) => {
    const context = new Context(props);
    const id = context.child('id').render(dispatchExpression);
    let superClass = context.child('superClass');
    const body = context.child('body').child('body');
    if (!superClass.isEmpty()) {
      superClass = (
        <span>
          {' '}
          <span className="keyword">extends</span>{' '}
          {superClass.render(dispatchExpression)}
        </span>
      );
    } else {
      superClass = null;
    }
    return (
      <div className="statement class-declaration">
        <span className="keyword">class</span> {id}
        {superClass} {utils.openBrace}
        {body.blockConstruct(dispatchStatement)}
        {utils.closeBrace}
      </div>
    );
  },

  MethodDefinition: (props) => {
    const context = new Context(props);
    const key = context.child('key').render(dispatchExpression);
    const value = context.child('value').render(dispatchExpression);
    return (
      <div className="statement method-definition">
        {key}: {value}
      </div>
    );
  },

  ExpressionStatement: (props) => {
    return (
      <div className="statement expression-statement">
        {new Context(props).child('expression').render(dispatchExpression)};
      </div>
    );
  },

  BlockStatement: (props) => {
    return (
      <span className="statement block-statement">
        {openBrace}
        {new Context(props).child('body').blockConstruct(dispatchStatement)}
        {closeBrace}
      </span>
    );
  },

  IfStatement: (props) => {
    const _renderDepth = (context, dispatcher, depth) => {
      return context.render((e, _, p) =>
        dispatcher(e, p.takeLast(depth).join('.'), p),
      );
    };

    const renderElseClause = (context, depth = 1) => {
      if (context.isEmpty()) {
        return null;
      }

      if (context.node.get('type') === 'IfStatement') {
        return (
          <>
            {' '}
            <span className="keyword">else</span>{' '}
            {renderIfClause(context, depth + 1)}
          </>
        );
      } else {
        const body = _renderDepth(context, dispatchStatement, depth);
        return (
          <>
            {' '}
            <span className="keyword">else</span> {body}
          </>
        );
      }
    };

    const renderIfClause = (context, depth = 1) => {
      const test = _renderDepth(
        context.child('test'),
        dispatchExpression,
        depth,
      );
      const consequent = _renderDepth(
        context.child('consequent'),
        dispatchStatement,
        depth,
      );

      return (
        <>
          <span className="keyword">if</span> {openParen}
          {test}
          {closeParen} {consequent}
          {renderElseClause(context.child('alternate'), depth)}
        </>
      );
    };

    return (
      <div className="statement if-statement">
        {renderIfClause(new Context(props))}
      </div>
    );
  },

  SwitchStatement: (props) => {
    const context = new Context(props);

    const renderCase = (caseClause, i) => {
      const consequent = caseClause
        .child('consequent')
        .blockConstruct(dispatchStatement);
      let header;
      const test = caseClause.child('test');
      if (!test.isEmpty()) {
        header = (
          <div className="case-header">
            <span className="keyword">case</span>{' '}
            {test.render(dispatchExpression)}:
          </div>
        );
      } else {
        header = (
          <div className="case-header">
            <span className="keyword">default</span>:
          </div>
        );
      }
      return (
        <div key={i} className="case-clause">
          {header}
          {consequent}
        </div>
      );
    };

    const discriminant = context
      .child('discriminant')
      .render(dispatchExpression);
    const caseClauses = context
      .child('cases')
      .elements()
      .map(renderCase)
      .toArray();
    return (
      <div className="statement switch-statement">
        <span className="statement-header">
          <span className="keyword">switch</span> {openParen}
          {discriminant}
          {closeParen}
        </span>{' '}
        {openBrace}
        <div className="switch-body">{caseClauses}</div>
        <span className="statement-footer">{closeBrace}</span>
      </div>
    );
  },

  WhileStatement: (props) => {
    const context = new Context(props);
    const test = context.child('test').render(dispatchExpression);
    const body = context.child('body').render(dispatchStatement);
    return (
      <div className="statement while-statement">
        <span className="statement-header">
          <span className="keyword">while</span> {openParen}
          {test}
          {closeParen}
        </span>{' '}
        {body}
      </div>
    );
  },

  DoWhileStatement: (props) => {
    const context = new Context(props);
    const test = context.child('test').render(dispatchExpression);
    const body = context.child('body').render(dispatchStatement);
    return (
      <div className="statement do-while-statement">
        <span className="statement-header">
          <span className="keyword">do</span>
        </span>{' '}
        {body}{' '}
        <span className="statement-footer">
          <span className="keyword">while</span> {openParen}
          {test}
          {closeParen};
        </span>
      </div>
    );
  },

  ForStatement: (props) => {
    const context = new Context(props);
    const init = renderForStatementInit(context.child('init'));
    const test = context.child('test').render(dispatchExpression);
    const update = context.child('update').render(dispatchExpression);
    const body = context.child('body').render(dispatchStatement);
    return (
      <div className="statement for-statement">
        <span className="statement-header">
          <span className="keyword">for</span> {openParen}
          {init}; {test}; {update}
          {closeParen}
        </span>{' '}
        {body}
      </div>
    );
  },

  ForInStatement: (props) => {
    const context = new Context(props);
    const left = renderForStatementInit(context.child('left'));
    const right = context.child('right').render(dispatchExpression);
    const body = context.child('body').render(dispatchStatement);
    return (
      <div className="statement for-statement">
        <span className="statement-header">
          <span className="keyword">for</span> {openParen}
          {left} <span className="keyword">in</span> {right}
          {closeParen}
        </span>{' '}
        {body}
      </div>
    );
  },

  LabeledStatement: (props) => {
    const context = new Context(props);
    const label = context.child('label').render(dispatchExpression);
    const body = context.child('body').render(dispatchStatement);
    return (
      <div className="statement labeled-statement">
        <span className="label">{label}</span>: {body}
      </div>
    );
  },

  TryStatement: (props) => {
    const context = new Context(props);

    const renderCatchClause = (context, i) => {
      const param = context.child('param').render(dispatchExpression);
      const body = context.child('body').render(dispatchStatement);
      return (
        <span key={i} className="catch-clause">
          <span className="keyword">catch</span> ({param}) {body}
        </span>
      );
    };

    const renderFinallyClause = (context) => {
      const finalizer = context.child('finalizer');
      if (finalizer.isEmpty()) {
        return null;
      }
      const finalizerRendered = finalizer.render(dispatchStatement);
      return (
        <span className="finally-clause">
          {' '}
          <span className="keyword">finally</span> {finalizerRendered}
        </span>
      );
    };

    const block = context.child('block').render(dispatchStatement);
    const catchClause = renderCatchClause(context.child('handler'));
    const guardedCatchClauses = context
      .child('guardedHandlers')
      .elements()
      .map(renderCatchClause);
    return (
      <div className="statement try-statement">
        <span className="statement-header">
          <span className="keyword">try</span>
        </span>{' '}
        {block} {catchClause} {guardedCatchClauses}{' '}
        {renderFinallyClause(context)}
      </div>
    );
  },

  ReturnStatement: (props) => {
    return renderReturnStatement(
      'return',
      new Context(props).child('argument'),
    );
  },

  ThrowStatement: (props) => {
    return renderReturnStatement('throw', new Context(props).child('argument'));
  },

  ContinueStatement: (props) => {
    return renderReturnStatement('continue', new Context(props).child('label'));
  },

  BreakStatement: (props) => {
    return renderReturnStatement('break', new Context(props).child('label'));
  },
};

function renderForStatementInit(context) {
  if (context.isEmpty()) {
    return null;
  }
  if (context.node.get('type') === 'VariableDeclaration') {
    return (
      <statements.VariableDeclaration
        key={context.key}
        expression={true}
        node={context.node}
        path={context.path}
      />
    );
  } else {
    return context.render(dispatchExpression);
  }
}

function renderReturnStatement(keyword, argument) {
  const className = 'statement ' + keyword + '-statement';
  if (!argument.isEmpty()) {
    return (
      <div className={className}>
        <span className="keyword">{keyword}</span>{' '}
        {argument.render(dispatchExpression)};
      </div>
    );
  } else {
    return (
      <div className={className}>
        <span className="keyword">{keyword}</span>;
      </div>
    );
  }
}

const UnknownStatement = (props) => {
  const inspect = () => {
    console.log(props.node);
  };

  const e = JSON.stringify(props.node);
  return (
    <div className="statement unknown-statement">
      <span className="inner" onClick={inspect}>
        {'<<'} unknown: {e} {'>>'}
      </span>
    </div>
  );
};

function dispatchStatement(e, key, path) {
  const elem = statements[e.get('type')];
  if (typeof elem !== 'undefined') {
    return React.createElement(elem, { key: key, node: e, path: path });
  } else {
    return <UnknownStatement key={key} node={e} path={path} />;
  }
}

export default Map(statements)
  .merge({ dispatchStatement: dispatchStatement })
  .toObject();

export { dispatchStatement };
