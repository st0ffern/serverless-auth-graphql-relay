import mongoose from 'mongoose'
import loadClass from 'mongoose-class-wrapper'
import timestamps from 'mongoose-timestamp'
import bcryptjs from 'bcryptjs'

const Schema = mongoose.Schema
 
// Create mongoose schema 
var UserSchema = new Schema({

  "email" : {type: String, unique: true, required: true},
  "firstName" : {type: String, unique: false, required: true},
  "lastName" : {type: String, unique: false, required: true},
  "gender" : {type: String, unique: false, required: true},
  "notificationSubscribe" : {type: Boolean, unique: false, required: false},
  "newsletterSubscribe" : {type: Boolean, unique: false, required: false},
  "hashedPassword" : {type: String, unique: false, required: true},
  "resetPasswordToken" : {type: String, unique: false, required: false},
});
 
class UserModel {
 
  get password() {
    return this.hashedPassword;
  }
  set password(password) {
    this.hashedPassword = this.encryptPassword(password)
  }
 
  encryptPassword(password) {
    return bcryptjs.hashSync(password, 10)
  }
 
  static byEmail(email) {
    return this.findOne({email}).exec();
  }

  createResetPasswordToken(){
    return this.resetPasswordToken = bcryptjs.hashSync(Date.now()+'secret')
  }

  checkResetPasswordToken(token){
    if (this.resetPasswordToken == token) return true
    return false
  }

}

UserSchema.plugin(timestamps)
UserSchema.plugin(loadClass, UserModel)

export default mongoose.model('User', UserSchema)