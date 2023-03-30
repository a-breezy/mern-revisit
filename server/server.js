const express = require("express");
const { ApolloServer } = require("apollo-server-express");

const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");

const PORT = process.env.PORT || 3001;
// create apollo server and pass schema data
const server = new ApolloServer({
	typeDefs,
	resolvers,
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// create async apollo server with graphql schema
const startApolloServer = async(typeDefs, resolvers) => {
  await server.start();
  // integrate apollo server with express middleware
  server.applyMiddleware({app})

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
}

// call function to start server
startApolloServer(typeDefs, resolvers)