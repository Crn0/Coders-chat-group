const isPasswordMatch = (val, { req }) => {
    if(val === req.body.password) return true;

    return false
}

export default isPasswordMatch;