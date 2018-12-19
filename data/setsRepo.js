const db = require('./db').db;

class SetsRepository {

    constructor(db) {
        this.db = db;
    }

	// Get sets created by user with given `creatorId`.
    studySets(creatorId) {
        return this.db.any(`
			SELECT
				set_id 			AS id,
				title,
				description,
				creator_id,
				created,
				changed,
				is_deleted
			FROM
				study_sets
			WHERE
				creator_id = $1
				AND is_deleted != TRUE
			`, creatorId);
    }

  	// Get set with given `id`.
    studySet(id) {
        return this.db.oneOrNone(`
			SELECT
				set_id 			AS id,
				title,
				description,
				creator_id,
				created,
				changed,
				is_deleted
			FROM
				study_sets
			WHERE
				set_id = $1
			`, id);
    }

	// Create a set with the given `title` and `description` that belongs to a user with the given `creatorId`.
    createSet(creatorId, title, description) {
    	return this.db.one(`
			INSERT INTO study_sets(
				title,
				description,
				creator_id)
			VALUES (
				$1,
				$2,
				$3)
			RETURNING
				set_id 			AS id,
				title,
				description,
				creator_id,
				created,
				changed,
				is_deleted
			`, [title, description, creatorId]);
    }

    // Apply changes to set with given `setId`.
    updateSet(setId, title, description, isDeleted) {
    	const originalSet = this.studySet(setId);
    	const edits = [
    		title || originalSet.title,
    		description || originalSet.description,
    		(isDeleted || originalSet.is_deleted) ? "TRUE" : "FALSE",
    		setId
    	]
    	return this.db.one(`
			UPDATE
				study_sets
			SET
				title 			= $1,
				description 	= $2,
				is_deleted 		= $3
			WHERE
				set_id 			= $4
			RETURNING
				set_id 			AS id,
				title,
				description,
				creator_id,
				created,
				changed,
				is_deleted
			`, edits);
    }
}

const setsRepo = new SetsRepository(db);

exports.setsRepo = setsRepo;
