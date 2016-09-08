import {getSchema} from '@risingstack/graffiti-mongoose'
import {graphql} from 'graphql'
import mongoose from 'mongoose'

import UserModel from '../db/User'
import Config from '../config'

mongoose.Promise = Promise


/**
 * GraphQL with relay
 */
export function graph (event, context, cb){
  let query = event.query
  mongoose.connect(Config.database.uri)

  const Schema = getSchema([
    UserModel
  ], {
    mutation: false,
    allowMongoIDMutation: false
  })

  if (query && query.hasOwnProperty('query'))
    query = query.query.replace("\n", ' ', "g")
  
  graphql(Schema, query)
  .then(response => {
    mongoose.connection.close()
    cb(null, response)
  })
  .catch(error => {
    mongoose.connection.close()
    cb(error)
  })
}