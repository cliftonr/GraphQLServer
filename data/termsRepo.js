const db = require('./db').db;

class TermsRepository {

    constructor(db) {
        this.db = db;
    }

	// Get terms contained in the set identified by the given `setId`.
    terms(setId) {
        return this.db.any(`
        	SELECT
        		term_id 			AS id,
        		word,
        		definition,
        		parent_set_id
        	FROM
        		study_terms
        	WHERE
        		parent_set_id = $1
        	`, setId);
    }
}

const termsRepo = new TermsRepository(db);

exports.termsRepo = termsRepo;
