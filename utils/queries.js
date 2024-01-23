const { resolve } = require('path');
const sql = require('../models/sql');
const { rejects } = require('assert');

function insertUser(user) {
    return new Promise((resolve, reject) => {
        sql.query(`insert into users values('${user.email}','${user.password}','${user.region}','${user.username}')`, (err, result, fields) => {
            if (err) reject(err);
            if (result) resolve(result);
        })
    })
}

function findUser(user) {
    // console.log(user)
    return new Promise((resolve, reject) => {
        if (user.username) {
            // console.log(4)
            sql.query(`select * from users where username='${user.username}'`, (err, result, fields) => {
                if (err) reject(err);
                if (result) resolve(result);
            })
        }
        else if (user.email) {
            sql.query(`select * from users where email='${user.email}'`, (err, result, fields) => {
                if (err) reject(err);
                if (result) resolve(result);
            })
        }
    })
}

function createGroup(group) {
    return new Promise((resolve, reject) => {
        sql.query(`insert into groups(name,createdBy,time) values('${group.name}','${group.createdBy}','${group.time}')`, (err, result, fields) => {
            if (err) reject(err);
            if (result) resolve(result);
        })
    })
}
function getGroups(user) {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM groups g LEFT JOIN messages m ON g.id = m.groupId WHERE g.createdBy = '${user}' or m.userId='${user}' GROUP BY g.id ORDER BY COUNT(m.message) DESC,g.time DESC;
        `, (err, result, fields) => {
            if (err) reject(err);
            if (result) resolve(result);
        })
    })
}

function checkAdmin(id) {
    // console.log(id)
    return new Promise((resolve, reject) => {
        sql.query(`select * from groups where id='${id.id}'`, (err, result, fields) => {
            if (err) reject(err);
            if (result) resolve(result);
        })
    })
}

function addReq(user) {
    return new Promise((resolve, reject) => {
        sql.query(`insert into requests(groupId,from_,to_,time) values('${user.groupId}','${user.username}','${user.to}','${user.time}') `, (err, result, fields) => {
            if (err) reject(err);
            if (result) resolve(result);
        })
    })
}

function getReq(req) {
    return new Promise((resolve, reject) => {
        if (req.to  && req.groupId) {
            sql.query(`select * from requests where groupId='${req.groupId}' and to_='${req.to}' `, (err, result, fields) => {
                if (err) reject(err);
                if (result) resolve(result);
            })
        }
        else if(req.to)
        {
            // console.log(req.to)
            sql.query(`select * from requests where to_='${req.to}' `, (err, result, fields) => {
                if (err) reject(err);
                if (result) resolve(result);
            })
        }
    })
}

function updateReq(req)
{
    return new Promise((resolve, reject) => {
        sql.query(`update requests set time='${req.time}' where groupId='${req.groupId}' and from_='${req.from}' and to_='${req.to}' `, (err, result, fields) => {
            if (err) reject(err);
            if (result) resolve(result);
        })
    })
}

function addMessage(post)
{
    return new Promise((resolve, reject) => {
        sql.query(`insert into messages values('${post.message}','${post.userId}','${post.groupId}','${post.time}') `, (err, result, fields) => {
            if (err) reject(err);
            if (result) resolve(result);
        })
    })
}

function getMessages(groupId)
{
    return new Promise((resolve, reject) => {
        sql.query(`select message,userId,messages.time from messages,members where members.groupId='${groupId}' and members.groupId=messages.groupId and members.time<messages.time`, (err, result, fields) => {
            if (err) reject(err);
            if (result) resolve(result);
        })
    })
}

function getRequests(user)
{
    return new Promise((resolve, reject) => {
        sql.query(`select * from requests,groups where id=groupId and flag=0 and to_='${user}' order by groups.time `, (err, result, fields) => {
            if (err) reject(err);
            if (result) resolve(result);
        })
    })
}

function inviteReqHandle(req,flag)
{
    return new Promise((resolve, reject) => {
        sql.query(`update requests set flag=${flag} where groupId=${req.groupId} and from_='${req.from}' and to_='${req.user}'`, (err, result, fields) => {
            if (err) reject(err);
            if (result) resolve(result);
        })
    })
}

function addMember(req)
{
    console.log(req);
    return new Promise((resolve, reject) => {
        sql.query(`insert into members values('${req.user}','${req.groupId}','${req.time}')`, (err, result, fields) => {
            if (err) reject(err);
            if (result) resolve(result);
        })
    })
}

module.exports = { insertUser,addMember,inviteReqHandle, findUser, createGroup, getGroups, checkAdmin, addReq ,getReq,updateReq,addMessage,getMessages,getRequests};