import asyncHandler from "express-async-handler";
import { body, validationResult } from 'express-validator';
import User from "../models/user.mjs";
import Message from '../models/message.mjs';

// GET
const new_get = asyncHandler(async (req, res, _) => {
  res.render('message_form', {
    title: 'New Message'
  });
});

// POST
const new_post = [
  body('title')
  .trim()
  .escape(),
  body('message')
  .trim()
  .escape(),

  asyncHandler( async (req, res, next) => {
    const { title, message } = req.body;
    const userID = req.user.id;

    const newMessage = new Message({
      title,
      message
    })
    
    await newMessage.save();
    
    const UpdateUser = await User.findByIdAndUpdate(userID, { $push: { messages: newMessage }});

    console.log(UpdateUser)

    res.redirect('/home')
  })
]

const delete_post = asyncHandler(async (req, res, _) => {
  res.send("Message delete: POST NOT IMPLEMENTED");
});

export { new_get, new_post, delete_post };
