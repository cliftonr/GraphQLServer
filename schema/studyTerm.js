const setsRepo = require('../data/setsRepo').setsRepo;
const termsRepo = require('../data/termsRepo').termsRepo;

const studyTermTypeDef = `

	# Input type suitable for adding/updating a term.
	input StudyTermInput {

		# The "word" side of a term.
		word: String

		# The "definition" side of a term.
		definition: String

		# Whether the term has been deleted. (Soft deletion.)
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

  		# Add study term(s) to a set with the given setId.
  		addTerms(setId: ID!, input: [StudyTermInput!]!): [StudyTerm]!

  		# Update a study term with the given termId.
  		updateTerm(termId: ID!, input: StudyTermInput!): StudyTerm
  	}
`;

const studyTermResolver = {

	Mutation: {

		addTerms: (_, { setId, input }) => {
			const newTerms = input.map(function (termInput) {
				const newTerm = termsRepo.createTerm(setId, termInput.word, termInput.definition);
				if (!newTerm) {
					throw new Error("Failed to add term. (setId: {setId}, termInput: {termInput})");
				}

				return newTerm
			});

			return newTerms;
		},

		updateTerm: (_, { termId, input }) => {
			const updatedTerm = termsRepo.updateTerm(termId, input.word, input.definition, input.isDeleted);
			if (!updatedTerm) {
				throw new Error("Failed to update term. (termId: {termId}, input: {input})");
			}
			return updatedTerm;
		},
  	},

  	StudyTerm: {

  		parentSet: studyTerm => setsRepo.studySet(studyTerm.parentSetId),
  	},
};

module.exports = { studyTermTypeDef, studyTermResolver };
