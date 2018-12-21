const setsRepo = require('../data/setsRepo').setsRepo;
const termsRepo = require('../data/termsRepo').termsRepo;
const usersRepo = require('../data/usersRepo').usersRepo;

const studySetTypeDef = `

	# Input type suitable for creating/updating a user.
	input StudySetInput {

		# Title for the set.
		title: String

		# Description for the set.
		description: String

		# Whether the set has been deleted. (Soft deletion.)
		isDeleted: Boolean
	}

	# A collection of user-generated content.
	type StudySet implements ServiceModel {

		# See interface: ServiceModel.
		id: ID!

		# See interface: ServiceModel.
		created: String!

		# See interface: ServiceModel.
		changed: String!

		# See interface: ServiceModel.
		isDeleted: Boolean!

		# Title for the set.
		title: String!

		# Optional description for the set.
		description: String

		# The terms contained in the set.
		terms: [StudyTerm]!

		# The user who created the set.
		creator: User!
	}

	extend type Query {

		# Get set with given id.
		studySet(setId: ID!): StudySet

		# Get all sets belonging to user with creatorId.
		studySets(creatorId: ID!): [StudySet]!
	}

  	extend type Mutation {

  		# Create a study set which belongs to a user with the given creatorId.
  		createSet(creatorId: ID!, input: StudySetInput!): StudySet

  		# Update a study set with the given setId.
  		updateSet(setId: ID!, input: StudySetInput!): StudySet
  	}
`;

const studySetResolver = {

	Query: {

 		studySet: (_, { setId }) => setsRepo.studySet(setId),
 		studySets: (_, { creatorId }) => setsRepo.studySets(creatorId),
  	},

	Mutation: {

		createSet: (_, { creatorId, input }) => {
			const newSet = setsRepo.createSet(creatorId, input.title, input.description);
			if (!newSet) {
				throw new Error("Failed to create set. (creatorId: {creatorId}, input: {input})");
			}
			return newSet;
		},

		updateSet: (_, { setId, input }) => {
			const updatedSet = setsRepo.updateSet(setId, input.title, input.description, input.isDeleted);
			if (!updatedSet) {
				throw new Error("Failed to update set. (setId: {setId}, input: {input})");
			}
			return updatedSet;
		},
  	},

  	StudySet: {

  		terms: studySet => termsRepo.terms(studySet.id),
  		creator: studySet => usersRepo.user(studySet.creatorId),
  	},
};

module.exports = { studySetTypeDef, studySetResolver };
