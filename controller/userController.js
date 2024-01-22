const sql = require('../utils/queries');
const mailjet = require('../utils/mailjet');
const { json } = require('express');

function getHome(req, res) {
    if (req.session.user) {
        res.render('group');
    }
    else {
        res.render('login', { error: null });
    }
}

function getSignup(req, res) {
    if (req.session.user) {
        res.render('signup', { error: null });
    }
    else {
        res.redirect('/');
    }
}

function checkUsername(req, res) {
    if(req.session.user)
    {
        let user = {
            username: req.body.username
        };
        sql.findUser(user)
            .then((data) => {
                // console.log(data);
                if (data.length) {
                    res.status(300);
                }
                else {
                    // console.log(2)
                    res.status(200);
                }
                res.send();
            })
            .catch((err) => {
                if (err) {
                    // console.log(err);
                    res.status(500);
                }
                res.send();
            })
    }
    else
    {
        res.redirect('/');
    }
}

function userSignup(req, res) {
    if(req.session.user)
    {
        let newUser = req.body;
    sql.findUser({ email: newUser.email })
        .then((data) => {
            if (data.length) {
                res.status(300);
                res.send();
            }
            else {
                sql.insertUser(newUser)
                    .then((data) => {
                        res.status(200).send();
                    })
                    .catch((err) => {
                        if (err) {
                            res.status(500);
                            res.send();
                        }
                    })
            }
        })
        .catch((err) => {
            res.status(500);
            res.send();
        })
    }
    else
    {
        res.redirect('/');
    }
    
}

function userLogin(req, res) {
    if(req.session.user)
    {
        let user = req.body;
        sql.findUser(user)
        .then((data) => {
            // console.log(data)
            if (data.length) {
                req.session.user = data[0].username;
                res.status(200);
                console.log(JSON.parse(JSON.stringify(data))[0].password)
                res.json(JSON.parse(JSON.stringify(data))[0].password);
            }
            else {
                res.status(300);
            }
            res.send();
        })
        .catch((error) => {
            res.status(500);
            res.send();
        })
    }
    else
    {
        res.redirect('/');
    }
    
}

function getGroupPage(req, res) {
    if (req.session.user) {
        res.render('group');
    }
    else {
        res.redirect('/');
    }
}

function createGroup(req, res) {
    if(req.session.user)
    {
        let group = req.body;
        group.createdBy = req.session.user;
        sql.createGroup(group)
            .then((data) => {
                res.status(200).send();
            })
            .catch((error) => {
                res.status(300).send();
            })
    }
    else
    {
        res.redirect('/');
    }
}

function getGroups(req, res) {
    if(req.session.user)
    {
        sql.getGroups(req.session.user)
            .then((data) => {
                // data=JSON.parse(JSON.stringify(data));
                console.log(data)
                sql.getCreatedGroups(req.session.user)
                    .then((data) => {
                        console.log(data);
                    })
                    .catch((error) => {
                        res.status(300);
                        res.send();
                    })
            })
            .catch((error) => {
                res.status(300);
                res.send();
            })
    }
    else
    {
        res.redirect('/');
    }
}

function checkAdmin(req, res) {
    if(req.session.user)
    {
        let id = req.body;
        sql.checkAdmin(id)
            .then((data) => {
                if (req.session.user === JSON.parse(JSON.stringify(data))[0].createdBy && data.length) {
                    res.status(200).send();
                }
                else {
                    res.status(250).send();
                }
            })
            .catch((error) => {
                res.status(300).send();
            })
    }
    else
    {
        res.redirect('/');
    }
}

function sentInviteReq(req, res) {
    if(req.session.user)
    {
        let request = req.body;
    request.username = req.session.user;
    // console.log(request);
    sql.findUser({ username: request.to })
        .then((data) => {
            data = JSON.parse(JSON.stringify(data));
            console.log(data, data.length, request)
            if (data.length) {
                // console.log(1111);
                sql.getReq(request)
                    .then((data) => {
                        // console.log("getReq")
                        data = JSON.parse(JSON.stringify(data))
                        if (data.length) {
                            sql.updateReq(request)
                                .then((data) => {
                                    res.status(200).send();
                                })
                                .catch((error) => {
                                    console.log("error", error)
                                    res.status(500).send()
                                })
                        }
                        else {
                            sql.addReq(request)
                                .then((data) => {
                                    // console.log(2222)
                                    if (data) {
                                        res.status(200).send();
                                    }
                                    else {
                                        throw new Error("Error in adding invitation");
                                    }
                                })
                                .catch((error) => {
                                    console.log(error, 2);
                                    res.status(500).send();
                                })
                        }
                    })
                    .catch((error) => {
                        // console.log(error)
                        res.status(500).send();
                    })
            }
            else {
                res.status(300).send();
            }
        })
        .catch((error) => {
            res.status(500).send();
        })
    }
    else
    {
        res.redirect('/');
    }
}

function logout(req, res) {
    if(req.session.user)
    {
        req.session.destroy();
        res.redirect('/');
    }
    else
    {
        res.redirect('/');
    }
}

function addNewPost(req, res) {
    if(req.session.user)
    {
        let post = req.body;
        post.userId = req.session.user;
        sql.addMessage(post)
            .then((data) => {
                res.status(200);
                res.send();
            })
            .catch((error) => {
                console.log(error)
                res.status(500).send();
            })
    }
    else
    {
        res.redirect('/');
    }
}

function getMessages(req, res) {
    // console.log(req.body.groupId)
    if(req.session.user)
    {
        sql.getMessages(req.body.groupId)
            .then((data) => {
                res.json({ data, user: req.session.user });
            })
            .catch((error) => {
                // console.log(error)
                res.status(500).send();
            })
    }
    else
    {
        res.redirect('/');
    }
}

function getRequests(req, res) {
    if(req.session.user)
    {
        sql.getRequests(req.session.user)
            .then((data) => {
                if (data) {
                    res.status(200);
                    res.json(data);
                }
                else {
                    res.status(300).send();
                }
            })
            .catch((error) => {
                console.log(error)
                res.status(500).send();
            })
    }
    else
    {
        res.redirect('/');
    }
}

function acceptReq(req, res) {
    if(req.session.user)
    {
    let reqDetails = req.body;
    reqDetails.user = req.session.user;
    sql.inviteReqHandle(reqDetails, 1)
        .then((data) => {
            sql.addMember(reqDetails)
                .then((data) => {
                    res.status(200).send();
                })
                .catch((errror) => {
                    console.log(errror)
                    res.status(500).send();
                })
        })
        .catch((errror) => {
            res.status(500).send();
        })
    }
    else
    {
        res.redirect('/');
    }
}

function rejectReq(req, res) {
    if(req.session.user)
    {
    let reqDetails = req.body;
    sql.inviteReqHandle(reqDetails, -1)
        .then((data) => {
            res.status(200).send();
        })
        .catch((errror) => {
            res.status(500).send();
        })
    }
    else
    {
        res.redirect('/');
    }
}

module.exports = { getHome, acceptReq, rejectReq, getMessages, getSignup, checkUsername, userSignup, userLogin, getGroupPage, getRequests, createGroup, getGroups, checkAdmin, sentInviteReq, logout, addNewPost };

