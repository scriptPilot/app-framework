const create = (schema, path = ['root']) => {
  if (schema.type === 'string') {
    return schema.default !== undefined ? schema.default : '';
  } if (schema.type === 'number') {
    return schema.default !== undefined ? schema.default : 0;
  } if (schema.type === 'object') {
    if (typeof schema.properties === 'object' && schema.properties !== null) {
      const returnObject = {};
      Object.keys(schema.properties).forEach((key) => {
        returnObject[key] = create(schema.properties[key], [...path, key]);
      });
      return returnObject;
    } else {
      return schema.default !== undefined ? schema.default : {};
    }
  } else if (schema.type === 'array') {
    return schema.default !== undefined ? schema.default : [];
  } else if (schema.type === 'boolean') {
    return schema.default !== undefined ? schema.default : true;
  } else if (schema.type === 'null') {
    return null;
  } else {
    throw new Error('Unknown type in schema.');
  }
};

module.exports = {
  create(schema) {
    return create(schema);
  }
};
