/**
 * Customized exception to handle PUT requests
 * Taken from https://rollbar.com/guides/javascript-throwing-exceptions/
 * @param {String} field 
 */
function MissingFieldException(field) {
    const error = new Error(`'${field}' can not be null`)
    error.name = 'MissingFieldError'
    return error
  }

MissingFieldException.prototype = Object.create(Error.prototype);
module.exports = MissingFieldException