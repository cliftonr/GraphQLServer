const setsRepo = require('../data/setsRepo').setsRepo;
const termsRepo = require('../data/termsRepo').termsRepo;
const usersRepo = require('../data/usersRepo').usersRepo;

const studySetTypeDef = `

	# Input type suitable for creating a new study set.
	input CreateStudySetInput {

		# ID of the user who created the study set.
		creatorId: ID!

		# Title for the study set.
		title: String!

		# Description for the study set.
		description: String
	}

	# Input type suitable for updating an existing study set.
	input UpdateStudySetInput {

		# ID of the study set for which an update shall occur.
		studySetId: ID!

		# Title for the study set.
		title: String

		# Description for the study set.
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
		terms: [StudyTerm!]

		# The user who created the set.
		creator: User!
	}

	extend type Query {

		# Get set with given id.
		studySet(setId: ID!): StudySet

		# Get all sets belonging to user with creatorId.
		studySets(creatorId: ID!): [StudySet!]!
	}

  	extend type Mutation {

  		# Create a new study term.
  		createStudySet(input: CreateStudySetInput!): StudySet!

  		# Update an existing study set.
  		updateStudySet(input: UpdateStudySetInput!): StudySet!
  	}
`;

const studySetResolver = {

	Query: {

 		studySet: (_, { setId }) => setsRepo.studySet(setId),
 		studySets: (_, { creatorId }) => setsRepo.studySets(creatorId),
  	},

	Mutation: {

		createStudySet: (_, { input }) => {
			const createdSet = setsRepo.createSet(input.creatorId, input.title, input.description);
			if (!createdSet) {
				throw new Error("Failed to create study set. (input: {input})");
			}
			return createdSet;
		},

		updateStudySet: (_, { input }) => {
			const updatedSet = setsRepo.updateSet(input.studySetId, input.title, input.description, input.isDeleted);
			if (!updatedSet) {
				throw new Error("Failed to update study set. (input: {input})");
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
