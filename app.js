const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');

const graphQLSchema = require('./graphql/schema/index');
const graphQLResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');


require('dotenv').config();


const app = express();

app.use(bodyParser.json());

app.use(isAuth);

app.use('/graphql', graphqlHTTP({
    schema: graphQLSchema,
    rootValue: graphQLResolvers,
    graphiql: true
})
);

mongoose.connect(`
mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}
@cluster0.qjewy.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`).then( () => {
    app.listen(3000);
}).catch(err => {
    console.log(err);
});
