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

		# Description for the set.
		isDeleted: Boolean
	}

	# A collection of user-generated content.
	type StudySet {
		# Set's unique identifier.
		id: String!

		# Title for the set.
		title: String!

		# Optional description for the set.
		description: String

		# The terms contained in the set.
		terms: [StudyTerm]!

		# The user who created the set.
		creator: User!

		# The date on which the set was created.
		created: String!

		# The date on which the set was last changed.
		changed: String!

		# Whether the set has been deleted. (Soft deletion.)
		isDeleted: Boolean!
	}

	extend type Query {
		# Get set with given id.
		studySet(id: String): StudySet
	}

  	extend type Mutation {
  		# Create a study set which belongs to a user with the given creatorId.
  		createSet(creatorId: String!, input: StudySetInput!): StudySet

  		# Update a study set with the given setId.
  		updateSet(setId: String!, input: StudySetInput!): StudySet
  	}
`;

const studySetResolver = {
	Query: {
 		studySet: (_, { id }) => setsRepo.studySet(id),
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
  		creator: studySet => usersRepo.user(studySet.creator_id),
  	},
};

module.exports = { studySetTypeDef, studySetResolver };