import RESTSerializer, {
  EmbeddedRecordsMixin,
} from '@ember-data/serializer/rest';

export default class ApplicationSerializer extends RESTSerializer.extend(
  EmbeddedRecordsMixin,
) {
  serialize(snapshot, options) {
    const json = super.serialize(snapshot, options);

    json.lid = snapshot.identifier.lid;

    // console.log('serialize', json.lid, JSON.stringify(json, null, 2));

    return json;
  }

  normalize(typeClass, resourceHash) {
    const json = super.normalize(...arguments);

    json.data.lid = resourceHash.lid;

    // console.log('normalize', resourceHash.lid, JSON.stringify(json, null, 2));

    return json;
  }

  _extractEmbeddedHasMany(store, key, hash, relationshipMeta) {
    const relationshipHash = hash.data?.relationships?.[key]?.data;
    super._extractEmbeddedHasMany(store, key, hash, relationshipMeta);

    if (!relationshipHash) {
      return;
    }
    const newHash = hash.data.relationships[key].data;
    newHash.forEach((item, index) => {
      const lid = relationshipHash[index].lid;
      if (lid) {
        item.lid = lid;
      }
    });
  }

  _extractEmbeddedBelongsTo(store, key, hash, relationshipMeta) {
    const relationshipHash = hash.data?.relationships?.[key]?.data;
    super._extractEmbeddedBelongsTo(store, key, hash, relationshipMeta);

    if (!relationshipHash?.lid) {
      return;
    }
    hash.data.relationships[key].data.lid = relationshipHash.lid;
  }

  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    const json = super.normalizeResponse(
      store,
      primaryModelClass,
      payload,
      id,
      requestType,
    );

    return json;
  }
}
