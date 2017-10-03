### Toolchain for testing
As of now, this project is configured to run all the tests written using *[Jasmine](https://jasmine.github.io/)* testing framework. *[Karma](https://karma-runner.github.io/)* is used as the test runner.

The following configuration files are used for *karma*:
- `karma.conf.js` - to configure *karma*
- `webpack.karma.context.js` - to include `ngMocks` and all `.spec.js` files in *webpack* build

### Running the tests
#### Single run
*Karma* will start and capture all configured browsers, run the tests and then terminate with an exit code of `0` or `1` depending on whether all tests passed or any test failed.
```bash
npm test
```
#### Indefinite run
*Karma* will run all the tests once. If any watched file changes, *Karma* will re-run the tests.
```bash
karma start
```
You should use this during development

### Testing of Angular JS 1.X applications
#### Using Angular context
[`angular.mock.module`](https://docs.angularjs.org/api/ngMock/function/angular.mock.module) is used for initializing the whole *angular* application, and [`angular.mock.inject`](https://docs.angularjs.org/api/ngMock/function/angular.mock.inject) is used to resolve references. For example:

```js
import angular from 'angular';

describe('Test myService', () => {
    // Defined out reference variable outside
    let myService;

    // Initialize angular module to make all services, components,
    // controllers etc. to be available
    beforeEach(angular.mock.module('App'));

    // Wrap the parameter in underscores
    beforeEach( inject(_myService_ => {
      myService = _myService_;
    }));

    // Use myService in a series of tests.
    it('makes use of myService', function() {
      myService.doStuff();
    });    
});
```

In case of large applications, `angular.mock.module('App')` will be slow. If you have thousands of test cases, then it may take lot of time to run all the tests.

#### Using ES6 modules
If using ES6 modules, we can write test cases for an individual service, controller or component if it is not dependant on services from other modules.
```js
import angular from 'angular';
import {MyService} from './my-module.js';

describe('Test myService', () => {
    // Defined out reference variable outside
    let myService;

    beforeEach( () => {
      myService = new MyService();
    });

    // Use myService in a series of tests.
    it('makes use of myService', function() {
      myService.doStuff();
    });    
});
```

You can read more about it in detail in this [blog post](https://blog.ngconsultant.io/proper-testing-of-angular-js-applications-with-es6-modules-8cf31113873f).


### Caveats
Angular modules behave like a global reference. It restricts you from adding new states using `$stateProvider.state()` inside `beforeEach()`. You can register a state just once.

However, `.register()` methods of various providers in metabolica, e.g. `$sharing`, '$clipboard' etc, just override the previous value if same key is used. It follows that, if you're using the same key (with a different value) for a particular service in two different `_.spec.js_ files, then one key will override the other and you may get unexpected results in your tests.

This should be fixed or we should write tests in a different way to avoid this behaviour.
