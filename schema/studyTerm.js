const setsRepo = require('../data/setsRepo').setsRepo
const termsRepo = require('../data/termsRepo').termsRepo
const { gql } = require('apollo-server')

const studyTermTypeDef = gql`
	# Input type suitable for creating a new study term.
	input CreateStudyTermInput {

		# ID of the study set to which the study term shall be associated.
		parentSetId: ID!

		# The "word" side of a study term.
		word: String!

		# The "definition" side of a study term.
		definition: String!
	}

	# Input type suitable for batching the creation of new study terms.
	input CreateStudyTermsInput {

		# The study terms that shall be created.
		studyTerms: [CreateStudyTermInput!]!
	}

	# Input type suitable for updating an existing study term.
	input UpdateStudyTermInput {

		# ID of the study term for which an update shall occur.
		studyTermId: ID!

		# The "word" side of a study term.
		word: String

		# The "definition" side of a study term.
		definition: String

		# Whether the study term has been deleted. (Soft deletion.)
		isDeleted: Boolean
	}

	# A basic unit of user-generated content.
	type StudyTerm implements ServiceModel {

		# See interface: ServiceModel.
		id: ID!

		# See interface: ServiceModel.
		created: String!

		# See interface: ServiceModel.
		changed: String!

		# See interface: ServiceModel.
		isDeleted: Boolean!

		# The "word" side of a term.
		word: String!

		# The "definition" side of a term.
		definition: String!

		# The set to which the term belongs.
		parentSet: StudySet!
	}

	extend type Mutation {

  		# Create a new study term.
  		createStudyTerms(input: CreateStudyTermsInput!): [StudyTerm!]!

  		# Update an existing study term.
  		updateStudyTerm(input: UpdateStudyTermInput!): StudyTerm!
  	}
`;

const studyTermResolver = {

	Mutation: {

		createStudyTerms: (_, { input }) => {
			const createdTerms = input.studyTerms.map(function (studyTermInput) {
				const createdTerm = termsRepo.createTerm(studyTermInput.parentSetId, studyTermInput.word, studyTermInput.definition);
				if (!createdTerm) {
					throw new Error("Failed to create study term. (input: {studyTermInput})");
				}

				return createdTerm;
			});
			return createdTerms;
		},

		updateStudyTerm: (_, { input }) => {
			const updatedTerm = termsRepo.updateTerm(input.studyTermId, input.word, input.definition, input.isDeleted);
			if (!updatedTerm) {
				throw new Error("Failed to update study term. (input: {input})");
			}
			return updatedTerm;
		},
  	},

  	StudyTerm: {

  		parentSet: studyTerm => setsRepo.studySet(studyTerm.parentSetId),
  	},
};

module.exports = { studyTermTypeDef, studyTermResolver };
