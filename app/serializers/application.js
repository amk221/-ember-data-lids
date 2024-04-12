import RESTSerializer, {
  EmbeddedRecordsMixin,
} from '@ember-data/serializer/rest';

export default class ApplicationSerializer extends RESTSerializer.extend(
  EmbeddedRecordsMixin,
) {
  serialize(snapshot, options) {
    const json = super.serialize(snapshot, options);

    json.lid = snapshot.identifier.lid;

    console.log('serialize', json.lid, json);

    return json;
  }

  normalize(typeClass, resourceHash) {
    const result = super.normalize(...arguments);

    result.data.lid = resourceHash.lid;

    console.log('normalize', resourceHash.lid, resourceHash);

    return result;
  }
}
