const userModel = require('../model/user.model');
const chatModel = require('../model/chat.model');
const { success, failed, successWithToken } = require('../helper/response');

const bcrypt = require('bcrypt');
const jwtToken = require('../helper/generateJWT');

const userController = {
    // get all user
    list: (req, res) => {
        userModel.selectAllUser()
        .then((result) => {
            success(res, result.rows, 'success', 'get all users success');
        })
        .catch((err) => {
            failed(res, err.message, 'failed', 'failed to get all users');
        })
    },

    // detail user
    detail: (req, res) => {
        const id = req.params.id;

        userModel.selectUserId(id)
        .then((result) => {
            success(res, result.rows, 'success', `get user detail success`);
        })
        .catch((err) => {
            failed(res, err.message, 'failed', `failed to get user detail`);
        })
    },

    // find user by name
    find: (req, res) => {
        userModel.findName(req.body)
        .then((result) => {
            success(res, result.rows, 'success', `find user success`);
        })
        .catch((err) => {
            failed(res, err.message, 'failed', `failed to find user`);
        })
    },

    // register
    register: (req, res) => {
        try{
            const { fullname, email, password } = req.body;
            bcrypt.hash(password, 10, (err, hash) => {
                if(err) failed(res, err.message, 'failed', 'failed to hash password');

                const data = {
                    fullname,
                    email,
                    password: hash,
                }

                userModel.findEmail(email)
                .then((result) => {
                    if(result.rowCount === 0){
                        userModel.insertUser(data)
                        .then((result) => {
                            success(res, result.rowCount, "success", "register success");
                        })
                        .catch((err) => {
                            failed(res, err.message, 'failed', `register failed`);
                        })
                    }else{
                        failed(res, null, 'failed', `email already taken`);
                    }
                })
                .catch((err) => {
                    failed(res, err.message, 'failed', `failed to check email user`);
                })
            })
        }catch(err){
            console.error(err);
        }
    },

    // login
    login: (req, res) => {
		const { email, password } = req.body;

		userModel.findEmail(email)
        .then((result) => {
            if (result.rowCount !== 0) {
                const user = result.rows[0];
                
                bcrypt.compare(password, user.password)
                .then(async (result) => {
                    if (result) {
                        const token = await jwtToken({
                            email: user.email,
                        });
                        delete user.password;
                        successWithToken(
                            res,
                            user,
                            token,
                            "success",
                            "login success"
                        );
                    } else {
                        failed(res, null, "failed", "email or password incorrect");
                    }
                });
            }else{
                failed(res, null, "failed", "email or password incorrect");
            }
        })
        .catch((err) => {
            failed(res, err.message, "failed", "internal server error");
        });
	},

    // update user
    update: (req, res) => {
        const id = req.params.id;
        const body = req.body;
        const newPass = body.password ? bcrypt.hashSync(body.password, 10) : null;

        const data = {
            ...body,
            id: id,
            password: newPass,
        }
        
        userModel.updateUser(data)
        .then((result) => {
            userModel.selectUserId(id)
            .then((result) => {
                success(res, result.rows, "success", "update user success");
            })
            .catch((err) => {
                failed(res, err.message, "failed", "failed to get user detail");
            })
        })
        .catch((err) => {
            failed(res, err.message, "failed", "failed to update user");
        });
    },

    // update photo
    updatePhoto: async(req, res) => {
        const id = req.params.id;
        const img = req.file.filename;

        await userModel.updatePhoto(id, img)
        .then((result) => {
            success(res, result.rowCount, "success", "update photo success");
        })
        .catch((err) => {
            failed(res, err.message, "failed", "failed to update photo");
        });
    },

    // user's chat list
    allChat: (req, res) => {
        const id = req.params.id;

        userModel.listChat(id)
        .then((result) => {
            success(res, result.rows, "success", "get user's chat success");
        })
        .catch((err) => {
            failed(res, err.message, "failed", "failed to get user's chat");
        });
    },

    // delete chat
    deleteChat: (req, res) => {
        const id = req.params.id;

        chatModel.delete(id)
        .then((result) => {
            success(res, result.rowCount, "success", "get user's chat success");
        })
        .catch((err) => {
            failed(res, err.message, "failed", "failed to get user's chat");
        });
    },
}

module.exports = userController;