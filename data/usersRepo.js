const db = require('./db').db;

class UsersRepository {

    constructor(db) {
        this.db = db;
    }

	// Get all users.
    allUsers() {
    	return this.db.any(`
    		SELECT
    			user_id			AS id,
    			username,
    			email
    		FROM
    			accounts
    		`)
    }

	// Get user with given `id`.
    user(id) {
        return this.db.oneOrNone(`
        SELECT
        	user_id 			AS id,
        	username,
        	email,
        	created,
        	changed
        FROM
        	accounts
        WHERE
        	user_id = $1
        `, id);
    }

	// Create a user with the given `username` and `email`.
    createUser(username, email) {
    	return this.db.one(`
    		INSERT INTO accounts(
    			username,
    			email)
    		VALUES (
    			$1,
    			$2)
    		RETURNING
    			user_id 		AS id,
    			username,
    			email,
    			created,
    			changed
    		`, [username, email]);
    }
}

const usersRepo = new UsersRepository(db);

exports.usersRepo = usersRepo;
