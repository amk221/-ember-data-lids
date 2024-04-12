import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class FooModel extends Model {
  @attr('string') name;
  @hasMany('bar', { async: false, inverse: null }) bars;
  @belongsTo('baz', { async: false, inverse: null }) baz;
  // @belongsTo('foo', { async: false, inverse: null }) parentFoo;
}
