import { setIdentifierGenerationMethod } from '@ember-data/store';
import { dasherize } from '@ember/string';

export function initialize() {
  const counts = {};

  setIdentifierGenerationMethod((data) => {
    const type = dasherize(data.type);

    if (!counts[type]) {
      counts[type] = 0;
    }

    const id = data.id || `new:${++counts[type]}`;

    const lid = `${type}:${id}`;

    // console.log('generate lid', lid, data);

    return data.lid || lid;
  });
}

export default {
  name: 'ember-data',
  initialize,
};
