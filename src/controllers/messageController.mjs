import asyncHandler from "express-async-handler";
import { body, validationResult } from 'express-validator';
import Message from '../models/message.mjs';
import * as Authenticate from '../middlewares/authMiddleware.mjs';


// GET
const new_get = [
  Authenticate.isAuthProtectedRoute(true),
  asyncHandler(async (req, res, _) => {
    res.render('message_form', {
      title: 'New Message'
    });
  })
];

const secret_new_get = [
  Authenticate.isAuthProtectedRoute(true),
  Authenticate.isMemberOrAdmin,
  asyncHandler( async (req, res , _) => {
    res.render('message_form',{
      title: 'New Message'
    })
  })
];

// POST
const new_post = [
  body('title')
  .trim()
  .escape(),
  body('message')
  .trim()
  .escape(),

  asyncHandler( async (req, res, _) => {
    const id = res.locals.currentUser._id;
    const { title, message } = req.body;

    const newMessage = new Message({
      title,
      message,
      author: id
    });
    
    await newMessage.save();

    res.redirect('/');
  })
];

const secret_new_post = [
  body('title')
  .trim()
  .escape(),
  body('message')
  .trim()
  .escape(),

  asyncHandler( async (req, res, _) => {
    const id = res.locals.currentUser._id;
    const { title, message } = req.body;

    const newMessage = new Message({
      title,
      message,
      author: id,
      secret: true,
    });
    
    await newMessage.save();

    res.redirect('/major_arcana');
  })
];

const delete_post = asyncHandler(async (req, res, _) => {
  const id = req.body.message_id;

  const prevLink = req.get('Referrer');
  
  await Message.findByIdAndDelete(id).exec();

  res.redirect(prevLink);
});

export { 
  new_get,
  secret_new_get, 
  new_post, 
  secret_new_post,
  delete_post
 };
