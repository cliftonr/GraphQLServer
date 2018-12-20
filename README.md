# GraphQLServer
Test the capabilities of Apollo GraphQL. Has a very simple model layer that doesn't involve any kind of authentication or authorization.

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

## Examples

### Queries

**Query all users, their sets and associated terms.**
```javascript
{
    allUsers {
        id
        username
        email
        sets {
            id
            title
            description
            terms {
                word
                definition
            }
        }
    }
}
```

**Query set with id=1.**
```javascript
{
    studySet(id: "1") {
        id
        title
        description
        changed
        terms {
            id
            word
            definition
            changed
        }
    }
}
```

### Mutations

**Create a user.**
```javascript
// query:
mutation CreateUser($userInput: UserInput!) {
    createUser(input: $userInput) {
        id
        username
        email
    }
}

// variables:
{
    "userInput": {
        "username": "Name1",
        "email": "name1@example.com"
    }
}
```

**Create a set.**
```javascript
// query:
mutation CreateSet($creatorId: String!, $setInput: StudySetInput!) {
    createSet(creatorId: $creatorId, input: $setInput) {
        id
        title
        description
        creator {
            id
            username
        }
    }
}

// variables:
{
    "creatorId": "1",
    "setInput": {
        "title": "Great Books",
        "description": "Great books everyone should read."
    }
}
```

**Add terms to a set.**
```javascript
// query:
mutation AddTerms($setId: String!, $termsInput: [StudyTermInput!]!) {
    addTerms(setId: $setId, input: $termsInput) {
        id
        word
        definition
        parentSet {
            id
        }
    }
}

// variables:
{
    "setId": "1",
    "termsInput": [
        {
            "word": "Dune",
            "definition": "Frank Herbert"
        },
        {
            "word": "A Brief History of Time",
            "definition": "Stephen Hawking"
        },
        {
            "word": "The Lord of the Rings",
            "definition": "J. R. R. Tolkien"
        }
    ]
}
```

## Development

### Schema
`GraphQLServer/schema`

These files define the types used for queries and mutations. Each file encapsulates types and resolvers for a specific model. 

All type definitions and resolvers are merged in `GraphQLServer/schema/schema.js`

Current models include:
* User: creates study sets.
* StudySet: contains study terms.
* StudyTerm: has study information (a word and associated definition).

### Repositories
`GraphQLServer/data`

These files define the repositories that interact with the database. Schema should use the repositories, and not interact directly with the database.

Keep in mind when working with repositories that columns obtained from the database are converted to `camelCase`, not `snake_case` as they are named in the database.

### Database setup
`GraphQLServer/db-setup`

By default, `data/db.js` connects with a postgresql database that has already been configured, but if you want to set up your own database, these are queries that'll get you up and running.

After setting up your database, open `GraphQLServer/data/db.js` and change `connection` to your database. If you decide to use something other than postgresql, you'll need to modify all files in `GraphQLServer/data` to support the different architecture.
