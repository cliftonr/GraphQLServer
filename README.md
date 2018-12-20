# GraphQLServer
Test the capabilities of Apollo GraphQL.

## Get started

1) Open Terminal. Change to project directory.
```
$ cd /path/to/GraphQLServer
```

2) Install node project dependencies.
```
$ npm install
```

3) Start the server
```
$ node index.js
  Server ready at http://localhost:4000/
```
4) Open server playground URL in web browser. (`http://localhost:4000/`)

## Development

### Schema
`GraphQLServer/schema`

These files define the types used for queries and mutations. Each file encapsulates types and resolvers for a specific model. 

All type definitions and resolvers are merged in `GraphQLServer/schema/schema.js`

Current models include:
* User
* StudySet
* StudyTerm

### Repositories
`GraphQLServer/data`

These files define the repositories that interact with the database. Schema should use the repositories, and not interact directly with the database.

### Database setup
`GraphQLServer/db-setup`

By default, `data/db.js` connects with a postgresql database that has already been configured, but if you want to set up your own database, these are queries that'll get you up and running.

After setting up your database, open `GraphQLServer/data/db.js` and change `connection` to your database. If you decide to use something other than postgresql, you'll need to modify all files in `GraphQLServer/data` to support the different architecture.
