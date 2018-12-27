const setsRepo = require('../data/setsRepo').setsRepo
const usersRepo = require('../data/usersRepo').usersRepo
const { gql } = require('apollo-server')

const userTypeDef = gql`
	# Input type suitable for user-creation.
	input CreateUserInput {

		# User's unique handle.
		username: String!

		# User's unique email address.
		email: String!
	}

	# A user can create content on the platform.
	type User implements ServiceModel {

		# See interface: ServiceModel.
		id: ID!

		# See interface: ServiceModel.
		created: String!

		# See interface: ServiceModel.
		changed: String!

		# See interface: ServiceModel.
		isDeleted: Boolean!

		# User's unique handle.
		username: String!

		# User's unique email address.
		email: String!

		# Sets created by the user.
		sets: [StudySet]
	}

	extend type Query {

		# Get all users.
		allUsers: [User!]!
	}

	extend type Mutation {

  		# Create a user with the given username and email.
  		createUser(input: CreateUserInput!): User!
	}
`;

const userResolver = {

	Query: {

  		allUsers: () => usersRepo.allUsers(),
  	},

  	Mutation: {

		createUser: (_, { input }) => {
			const createdUser = usersRepo.createUser(input.username, input.email);
			if (!createdUser) {
				throw new Error("Failed to create user. (input: {input})");
			}
			return createdUser;
		},
	},

  	User: {

  		sets: user => setsRepo.studySets(user.id),
  	},
};

module.exports = { userTypeDef, userResolver };
