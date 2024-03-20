const X = require("fb-chat-support"),
  { warn, logger } = require("./utils/logger"),
  { get, post } = require("axios"),
  fs = require("fs"),
  { join } = require("path");
require('./utils/index')
const appState = JSON.parse(fs.readFileSync("botCookie.json", "utf8"));
const { exec } = require("child_process");
let packagePath = join(__dirname, "package.json");
let package = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const config = JSON.parse(fs.readFileSync("config.json", "utf8"));
const { PREFIX, ADMINBOT, BOTNAME } = config;
let p = PREFIX;
global.deku = new Object({
  PREFIX,
  BOTNAME,
  ADMINBOT,
});

/* INSTALLING COMMANDS */
let commandPath = join(__dirname, "scr", "cmd");

for (let files of fs.readdirSync(commandPath)) {
  if (files.endsWith(".js")) {
    let script;
    try {
      if (!files.endsWith(".js"))
        return warn("Command Error: File Extension Error");
      script = require(join(commandPath, files));
      logger("Successfully installed command: " + script.config?.name);
    } catch (e) {
      warn("Can't install command: " + files + "\nReason: " + e);
    }
  }
}

/* END */
process.on("unhandledRejection", (error) => console.error(error));

process.setMaxListeners(0);
require("events").EventEmitter.defaultMaxListeners = 0;
X(
  {
    appState,
  },
  async function (err, api) {
logger('This bot was made by Deku')
logger('Contact: https://facebook.com/joshg101')
    if (err) return warn(err);
    api.setOptions(config.option);
    api.listenMqtt(async function (err, event) {
      if (err) warn(err);
      // start
      if (event.body != null) {
        for (let files of fs.readdirSync(commandPath)) {
          if (files.endsWith(".js")) {
            const pa = join(commandPath, files);
            const script = require(pa);
            let s = script.config;
            function reply(text) {
              api.sendMessage(text, event.threadID, event.messageID);
            }
            function react(emoji) {
              api.setMessageReaction(emoji, event.messageID, (err) => {}, true);
            }
            function noP(nam) {
              return reply(
                "You don't have permission to use command " + nam + "!",
              );
            }
            function noPref(nam) {
              reply("Command " + nam + " doesn't need a prefix.");
            }
            function yesPref(nam) {
              reply("Command " + nam + "need a prefix.");
            }
            let input = event.body;
            let args = input.split(" ");
            args.shift();
            let arg = event.body.split(" ");
            let t = arg.shift().toLowerCase();
            let obj = {
              api,
              event,
              react,
              reply,
              text: args,
            };
   if (script.auto) {
     script.auto(obj)
   }
            if (t == "prefix") return reply("Prefix: " + p);
            if (t == p)
              return reply("Type " + p + "help to view available commands.");

            //no prefix
            if (t == p + s?.name && s?.prefix == false) {
              return yesPref(s.name);
            }

            //yes prefix
            if (t == s?.name && s?.prefix == true) {
              return noPref(s?.name);
            }

            //permission
            if (t == p + s?.name || t == s?.name) {
              if (s?.accessableby == 1 && !ADMINBOT.includes(event.senderID)) {
         return noP(s?.name);
              } 
}

            //start
            if (t == p + s?.name || t == s?.name) {
              script.start(obj);
            } // end
          } // end of file ends with .js
        } // end of loop file
      } // end of event body null
    }); // end of listenMqtt
  },
); // end of X

/* 
THIS BOT WAS MADE BY DEKU
CONTACT ME ON FACEBOOK: https://facebook.com/joshg101
*/