const { ApolloServer } = require('apollo-server');
const schema = require('./schema/schema.js');

const server = new ApolloServer({
  schema: schema
});

// This `listen` method launches a web-server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
