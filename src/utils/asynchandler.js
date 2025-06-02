

const asynchandler = (requestHandlerFxn) => {
  return (req, res, next) => {
    Promise.resolve(requestHandlerFxn(req, res, next)).catch((err) => next(err))
  }
}


export {asynchandler}

/*

const aysnchandler = (fn) => async(req, res, next) => {
  try {
    await fn(req, res, next)
  } catch (error) {
    res.status(error.code || 500).json({
      success: false,
      message: error.message,
    })
  }
}

*/