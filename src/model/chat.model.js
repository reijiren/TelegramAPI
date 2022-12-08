const db = require('../config/db');

module.exports = {
    store: (data) => {
        const {sender, receiver, message, type} = data;
        return new Promise((resolve, reject) => {
            db.query(`insert into chat(sender, receiver, content, type, date_time)
            values (${sender}, ${receiver}, '${message}', ${type}, now())
            `, (err, res) => {
                if(err) reject(err);
                resolve(res);
            })
        });
    },

    list: (sender, receiver) => {
        return new Promise((resolve, reject) => {
            db.query(`select chat.content, chat.type, userSender.fullname as sender, userReceiver.fullname as receiver, chat.date_time,
            userSender.id_user as senderid, userReceiver.id_user as receiverid, userSender.image as senderimg, userReceiver.image as receiverimg
            from chat left join users as userSender on chat.sender = userSender.id_user
            left join users as userReceiver on chat.receiver = userReceiver.id_user
            where (sender = ${sender} and receiver = ${receiver}) or (sender = ${receiver} and receiver = ${sender})
            order by chat.id desc
            `, (err, res) => {
                if(err) reject(err);
                resolve(res);
            })
        });
    },

    delete: (id) => {
        return new Promise((resolve, reject) => {
            db.query(`
            delete from chat where id = ${id};
            `, (err, res) => {
                if(err) return reject(err);
                resolve(res);
            })
        })
    },
}