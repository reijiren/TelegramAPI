const fs = require('fs');
const userModel = require('../model/user.model');

module.exports = {
    removePhoto: async (req, res, next) => {
		const id = req.params.id;

        const data = await userModel.selectUserId(id);
        if(data) {
            if (data.rows[0].image) {
                const img = data.rows[0].image;
                if (img !== "default.png") {
                    fs.unlink(`./assets/${img}`, (err) => {
                        if (err) {
                            console.log(err)
                        }
                    });
                }
                next();
            } else {
                res.json("There is no profile picture");
            }
        }else{
            res.json("User ID is not found");
        }
    },
}