import Model, { attr } from '@ember-data/model';

export default class BarModel extends Model {
  @attr('string') name;
  // @attr('boolean', { defaultValue: false }) _delete;
}
