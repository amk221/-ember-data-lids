import { module, test } from 'qunit';
import { setupTest } from 'example/tests/helpers';
import Pretender from 'pretender';
import { recordIdentifierFor } from '@ember-data/store';
const { parse, stringify } = JSON;

module('Unit | Model | foo', function (hooks) {
  setupTest(hooks);

  test('saving', async function (assert) {
    let lastPostRequest;

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

    server.post('/foos', (request) => {
      lastPostRequest = parse(request.requestBody);

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
    assert.strictEqual(store.peekAll('bar').length, 2);
    assert.strictEqual(store.peekAll('baz').length, 1);

    try {
      await foo1.save();
    } catch (error) {
      console.error(error.message);
    } finally {
      assert.strictEqual(foo1.name, 'foo 1 (saved)');
      assert.strictEqual(foo1.bars[0].name, 'bar 1 (saved)');
      assert.strictEqual(foo1.bars[1].name, 'bar 2 (saved)');
      assert.strictEqual(foo1.baz.name, 'baz 1 (saved)');
      assert.strictEqual(store.peekAll('bar').length, 2);
      assert.strictEqual(store.peekAll('baz').length, 1);

      console.log(stringify(lastPostRequest, null, 2));
    }
  });
});
