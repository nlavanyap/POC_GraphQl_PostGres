const { GraphQLServer } =  require('graphql-yoga')
const knex = require('knex')({
  client: 'pg',
  connection:{
    host: 'localhost',
    user:'postgres',
    password: 'postgres',
    database: 'courseque'
  }
});

const typeDefs = `
  type Query {
    students : [Student]
  }

  type Student
  {
    id: ID!,
    first_name: String!,
    last_name: String!,
    contact_no : String!,
    email: String!,
    address1: String!,
    address2: String,
    city: String!,
    state: String!,
    country: String!,
    zipcode: String!
  }

  type Mutation
  {
    createStudent(first_name: String!,last_name: String!,
      contact_no : String!,
      email: String!,
      address1: String!,
      address2: String,
      city: String!,
      state: String!,
      country: String!,
      zipcode: String!): Student

    updateStudent(id:ID!, first_name:String,last_name: String,
      contact_no : String,
      email: String,
      address1: String,
      address2: String,
      city: String,
      state: String,
      country: String,
      zipcode: String): Boolean

    deleteStudent(id: ID!) : Boolean

  }
  
`

const resolvers = {
  Query: {
    students: () => knex("student").select("*")
  },

  Mutation: {

    createStudent: async(_,{ first_name, last_name, contact_no, email, address1, address2, city, state, country, zipcode}) =>{
      const [student] = await knex("student")
          .returning("*")
          .insert({ first_name, last_name, contact_no, email, address1, address2, city, state, country, zipcode});
      return student;
    },

    updateStudent: async(_, {id, first_name, last_name, contact_no, email, address1, address2, city, state, country, zipcode}) =>{
      const isUpdated = await knex("student")
      .where({id})
      .update({ first_name, last_name, contact_no, email, address1, address2, city, state, country, zipcode});
      return isUpdated
    },

    deleteStudent: async(_,{id}) => {
      const isDeleted = await knex("student")
        .where({id})
        .del();
      return isDeleted;
    }
  }
}

const server = new GraphQLServer({ typeDefs, resolvers })
server.start(() => console.log('Server is running on localhost:4000'))


