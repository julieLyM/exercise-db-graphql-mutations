const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/UserSchema');

function middlewares(app) {
  try {
    app.use(express.json());
    app.use('/graphql', graphqlHTTP({ schema, graphiql: true }));
  } catch (e) {
    console.error(e);
  }
}

module.exports = middlewares;
