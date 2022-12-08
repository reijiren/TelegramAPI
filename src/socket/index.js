const { writeFile } = require("fs");
const {store, list} = require('../model/chat.model')

module.exports = (io, socket) => {
    // sender
    socket.on('ping', (data) => {
        // receiver
        socket.emit('ping-response', data);
    })
    
    // private room
    socket.on('join-room', (data) => {
        socket.join(data);
    })

    // store message
    socket.on('send-message', (data) => {
        store(data)
        .then(async() => {
            const listChat = await list(data.sender, data.receiver)
            io.to(data.receiver).emit('send-message-response', listChat.rows)
        })
        .catch((err) => {
            console.log(err)
        })
    });

    // upload image
    socket.on('upload-image', (data) => {
        console.log(data)
    })

    // history
    socket.on("chat-history", async(data) => {
        try{
            const listChat = await list(data.sender, data.receiver);
            io.to(data.sender).emit("send-message-response", listChat.rows);
        }catch(err){
            console.log('Error fetching chat history')
        }
    })
}