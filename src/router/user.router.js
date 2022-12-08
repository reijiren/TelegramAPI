const express = require('express');

const { list, detail, register, login, update, allChat, find, updatePhoto } = require('../controller/user.controller');
const {removePhoto} = require('../middleware/deleteImg');
const {uploadPhoto} = require('../middleware/uploadImg');

const userRouter = express.Router();

userRouter
.get('/users', list)
.get('/user/:id', detail)
.get('/user/chat/:id', allChat)
.post('/find', find)
.post('/register', register)
.post('/login', login)
.put('/user/update/:id', update)
.put('/photo/:id', removePhoto, uploadPhoto, updatePhoto)

module.exports = userRouter;