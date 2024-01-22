const express=require('express');
const userRoute=express.Router();
const controller=require('../controller/userController');
module.exports=userRoute;

userRoute.get('/',controller.getHome);

userRoute.get('/signup',controller.getSignup);

userRoute.post('/signup',controller.userSignup);

userRoute.post('/login',controller.userLogin);

userRoute.get('/group',controller.getGroupPage);

userRoute.post('/createGroup',controller.createGroup);

userRoute.get('/getGroups',controller.getGroups);

userRoute.post('/checkAdmin',controller.checkAdmin);

userRoute.post('/checkUsername',controller.checkUsername);

userRoute.post('/sentRequest',controller.sentInviteReq);

userRoute.get('/logout',controller.logout);

userRoute.post('/addNewPost',controller.addNewPost);

userRoute.post('/getMessages',controller.getMessages);

userRoute.get('/getRequests',controller.getRequests);

userRoute.post('/acceptReq',controller.acceptReq);

userRoute.post('/rejectReq',controller.rejectReq);