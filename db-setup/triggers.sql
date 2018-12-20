CREATE FUNCTION process_update_set() RETURNS TRIGGER AS $update_set$
    BEGIN
    	NEW.changed := current_timestamp;
        RETURN NEW;
    END;
$update_set$ LANGUAGE plpgsql;

CREATE TRIGGER update_set BEFORE INSERT OR UPDATE ON study_sets
    FOR EACH ROW EXECUTE PROCEDURE process_update_set();

CREATE FUNCTION process_update_term() RETURNS TRIGGER AS $update_term$
    BEGIN
    	UPDATE study_sets SET changed = current_timestamp WHERE set_id = NEW.parent_set_id;
    	NEW.changed := current_timestamp;
        RETURN NEW;
    END;
$update_term$ LANGUAGE plpgsql;

CREATE TRIGGER update_term BEFORE INSERT OR UPDATE ON study_terms
    FOR EACH ROW EXECUTE PROCEDURE process_update_term();