const createHash = require('../../../utils')

export default class UserDTO {
  constructor(user) {
    this.firstName = user.firstName
    this.lastName = user.lastName
    this.email = user.email
    this.age = user.age
    this.password = createHash(user.password)
  }
}