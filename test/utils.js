import test from 'ava';
import React from 'react';
import {
  Jile
} from 'jile/lib/Jile';

import {
  createMetaJile,
  getCachedJile,
  getCleanOptions,
  getJileId,
  getMetaJile,
  getStylesFromProps,
  updateMetaJile
} from 'src/utils';

const META_JILE_KEYS = [
  'component',
  'counter',
  'jile',
  'options'
];

const UUID_REGEXP = /jile_[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i;

URL.createObjectURL = () => {};

test('if createMetaJile creates the property jile object', (t) => {
  const component = 'foo';
  const styles = {
    '.foo': {
      display: 'block'
    }
  };
  const options = {};

  const result = createMetaJile(component, styles, options);
  const expectedResultMinusJile = {
    component,
    counter: 0,
    options
  };

  t.deepEqual(Object.keys(result), META_JILE_KEYS);

  META_JILE_KEYS.forEach((key) => {
    if (key === 'jile') {
      t.true(result[key] instanceof Jile);
    } else {
      t.deepEqual(result[key], expectedResultMinusJile[key]);
    }
  });
});

test('if getCachedJile will retrieve the item in cache if it matches, else return null', (t) => {
  const Foo = () => {
    return (
      <div/>
    );
  };
  const styles = {
    '.foo': {
      display: 'block'
    }
  };
  const id = 'foo';
  const options = {
    autoMount: false,
    id
  };

  const j = getMetaJile(Foo, styles, options);

  const nullResult = getCachedJile({});

  t.is(nullResult, null);

  const matchingResult = getCachedJile(Foo, id);

  t.is(matchingResult, j);
});

test('if getCleanOptions returns a shallow clone of the object passed, with overrides for id and autoMount', (t) => {
  const id = 'bar';
  const foo = {
    foo: 'foo'
  };

  const expectedResult = {
    ...foo,
    autoMount: false,
    id
  };
  const result = getCleanOptions(foo, id);

  t.deepEqual(result, expectedResult);
});

test('if getJileId returns the parameter when passed one', (t) => {
  const id = 'foo';
  const result = getJileId({
    id
  });

  t.is(result, id);
});

test('if getJileId returns a generated ID when not passed on', (t) => {
  const result = getJileId();

  t.regex(result, UUID_REGEXP);
});

test('if getMetaJile returns the correct metadata object', (t) => {
  const Foo = () => {
    return (
      <div/>
    );
  };
  const styles = {
    '.foo': {
      display: 'block'
    }
  };
  const options = {
    autoMount: false,
    id: 'foo'
  };

  const j = getMetaJile(Foo, styles, options);

  t.deepEqual(Object.keys(j), META_JILE_KEYS);
  t.is(j.component, Foo);
  t.is(j.counter, 0);
  t.true(j.jile instanceof Jile);
  t.deepEqual(j.options, options);
});

test('if getStylesFromProps returns the result of the fn passed to it', (t) => {
  const fn = (foo) => {
    return foo;
  };
  const bar = {
    bar: 'bar'
  };

  const result = getStylesFromProps(fn, bar);

  t.is(result, bar);
});

test('if getStylesFromProps throws when the result of the call is not a plain object', (t) => {
  const fn = () => {
    return 'foo';
  };
  const bar = {
    bar: 'bar'
  };

  t.throws(() => {
    getStylesFromProps(fn, bar);
  });
});

test('if updateMetaJile updates the cached MetaJile', (t) => {
  const Foo = () => {
    return (
      <div/>
    );
  };
  const styles = {
    '.foo': {
      display: 'block'
    }
  };
  const options = {
    autoMount: false,
    id: 'foo'
  };

  const j = getMetaJile(Foo, styles, options);

  const newStyles = {
    '.foo': {
      display: 'inline-block'
    }
  };

  const result = updateMetaJile(newStyles, j);

  t.not(result, j);
  t.not(result.jile, j.jile);
});