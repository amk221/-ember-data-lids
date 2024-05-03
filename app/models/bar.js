import Model, { attr } from '@ember-data/model';

export default class BarModel extends Model {
  @attr() name;
  // @attr('boolean', { defaultValue: false }) _delete;
}
