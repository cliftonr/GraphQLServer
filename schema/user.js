const setsRepo = require('../data/setsRepo').setsRepo;
const usersRepo = require('../data/usersRepo').usersRepo;

const userTypeDef = `

	# Input type suitable for creating/updating a user.
	input UserInput {

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
		sets: [StudySet]!
	}

	extend type Query {

		# Get all users.
		allUsers: [User]!
	}

	extend type Mutation {

  		# Add a user with the given username and email.
  		createUser(input: UserInput!): User
	}
`;

const userResolver = {

	Query: {

  		allUsers: () => usersRepo.allUsers(),
  	},

  	Mutation: {

		createUser: (_, { input }) => {
			const newUser = usersRepo.createUser(input.username, input.email);
			if (!newUser) {
				throw new Error("Failed to create user. (input: {input})");
			}
			return newUser;
		},
	},

  	User: {

  		sets: user => setsRepo.studySets(user.id),
  	},
};

module.exports = { userTypeDef, userResolver };
