import * as bcrypt from "bcrypt-nodejs";
import * as crypto from "crypto";
import * as mongoose from "mongoose";


import IMessage = require("./IMessage");

interface IMessageModel extends IMessage, mongoose.Document { }

  const messageSchema = new mongoose.Schema({
    createdTime: String,
    threadStatus: String,
    message: String,
    threadId: String,
    messageId: String,
  });

// const Message = mongoose.model(<Message>, messageSchema);
const Message = mongoose.model<IMessageModel>("Message", messageSchema);
export default Message;