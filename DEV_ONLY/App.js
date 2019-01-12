import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {render} from 'react-dom';

import jile from '../src';

const styles = {
  '.foo': {
    color: 'red',
  },
  'html, body': {
    margin: 0,
    padding: 0,
  },
};

class Div extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    const {children, selectors} = this.props;

    return <div className={selectors.foo}>{children}</div>;
  }
}

const getSectionStyles = ({renderCount}) => {
  const color = renderCount % 2 === 0 ? 'blue' : 'green';

  return {
    '.foo': {
      color,
    },
  };
};

const StyledDiv = jile(styles)(Div);

const UnwrappedSection = ({children, selectors}) => <section className={selectors.foo}>{children}</section>;
const Section = jile(getSectionStyles)(UnwrappedSection);

class App extends Component {
  render() {
    const {renderCount} = this.props;

    return (
      <main>
        <h1>App</h1>

        {renderCount > 0 && <StyledDiv>First div</StyledDiv>}

        {renderCount > 1 && <StyledDiv>Second div</StyledDiv>}

        {renderCount !== 0 && <Section renderCount={renderCount}>Section</Section>}

        <Section renderCount={renderCount + 1}>Section</Section>
      </main>
    );
  }
}

const div = document.createElement('div');

render(<App renderCount={2} />, div);

setTimeout(() => {
  render(<App renderCount={1} />, div);
}, 5000);

setTimeout(() => {
  render(<App renderCount={0} />, div);
}, 10000);

setTimeout(() => {
  render(<App renderCount={1} />, div);
}, 15000);

setTimeout(() => {
  render(<App renderCount={2} />, div);
}, 20000);

document.body.appendChild(div);
