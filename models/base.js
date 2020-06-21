const validatorTemplate = {
	$jsonSchema: {
		type: 'object',
		properties: {
			bsonType: {
				type: 'string',
				values: [
					"double",
					"string",
					"object",
					"array",
					"binData",
					"objectId",
					"bool",
					"date",
					"null",
					"regex",
					"javascript",
					"int",
					"timestamp",
					"long",
					"decimal",
					"minKey",
					"maxKey"
				]
			},
			required: {
				type: 
			}
		}
	}
};

module.exports = (model) => {
	return {
		name: model.name,
		validator: model.validator
	};
};
