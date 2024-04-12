import ApplicationSerializer from './application';

export default class FooSerializer extends ApplicationSerializer {
  attrs = {
    bars: {
      embedded: 'always',
    },
    baz: {
      embedded: 'always',
    },
  };
}
