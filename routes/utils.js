// Handler function to wrap each route.
function asyncHandler(cb) {
    return async (req, res, next) => {
      try {
        await cb(req, res, next);
      } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError' ) {
          const errors = error.errors.map(err => err.message);
          res.status(400).json({ errors });
        } else if (error.name === 'MissingFieldError') { // Customized exception 
          res.status(400).json({error: error.message})
        }
        else {
          next(error);
        }
      }
    }
  }

module.exports = asyncHandler