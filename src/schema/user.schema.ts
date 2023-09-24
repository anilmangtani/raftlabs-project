const typeDefs = `
type User {
  id: ID!
  name: String!
  email: String!
  password: String!
}

type Query {
  getAllUser: [User]
  getUser(id: ID!): User
}

type Mutation {
  createUser(name: String!, email: String!, password: String!): User
  login(email:String!, password:String!):String
  updateUser(id: ID!, name: String, email: String, password:String!): User
  deleteUser(id: ID!): Boolean
  privateData: String
}
`
export default typeDefs

