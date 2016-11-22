# react-jile

Manage your React component styles with jile automagically

#### Installation

```
$ npm i react-jile --save
```

#### Usage

```javascript
import React from 'react';
import jile from 'react-jile';

// create your jile styles
const styles = {
  '.foo': {
    color: 'red'
  }
};

// and pass them to the decorator for the class
@jile(styles)
class Foo extends React.Component {
  render() {
    const {
      selectors
    } = this.props;
    
    return (
      <div className={selectors.foo}>
        I have red-colored font!
      </div>
    );
  }
}

const Bar = ({selectors]) => {
  return (
    <div className={selectors.foo}>
      I have red-colored font!
    </div>
  );
};

// works with functional components too
const JiledBar = jile(styles)(Bar);
```

#### How it works

Most of the magic is handled internally by [`jile`](https://github.com/planttheidea/jile), which will automatically parse, prefix, and inject the styles object you pass into the document head, allowing full CSS capabilities written in pure JS. This component merely provides a convenient decorator to use on React components, and also manages the style tag for you (no duplicate injections, auto addition / removal from DOM when all instances of the component are mounted / unmounted, etc.). In a majority of cases all you will need are the `selectors`, which are the scoped selectors created by the `jile` process, which are available on props. Additionally available on props is the full `jile` instance, which will likely not be used but in case you want it ... there ya go.

#### Advanced usage

*Options*

`react-jile` accepts all arguments that the standard `jile` method does, so if you pass it additional options it will respect those as well:

```javascript
import React from 'react';
import jile from 'react-jile';

const globalStyles = {
  'html, body': {
    margin: 0,
    padding: 0
  }
};
const options = {
  hashSelectors: false
};

@jile(globalStyles, options)
class App extends React.Component {
  ...
}
```

The available options are explained in detail on the [jile github README](https://github.com/planttheidea/jile/blob/master/README.md).

*Using props to calculate styles*

In addition to the standard `jile` usage of passing a plain object of styles, you can instead pass a function as the styles parameter. This function will accept the current props, and should return a plain object of styles:

```javascript
import React from 'react';
import jile from 'react-jile';

const getStyles = (props) => {
  const pseudoElement = !props.isLoading ? {} : {
    '&:after': {
      content: 'Loading...',
      display: 'block'
    }
  };
  
  return {
    '.foo': pseudoElement
  };
};

@jile(getStyles)
class Page extends React.Component {
  render() [
    const {
      children,
      selectors
    } = this.props;
  
    return (
      <div className={selectors.foo}>
        {children}
      </div>
    );
  };
}
```

The caveat here is that these styles are *not instance-specific*, meaning on a reusable component there will only be a single stylesheet created. I consider this a shortcoming, so if you have any ideas about how to allow instance-specific styling let me know!

#### Development

Pretty standard stuff, pull down the repo and `npm i`. There are some built-in scripts:
* `build` = runs webpack to build dist/jile.js
* `build:minified` = runs webpack to build dist/jile.min.js
* `clean` => runs rimraf to remove `lib` and `dist` folders
* `dev` => runs example app on localhost:3000 (it's a playground, have fun)
* `lint` => runs eslint on all files in `src`
* `prepublish:compile` = runs `clean`, `lint`, `test`, `transpile`, `build`, and `build:minified` scripts
* `start` = runs `dev` script
* `test` = runs [AVA](https://github.com/avajs/ava) test scripts
* `test:watch` runs `test`, but with persistent watcher
* `transpile` = transpiles files in `src` to `lib`

Happy jiling!
