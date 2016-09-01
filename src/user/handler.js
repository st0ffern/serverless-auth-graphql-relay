import UserModel from '../db/User'
import mongoose from 'mongoose'
import JWT from 'jsonwebtoken'


const jwtSingature = 'b66c679bf19642cdaa495240cbd3d747' 
mongoose.connect('mongodb://localhost/my_database');


/**
 * Login user
 */
export async function login (event, context, cb){


  var user = new UserModel()
  var user = await UserModel.findOneAsync({
    email: event.body.email, 
    password: user.encryptPassword(event.body.password)
  })

  if (!user) cb(null, {'status': 'user NOT found'})
  else cb(null, {'status': 'user found'})

  let token = JWT.sign({ foo: 'bar' }, jwtSingature)
}


/**
 * Create user
 */
export function create (event, context, cb){
  cb(null,
    { message: 'create' }
  );
}


/**
 * Forgot password
 */
export function forgot (event, context, cb){
  cb(null,
    { message: 'forgot' }
  );
}


/**
 * CHECK WHO IS THE LOGGED IN USER
 */
export function whoami (event, context, cb){
  var token = event.headers.Authorization.split(" ")[1]

  JWT.verify(token, jwtSingature)
  .then(res => cb(null, { message: 'valid' }))
  .catch(err => cb(null, { message: 'not valid' }))
}
