import { gql } from "apollo-server-express";

const userSchema = gql`
  scalar Date

  type User {
    id: ID!
    username: String
    name: String!
    email: String!
    bio: String
    profile_picture_url: String
    gender: String
    photos: [String]
    date_of_birth: Date
    interests: [String]
    geo_location: String
    hometown: String
  }

  type Query {
    fetchProfile(id: ID!): User
  }

  type CreateUserResponse {
    user: User
    token: String
  }

  type DeleteUserResponse {
    success: Boolean
    message: String
  }

  type Mutation {
    createUser(input: CreateUserInput!): CreateUserResponse
    updateUser(input: UpdateUserInput!): User
    deleteUser: DeleteUserResponse
  }

  input CreateUserInput {
    username: String
    name: String!
    email: String!
    password: String!
    bio: String
    gender: String
    date_of_birth: Date
    interests: [String]
    geo_location: String
    hometown: String
  }

  input UpdateUserInput {
    name: String
    bio: String
    gender: String
    date_of_birth: Date
    interests: [String]
    geo_location: String
    hometown: String
  }
`;

export default userSchema;
