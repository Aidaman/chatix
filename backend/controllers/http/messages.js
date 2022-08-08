const crypto = require('crypto-js');
const {MESSAGE_KEY} = require('../../config/config');
const Message = require('../../models/message');
const Room = require('../../models/room');

module.exports.roomAmountOfMessage = async (req, res) => {
    try {
        const room = await Room.findOne({_id: req.params.id, users: req.decoded.id});
        if (!room) {
            throw new Error('Not Allowed')
        }

        const messages = await Message.find({room: req.params.id}).skip(+req.query.offset).sort('-createdAt').populate('creator');
        return res.status(200).send(messages.length.toString());

    } catch (e) {
        console.log(e);
        res.status(500).send('error')
    }
}

module.exports.roomContent = async (req, res) => {
    try {
        let limit = +req.query.limit || 50;
        if (req.params.id.trim().length < 2
            || req.query.offset === undefined
            || +req.query.offset < 0
            || limit === undefined || limit < 0) {
            throw new Error('invalid data')
        }

        const room = await Room.findOne({_id: req.params.id, users: req.decoded.id});
        if (!room) {
            throw new Error('Not Allowed')
        }

        while (+req.query.offset === 0 && !room.isFavorites) {
            const message = await Message.find({room: req.params.id}).skip(limit).limit(1).sort('-createdAt');
            // console.log("limit, message: ", limit, message);
            if (message[0] && !message[0].read.find(i => String(i) === req.decoded.id)) {
                limit += 15;
            } else {
                break;
            }
        }

        const messages = await Message.find({room: req.params.id}).skip(+req.query.offset).limit(limit).sort('-createdAt').populate('creator');
        if (messages) {
            const messagesDecrypted = messages.reverse().map(i => {
                const bytes = crypto.AES.decrypt(i.content.toString(), MESSAGE_KEY);
                i.content = bytes.toString(crypto.enc.Utf8);
                return i;
            });
            // console.log("Messages", messages);
            return res.send(messagesDecrypted)
        }

        throw new Error('Not Found')
    } catch (e) {
        console.log(e);
        res.status(500).send('error')
    }
};

module.exports.roomUnreadContent = async (req, res) => {
    try {
        const messages = await Message.find({room: req.params.id}).skip(+req.query.offset).sort('-createdAt').populate('creator');
        if (!messages){
            throw new Error('Not Found')
        }

        let unread = 0;
        messages.forEach((message)=>{
            console.log(message.unread);
           if (message.unread.indexOf(req.decoded.id) === -1)
            unread += 1;
        });
        // console.log(unread);

        return res.status(200).send(unread.toString());
    } catch (e) {
        console.log(e);
        res.status(500).send('error')
    }
};