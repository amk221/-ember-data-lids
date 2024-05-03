import RESTSerializer, {
  EmbeddedRecordsMixin,
} from '@ember-data/serializer/rest';
const { isArray } = Array;

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

  extractRelationship(relationshipModelName, relationshipHash) {
    const json = super.extractRelationship(...arguments);

    // console.log('extractRelationship', JSON.stringify(json, null, 2));

    return json;
  }

  extractRelationships(modelClass, resourceHash) {
    const json = super.extractRelationships(...arguments);

    // console.log('extractRelationships', JSON.stringify(json, null, 2));

    return json;
  }

  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    const json = super.normalizeResponse(
      store,
      primaryModelClass,
      payload,
      id,
      requestType,
    );

    console.log('noramlizeResponse', JSON.stringify(json, null, 2));

    return json;
  }
}
