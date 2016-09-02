import UserModel from '../db/User'
import mongoose from 'mongoose'
import JWT from 'jsonwebtoken'


const jwtSingature = 'b66c679bf19642cdaa495240cbd3d747' 
const dbUri = 'mongodb://localhost/my_database'
mongoose.Promise = Promise

/**
 * Create user
 */
export function create (event, context, cb){
  mongoose.connect(dbUri)
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
  mongoose.connect(dbUri)
  let body = event.body

  if (!body.email) cb('email missing', null)
  if (!body.password) cb('password missing', null)

  UserModel.findOne({
    email: body.email
  })
  .then(res =>{
    mongoose.connection.close()
    if (res.checkPassword(body.password)){
      let token = JWT.sign({ id: res._id }, jwtSingature)
      cb(null, { "token": token })
    }
    else cb('username or password invalid', null)   
  })
  .catch(err =>{
    mongoose.connection.close()
    cb('username or password invalid', null)
  })
}


/**
 * Forgot password
 */
export function forgot (event, context, cb){
  mongoose.connect(dbUri)
  let body = event.status.body

  mongoose.connection.close()
  cb(null, { message: 'forgot' })
}