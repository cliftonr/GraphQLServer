const db = require('./db').db;

class TermsRepository {

    constructor(db) {
        this.db = db;
    }

	// Get terms contained in the set identified by the given `setId`.
    terms(setId) {
        return this.db.any(`
        	SELECT
        		term_id 		AS id,
        		word,
        		definition,
        		parent_set_id
        	FROM
        		study_terms
        	WHERE
        		parent_set_id = $1
        		AND is_deleted != TRUE
        	`, setId);
    }

    // Create a term with the given `word` and `definition` that belongs to a set with the given `setId`.
    createTerm(setId, word, definition) {
    	return this.db.one(`
			INSERT INTO study_terms(
				word,
				definition,
				parent_set_id)
			VALUES (
				$1,
				$2,
				$3)
			RETURNING
				term_id 			AS id,
				word,
				definition,
				parent_set_id,
				created,
				changed,
				is_deleted
			`, [word, definition, setId]);
    }
}

const termsRepo = new TermsRepository(db);

exports.termsRepo = termsRepo;
