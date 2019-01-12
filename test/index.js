import test from 'ava';
import {mount} from 'enzyme';
import React from 'react';
import isFunction from 'lodash/isFunction';

import jile from 'src/index';

URL.createObjectURL = () => {};

test('if jile decorator throws if the first parameter is not correct', (t) => {
  t.throws(() => {
    jile();
  });
});

test('if jile decorator returns a function', (t) => {
  const result = jile({});

  t.true(isFunction(result));
});

test('if jile decorator throws an error when the value passed to its return function is not a react component', (t) => {
  const styles = {
    display: 'block',
  };
  const decorator = jile(styles);
  const FunctionFoo = () => <div />;

  const functionResult = decorator(FunctionFoo);

  t.is(functionResult.name, 'JileComponent');

  class ClassFoo extends React.Component {
    render() {
      return <div />;
    }
  }

  const classResult = decorator(ClassFoo);

  t.is(Object.getPrototypeOf(classResult), React.Component);
});

test('if jile decorator returns a react component when called', (t) => {
  const styles = {
    display: 'block',
  };
  const decorator = jile(styles);
  const FunctionFoo = () => <div />;

  const functionResult = decorator(FunctionFoo);

  t.is(functionResult.name, 'JileComponent');

  class ClassFoo extends React.Component {
    render() {
      return <div />;
    }
  }

  const classResult = decorator(ClassFoo);

  t.is(Object.getPrototypeOf(classResult), React.Component);
});

test(
  'if component made from jile decorator has a constructor and a componentWillUnmount method but not ' +
    'a componentWillReceiveProps method if a plain object is passed',
  (t) => {
    const Foo = () => <div />;
    const styles = {
      '.foo': {
        display: 'block',
      },
    };
    const options = {
      autoMount: false,
      id: 'foo',
    };

    const JileComponent = jile(styles, options)(Foo);
    const wrapper = mount(<JileComponent />);

    t.not(wrapper.instance().constructor, undefined);
    t.is(wrapper.instance().componentWillReceiveProps, undefined);
    t.not(wrapper.instance().componentWillUnmount, undefined);
  }
);

test(
  'if component made from jile decorator has a constructor, a componentWillUnmount method, and ' +
    'a componentWillReceiveProps method if a function is passed',
  (t) => {
    const Foo = () => <div />;
    const styles = () => ({
      '.foo': {
        display: 'block',
      },
    });
    const options = {
      autoMount: false,
      id: 'foo',
    };

    const JileComponent = jile(styles, options)(Foo);
    const wrapper = mount(<JileComponent />);

    t.not(wrapper.instance().constructor, undefined);
    t.not(wrapper.instance().componentWillReceiveProps, undefined);
    t.not(wrapper.instance().componentWillUnmount, undefined);
  }
);
