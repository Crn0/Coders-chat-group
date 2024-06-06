import asyncHandler from 'express-async-handler';

// GET
const new_get = asyncHandler( async(req, res, _) => {
	res.send('Message page: GET NOT IMPLEMENTED')
})

// POST
const new_post = asyncHandler( async(req, res, _) => {
	res.send('Message page: POST NOT IMPLEMENTED')
})

const delete_post = asyncHandler( async(req, res, _) => {
	res.send('Message delete: POST NOT IMPLEMENTED')
})

export {
    new_get,
    new_post,
    delete_post,
}