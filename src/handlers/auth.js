import mongoose from 'mongoose'
import JWT from 'jsonwebtoken'

import UserModel from '../db/User'
import Config from '../config'

mongoose.Promise = Promise


/**
 * Create user
 */
export function create (event, context, cb){
  mongoose.connect(Config.database.uri)
  let body = event.body

  var user = new UserModel()
  user.hashedPassword = user.encryptPassword(body.password)
  delete body.password

  for (let key in body){
    user[key] = body[key]
  }

  user.save()
  .then(res => {
    mongoose.connection.close()
    cb(null, { 'data': res } )
  })
  .catch(err => {
    mongoose.connection.close()
    cb(err.message, null)
  })
}


/**
 * Login user
 */
export function login (event, context, cb){
  mongoose.connect(Config.database.uri)
  let body = event.body

  if (!body.email) cb('email missing', null)
  if (!body.password) cb('password missing', null)

  UserModel.findOne({
    email: body.email
  })
  .then(res =>{
    mongoose.connection.close()
    if (res.checkPassword(body.password)){
      let token = JWT.sign({ id: res._id }, Config.jwt.signature)
      cb(null, { "token": token })
    }
    else cb('username or password invalid', null)   
  })
  .catch(err =>{
    console.log(err)
    mongoose.connection.close()
    cb('username or password invalid', null)
  })
}


/**
 * Forgot password
 */
export function forgot (event, context, cb){
  mongoose.connect(Config.database.uri)
  let body = event.body

  mongoose.connection.close()
  cb(null, { message: 'forgot' })
}


/**
 * Who am i
 */
export function whoami (event, context, cb){
  mongoose.connect(Config.database.uri)
  let body = event.body
  let token = event.headers.Authorization.split(" ")[1]

  JWT.verify(token, Config.jwt.signature, (err, decoded) => {
    if (err) cb('invalid request', null)

    UserModel.findOne({
      _id: decoded.id
    })
    .then(res =>{
      mongoose.connection.close()
      delete res.hashedPassword
      delete res.resetPasswordToken
      cb(null, { "user": res })
    })
    .catch(err =>{
      mongoose.connection.close()
      cb('invalid request', null)
    })
  })
}