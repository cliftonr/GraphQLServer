const { gql } = require('apollo-server')

const serviceModelTypeDef = gql`
	# Common interface for all models returned by the service.
	interface ServiceModel {

		# The object's unique identifier.
		id: ID!

		# The date on which the object was created.
		created: String!

		# The date on which the object was last changed.
		changed: String!

		# Whether the object has been deleted. (Soft deletion.)
		isDeleted: Boolean!
	}
`;

module.exports = serviceModelTypeDef;
