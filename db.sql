create table users(
    id_user serial primary key,
    username varchar(30),
    fullname varchar(30),
    email varchar(30) unique,
    phone varchar(15),
    password text,
    image text,
    bio text,
    date_created date
);

create table chat(
    id serial primary key,
    sender integer references users(id_user),
    receiver integer references users(id_user),
    content text,
    type integer, -- 0 text, 1 image, 2 video
    date_time date
);
