const setsRepo = require('../data/setsRepo').setsRepo;
const termsRepo = require('../data/termsRepo').termsRepo;

const studyTermTypeDef = `
	# A basic unit of user-generated content.
	type StudyTerm {
		# Term's unique identifier.
		id: String!

		# The "word" side of a term.
		word: String!

		# The "definition" side of a term.
		definition: String!

		# The set which contains the term.
		parentSet: StudySet!
	}
`;

const studyTermResolver = {
  	StudyTerm: {
  		parentSet: studyTerm => setsRepo.studySet(studyTerm.parent_set_id),
  	},
};

module.exports = { studyTermTypeDef, studyTermResolver };
