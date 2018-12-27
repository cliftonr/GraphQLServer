const makeExecutableSchema = require('graphql-tools').makeExecutableSchema
const merge = require('lodash').merge
const serviceModel = require('./serviceModel.js')
const { studySetTypeDef, studySetResolver } = require('./studySet.js')
const { studyTermTypeDef, studyTermResolver } = require('./studyTerm.js')
const { userTypeDef, userResolver } = require('./user.js')
const { gql } = require('apollo-server')

const baseTypeDef = gql`
	# Base query type, extended in other type definitions.
	type Query {
		_empty: String
	}

	# Base mutation type, extended in other type definitions.
	type Mutation {
		_empty: String
	}
`;

const schema = makeExecutableSchema({

  typeDefs: [
  	baseTypeDef,
  	serviceModel,
  	studySetTypeDef,
  	studyTermTypeDef,
  	userTypeDef
  ],

  resolvers: merge(
  	studySetResolver,
  	studyTermResolver,
  	userResolver
  ),
});

module.exports = schema;
