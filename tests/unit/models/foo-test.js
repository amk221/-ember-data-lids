import { module, test } from 'qunit';
import { setupTest } from 'example/tests/helpers';
import Pretender from 'pretender';
import { recordIdentifierFor } from '@ember-data/store';

module('Unit | Model | foo', function (hooks) {
  setupTest(hooks);

  test('saving', async function (assert) {
    const server = new Pretender();
    const store = this.owner.lookup('service:store');
    const foo1 = store.createRecord('foo', { name: 'foo 1' });
    const bar1 = store.createRecord('bar', { name: 'bar 1' });
    const bar2 = store.createRecord('bar', { name: 'bar 2' });
    const baz1 = store.createRecord('baz', { name: 'baz 1' });

    foo1.bars = [bar1, bar2];
    foo1.baz = baz1;

    const { lid: foo1Lid } = recordIdentifierFor(foo1);
    const { lid: bar1Lid } = recordIdentifierFor(bar1);
    const { lid: bar2Lid } = recordIdentifierFor(bar2);
    const { lid: baz1Lid } = recordIdentifierFor(baz1);

    server.post('/foos', () => {
      return [
        200,
        {},
        JSON.stringify({
          foo: {
            id: 1,
            lid: foo1Lid,
            name: 'foo 1 (saved)',
            bars: [
              { id: 1, lid: bar1Lid, name: 'bar 1 (saved)' },
              { id: 2, lid: bar2Lid, name: 'bar 2 (saved)' },
            ],
            baz: {
              id: '1',
              lid: baz1Lid,
              name: 'baz 1 (saved)',
            },
          },
        }),
      ];
    });

    // Test that saving does not create duplicate records
    assert.strictEqual(foo1.name, 'foo 1');
    assert.strictEqual(foo1.bars[0].name, 'bar 1');
    assert.strictEqual(foo1.bars[1].name, 'bar 2');
    assert.strictEqual(foo1.baz.name, 'baz 1');
    assert.strictEqual(store.peekAll('foo').length, 1);
    assert.strictEqual(store.peekAll('bar').length, 2);
    assert.strictEqual(store.peekAll('baz').length, 1);
    assert.true(foo1.isNew, 'foo is new');
    assert.true(bar1.isNew, 'bar 1 is new');
    assert.true(bar2.isNew, 'bar 2 is new');
    assert.true(baz1.isNew, 'baz is new');

    await foo1.save();

    // initially the nested records will be dirty because the server in
    // our test is mutating the saved values. This is not a problem in
    // a real-world scenario.
    assert.strictEqual(foo1.name, 'foo 1 (saved)');
    assert.strictEqual(foo1.bars[0].name, 'bar 1');
    assert.strictEqual(foo1.bars[1].name, 'bar 2');
    assert.strictEqual(foo1.baz.name, 'baz 1');
    assert.false(foo1.hasDirtyAttributes, 'foo is not dirty');
    assert.true(bar1.hasDirtyAttributes, 'bar 1 is dirty');
    assert.true(bar2.hasDirtyAttributes, 'bar 2 is dirty');
    assert.true(baz1.hasDirtyAttributes, 'baz is dirty');
    assert.false(foo1.isNew, 'foo is not new');
    assert.false(bar1.isNew, 'bar 1 is not new');
    assert.false(bar2.isNew, 'bar 2 is not new');
    assert.false(baz1.isNew, 'baz is not new');

    // but if we rollback these records we will see the clean state the server
    // gave us
    bar1.rollbackAttributes();
    bar2.rollbackAttributes();
    baz1.rollbackAttributes();

    assert.strictEqual(foo1.name, 'foo 1 (saved)');
    assert.strictEqual(foo1.bars[0].name, 'bar 1 (saved)');
    assert.strictEqual(foo1.bars[1].name, 'bar 2 (saved)');
    assert.strictEqual(foo1.baz.name, 'baz 1 (saved)');
    assert.strictEqual(store.peekAll('foo').length, 1, 'we still have 1 foo');
    assert.strictEqual(store.peekAll('bar').length, 2, 'we still have 2 bars');
    assert.strictEqual(store.peekAll('baz').length, 1, 'we still have 1 baz');
  });
});
