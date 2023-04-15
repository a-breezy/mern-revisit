const express = require("express");
const { ApolloServer } = require("apollo-server-express");

const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");
const { authMiddleware } = require("./utils/auth");
const path = require("path");

const PORT = process.env.PORT || 3001;

// create async apollo server with graphql schema
const startApolloServer = async (typeDefs, resolvers) => {
	// create apollo server and pass schema data
	const server = new ApolloServer({
		typeDefs,
		resolvers,
		context: authMiddleware,
	});

	await server.start();
	// integrate apollo server with express middleware
	server.applyMiddleware({ app });

	console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
};
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../client/build")));
}

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

db.once("open", () => {
	app.listen(PORT, () => {
		console.log(`API server running on port ${PORT}!`);
	});
});

// call function to start server
startApolloServer(typeDefs, resolvers);
