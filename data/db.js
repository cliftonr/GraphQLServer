const humps = require('humps');
const options = {
    receive: function (data /* , result, e */) {
        camelizeColumnNames(data);
    }
};

const pgPromise = require('pg-promise');
const pgp = pgPromise(options);
pgp.pg.defaults.ssl = true;

const connection = 'postgres://xompkfdmwqwtxw:9a8acdee986db8f4d4d9e7dab9560d954163ff4dc593b4ce01624da9cd0906b8@ec2-54-235-247-209.compute-1.amazonaws.com:5432/ddaoev1va9h7o2'
const db = pgp(connection);

// Camel-case all db column names so that they match our API fields.
// Taken from: https://github.com/vitaly-t/pg-promise/issues/78
function camelizeColumnNames(data) {
    var template = data[0];
    for (var prop in template) {
        var camel = humps.camelize(prop);
        if (!(camel in template)) {
            for (var i = 0; i < data.length; i++) {
                var d = data[i];
                d[camel] = d[prop];
                delete d[prop];
            }
        }
    }
}

exports.db = db;
