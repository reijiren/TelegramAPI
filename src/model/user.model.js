const db = require('../config/db');

const userModel = {
    // get all users
    selectAllUser: () => {
        return new Promise((resolve, reject) => {
			db.query(`
            select * from users;
            `, (err, res) => {
                if(err) return reject(err);
                resolve(res);
            })
		});
    },

    // get detail user
    selectUserId: (id) => {
        return new Promise((resolve, reject) => {
            db.query(`
            select * from users where id_user = ${id};
            `, (err, res) => {
                if(err) return reject(err);
                resolve(res);
            })
        });
    },

    // check email
    findEmail: (data) => {
        return new Promise((resolve, reject) => {
            db.query(`
            select * from users where email = '${data}';
            `, (err, res) => {
                if(err) return reject(err);
                resolve(res);
            })
        });
    },

    // find user fullname
    findName: (data) => {
        return new Promise((resolve, reject) => {
            db.query(`
            select * from users where fullname ilike '%${data.name}%' and id_user != ${data.id};
            `, (err, res) => {
                if(err) return reject(err);
                resolve(res);
            })
        });
    },

    // register
    insertUser: (data) => {
        return new Promise((resolve, reject) => {
            db.query(`
            insert into users (fullname, email, password, image, date_created)
            values ('${data.fullname}', '${data.email}', '${data.password}', 'default.png', now());
            `, (err, res) => {
                if(err) return reject(err);
                resolve(res);
            })
        });
    },

    // update user
    updateUser: (data) => {
        return new Promise((resolve, reject) => {
			db.query(
			`
            UPDATE users SET
            fullname = COALESCE ($2, fullname),
            username = COALESCE ($3, username),
            phone = COALESCE ($4, phone),
            password = COALESCE ($5, password),
            image = COALESCE ($6, image),
            bio = COALESCE ($7, bio)
            WHERE id_user = $1
			`,
				[data.id, data.fullname, data.username, data.phone, data.password, data.image, data.bio],
				(err, res) => {
                    if(err) return reject(err);
                    resolve(res);
				});
		});
    },

    // update photo
    updatePhoto: (id, data) => {
        return new Promise((resolve, reject) => {
            db.query(`
            update users set image = '${data}' where id_user = ${id};
            `, (err, res) => {
                if(err) return reject(err);
                resolve(res);
            })
        })
    },

    // get chat
    listChat: (user) => {
        return new Promise((resolve, reject) => {
            db.query(`
            select distinct on (involved) involved as userid, s.id, s.chat_sender, u.fullname as name, content, date_time, u.image
            from (select c.*, c.sender as chat_sender,
            case sender when ${user} then receiver else sender end as involved
            from chat c where c.sender = ${user} or c.receiver = ${user}) s
            join users u on s.involved = u.id_user
            order by involved, s.id desc;
            `, (err, res) => {
                if(err) reject(err);
                resolve(res);
            })
        });
    },
}

module.exports = userModel;