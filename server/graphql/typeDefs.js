const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: Int!
    name: String!
    messages: [Message!]!
  }

  type Message {
    id: Int!
    content: String!
    user: User!
  }

  type Query {
    users: [User!]!
    messages: [Message!]!
  }

  type Mutation {
    addUser(name: String!): User!
    addMessage(content: String!, userId: Int!): Message!
  }
`;

module.exports = typeDefs;
