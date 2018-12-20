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
	type StudyTerm {
		# Term's unique identifier.
		id: String!

		# The "word" side of a term.
		word: String!

		# The "definition" side of a term.
		definition: String!

		# The set to which the term belongs.
		parentSet: StudySet!

		# The date on which the term was created.
		created: String!

		# The date on which the term was last changed.
		changed: String!

		# Whether the term has been deleted. (Soft deletion.)
		isDeleted: Boolean!
	}

	extend type Mutation {
  		# Add study term(s) to a set with the given setId.
  		addTerms(setId: String!, input: [StudyTermInput!]!): [StudyTerm]!

  		# Update a study term with the given termId.
  		updateTerm(termId: String!, input: StudyTermInput!): StudyTerm
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
