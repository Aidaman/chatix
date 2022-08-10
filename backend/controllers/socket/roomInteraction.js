const User = require('../../models/user');
const Room = require('../../models/room');
const {getUserSocketsRoom} = require('./utils');
const crypto = require('crypto-js');
const validator = require('validator');
const Message = require('../../models/message');
const {MESSAGE_KEY} = require('../../config/config');

module.exports = {
    acceptInvitation: async (io, socket, params) => {
        try {
            let room = await Room.findById(params.roomId);
            const user = await User.findById(socket.decoded_token.id);
            if (room && user) {
                room = await room.populate([{path: 'users'}, {path: 'creator'}]).execPopulate();
                socket.join(params.roomId);
                io.to(socket.id).emit('newRoom', room);

                return io.to(params.roomId).emit('userJoined', {user: user, room: room});
            }
            throw new Error('Not allowed');
        } catch (e) {
            console.log(e);
            io.to(socket.id).emit('error', {error: {type: e.message}});
        }
    },

    joinRoom: async (io, socket, params) => {
        try {
            let room = await Room.findOne({
                _id: params.roomId,
                users: {$ne: socket.decoded_token.id},
                isPublic: true,
                isFavorites: false
            });
            const user = await User.findById(socket.decoded_token.id);
            if (room && user) {
                room.users.push(user);
                room.lastAction = Date.now();
                room = await room.save();
                room = await room.populate([{path: 'users'}, {path: 'creator'}]).execPopulate();
                user.socketIds.forEach(i => {
                    const socket = io.sockets.connected[i];
                    if (socket) {
                        socket.join(params.roomId)
                    }
                });
                const content = `${user.name} joined the room!`;
                const contentEncrypted = crypto.AES.encrypt(validator.escape(content), MESSAGE_KEY).toString();
                await Message.create({
                    createdAt: Date.now(),
                    room: params.roomId,
                    content: contentEncrypted,
                    isSystemMessage: true,
                    creator: user
                });
                io.to(getUserSocketsRoom(user)).emit('newRoom', room);
                console.log(user, room);
                io.to(params.roomId).emit('userJoined', {user, room});
                return socket.broadcast.to(params.roomId).emit('newMessage', {
                    message: {
                        content,
                        createdAt: Date.now(),
                        isSystemMessage: true,
                        creator: user
                    }, room: params.roomId
                })
            }
            throw new Error('Not allowed');
        } catch (e) {
            console.log(e);
            io.to(socket.id).emit('error', {error: {type: e.message}});
        }
    },

    leaveRoom: async (io, socket, params) => {
        try {
            const id = socket.decoded_token.id;
            const user = await User.findById(id);
            let room = await Room.findOne({_id: params.roomId, isFavorites: false});

            if (room && room.users.indexOf(id) !== -1) {
                room.users.pull(id);
                room.lastAction = Date.now();
                room = await room.save();

                console.log(user, room);
                io.to(params.roomId).emit('userLeft', {user: user, room: room});

                user.socketIds.forEach(i => {
                    const socket = io.sockets.connected[i];
                    if (socket) {
                        socket.leave(params.roomId)
                    }
                });

                const content = `${user.name} left the room ☹`;
                const contentEncrypted = crypto.AES.encrypt(validator.escape(content), MESSAGE_KEY).toString();

                await Message.create({
                    createdAt: Date.now(),
                    room: params.roomId,
                    content: contentEncrypted,
                    isSystemMessage: true,
                    creator: user
                });

                io.to(params.roomId).emit('newMessage', {
                    message: {
                        content,
                        createdAt: Date.now(),
                        isSystemMessage: true,
                        creator: user
                    }, room: params.roomId
                });

                if (room.users.length === 1) {
                    const lastUser = await room.populate('users').execPopulate();
                    console.log(user, room);
                    io.to(getUserSocketsRoom(lastUser.users[0])).emit('userLeft', {
                        user: lastUser.users[0],
                        room: room
                    });
                    lastUser.users[0].socketIds.forEach(socketId => {
                        const socket = io.sockets.connected[socketId];
                        if (socket) {
                            socket.leave(params.roomId)
                        }
                    });

                    await room.remove();
                    io.to(params.roomId).emit('roomDeleted', {id: params.roomId});
                }
            } else throw new Error('Not allowed');
        } catch (e) {
            console.log(e);
            io.to(socket.id).emit('error', {error: {type: e.message}});
        }
    },

    searchRoom: async (io, socket, params) => {
        try {
            const rooms = await Room.find({
                title: {
                    $regex: '.*' + params + '.*',
                    $options: 'i'
                },
                isPublic: true
            });
            io.to(socket.id).emit('searchRoomsResult', rooms)
        } catch (e) {
            console.log(e)
        }
    },

    getAllRooms: async (io, socket, params) => {
        try {
            let user = await User.findById(socket.decoded_token.id);

            const usersOnline = await User.find({isOnline: true});
            const rooms = await Room.find({users: user._id}).populate([{path: 'users'}, {path: 'creator'}]).sort('-lastAction');
            rooms.push({
                _id: 'common',
                title: 'Common',
                users: usersOnline,
                isPublic: true,
            });

            for (const room of rooms) {
                if (!room.isFavorites)
                {
                    const messages = await Message.find({room: room.id, isSystemMessage: false})
                    messages.forEach((message)=>{
                        if ((String(message.creator) !== String(user._id))
                            && message.read.find(i => String(i) === String(user._id)) === undefined) {
                            room.unread += 1;
                        }
                    });
                }
            }

            io.to(socket.id).emit('allRooms', rooms)
        } catch (e) {
            console.log(e);
            io.to(socket.id).emit('error', {error: {type: e.message}});
        }
    }
};