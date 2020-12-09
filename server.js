const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin,getCurrentUser,userLeave,getRoomUsers} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
//set static folder
app.use(express.static(path.join(__dirname,'public')));

const botName = 'admin';

// Run when client connects
io.on('connection',socket => {
     
    socket.on('joinRoom',({username,room})=>{
        
        const user = userJoin(socket.id,username,room);
        socket.join(user.room);
     //Welcome current user
     socket.emit('message',formatMessage(botName,`欢迎${user.username}来到聊天室!`));

     //Broadcast when a user connects
     socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username}加入了聊天`));
    
    
     //Runs when client disconnects
        socket.on('disconnect',()=>{
            const user = userLeave(socket.id);

            if(user){
                
                io.to(user.room).emit('message',formatMessage(botName,`${user.username}离开了房间`))
            }

              //Send users and room info
                io.to(user.room).emit('roomUsers',{
                    room: user.room,
                    users: getRoomUsers(user.room)
                });
        })

             //Send users and room info
            io.to(user.room).emit('roomUsers',{
                room: user.room,
                users: getRoomUsers(user.room)
            });
    
     });
   

  

     //Listen for chatMessage
     socket.on('chatMessage',(msg)=>{

        const user = getCurrentUser(socket.id);
         io.to(user.room).emit('message',formatMessage(user.username,msg));
     });
})
const PORT = 3000 || process.env.PORT;


server.listen(PORT,()=>console.log(`Server running on port ${PORT}`));
