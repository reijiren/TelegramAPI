const cloudinary = require("../helper/cloudinary");
const userModel = require('../model/user.model');

module.exports = {
    removePhoto: async (req, res, next) => {
		const id = req.params.id;

        const data = await userModel.selectUserId(id);
        if(data) {
            if (data.rows[0].image) {
                const img = data.rows[0].image;
                if (img.split('|&&|')[0] !== "https://res.cloudinary.com/dmkviiqax/image/upload/v1670786753/default_qux8xg.jpg") {
                    await cloudinary.uploader.destroy(img.split('|&&|')[1]);
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