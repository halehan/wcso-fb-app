import * as async from "async";
import * as crypto from "crypto";
import * as nodemailer from "nodemailer";
import * as passport from "passport";
import { default as User, UserModel, AuthToken } from "../models/User";
import Message  from "../models/Message";
import { Request, Response, NextFunction } from "express";
import { LocalStrategyInfo } from "passport-local";
import { WriteError } from "mongodb";
import * as moment from "moment";
const request = require("express-validator");
const login = require("facebook-chat-api");

export let updateThread = (req: Request, res: Response, next: NextFunction) => {
  Message.update({threadId:  req.params.threadId}, {threadStatus: "closed"}, {multi: true},
  function(err, num) {
      console.log("updated ");
  }
  );
};


export let listenBot = (fbEmail: String, fbPassword: String) => {

const messageTxt = "We have recived your message and have added the request to our queue.  Please standby for a law enforcement representative to respone.  If this is an emergency situation please call 911.";

// Create simple echo bot
login({email: fbEmail, password: fbPassword}, (err: any, api: any) => {
  if (err) return console.error(err + "l");
  api.setOptions({listenEvents: false});

  console.log("Check");

  api.listen((err: any, fbMessage: any) => {
    if (err) return console.error(err);
      console.log("This Bot is listening on Darryl Williams or dwilliams@inspired-tech.net FB account");
      console.log("We will listen here for messages and when we get them write them to a MongoDB and use the messgeId and ThreadId to respond to FB user");
      console.log("Message Body = " + fbMessage.body);
      console.log("Message ThreadID = " + fbMessage.threadID);
      console.log("Message MessageID = " + fbMessage.messageID);
      console.log("Message Timestamp " + fbMessage.timestamp);

      Message.find({"threadId": fbMessage.threadID}, "messageId message threadId threadStatus", function(err: any, messageCheck: any) {
      console.log("messageCheck = " + messageCheck);
          if (err)
             console.log(err);
          else {
              if (messageCheck.length === 0 || messageCheck[messageCheck.length - 1].threadStatus === "closed") {
                  console.log(messageCheck);
                  api.sendMessage(messageTxt + "  :    Your message  " + fbMessage.body, fbMessage.threadID);

              }
          }

          const  message = new Message();

                  const nowDate = moment().format("MMMM Do YYYY, h:mm:ss a");

                  message.messageId = fbMessage.messageID;
                  message.threadId = fbMessage.threadID;
                  message.message = fbMessage.body;
                  message.threadStatus = "open";
                  message.createdTime = nowDate;

                  message.save(function(err: any) {
                      if (err)
                      console.log(err);
                      });

      });
   });
});

};

// export let sendFbMessage = (fbEmail: String, fbPassword: String, req: Request, res: Response) => {
export let sendFbMessage = (req: Request, res: Response, next: NextFunction) => {

  const  message = new Message();
  const  nowDate = moment().format("MMMM Do YYYY, h:mm:ss a");

  message.message = req.body.message;
  message.messageId = req.body.messageId;
  message.threadId = req.body.threadId;
  message.threadStatus = req.body.threadStatus;
  message.createdTime = nowDate;

      // Create simple echo bot
login({email: process.env.FACEBOOK_EMAIL, password: process.env.FACEBOOK_PASSWORD}, (err: any, api: any) => {
  if (err) return console.error(err + "l");
          const nowDate = moment().format("MMMM Do YYYY, h:mm:ss a");

          message.save(function(err: any) {
              if (err)
              console.log(err);
              });

      api.sendMessage(req.body.message, req.body.threadId);

      res.json({ message: "Just sent Message to " + req.body.threadId});

});

};


export let findAllMessages = (req: Request, res: Response, next: NextFunction) => {

    Message.find().exec((err, messages: any) => {
      if (err)
        res.send(err);
      res.json(messages);
    });
  };

export let findMessage = (req: Request, res: Response, next: NextFunction) => {
  Message.find({ messageId: req.params.messageId }, (err, message: any) => {
    if (err)
      res.send(err);
    res.json(message);
  });
};

export let updateMessage = (req: Request, res: Response, next: NextFunction) => {

  Message.findById(req.params.messageId, (err, msg) => {
    if (err)
    res.send(err);
    msg.createdTime = req.body.createdTime || "";
    msg.threadStatus = req.body.threadStatus || "";
    msg.message = req.body.message || "";
    msg.messageId = req.body.messageId || "";
    msg.save((err: WriteError) => {
      if (err) {
        res.json(err);
      }
      res.json({ message: "success" });
    });
  });
 };

export let createMessage = (req: Request, res: Response, next: NextFunction) => {

  const msg = new Message({
    messageId: req.body.messageId,
    createdTime: req.body.createdTime,
    threadStatus: req.body.threadStatus,
    message: req.body.message,
    threadId: req.body.threadId
  });

  msg.save((err) => {
    if (err)
    res.send(err);
    res.json({ message: "success" });
  });

};