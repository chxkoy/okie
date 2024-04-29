module.exports = {
  config: {
    name: "date",
    accessableby: 0,
    prefix: true,
    description: "Pair with random user in group.",
    usage: "[date]",
  },
  start: async function ({ reply, react, text, event, api }) {
    try {
      const fs = require("fs"),
        { get } = require("axios"),
        path = __dirname + "/cache/pair.png",
        path1 = __dirname + "/cache/pair1.png";
      let { participantIDs } = await api.getThreadInfo(event.threadID);
      let percentage = Math.floor(Math.random() * 100);
      let uid = event.senderID,
        uid1,
        img = [];
      // if mention
      if (Object.keys(event.mentions).length != 0) {
        uid1 = Object.values(event.mentions)[0].replace("@", "");
      } else {
        uid1 =
          participantIDs[Math.floor(Math.random() * participantIDs.length)];
      }
      const name = (await api.getUserInfo(uid)).name;
      const name1 = (await api.getUserInfo(uid1)).name;
      // change their nickname
      api.changeNickname(`${name1} property ❤️`, event.threadID, uid);
      api.changeNickname(`${name1} property ❤️`, event.threadID, uid1);
      let pfp = (
        await get(
          `https://graph.facebook.com/${uid}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
        )
      ).data;
      let pfp1 = (
        await get(
          `https://graph.facebook.com/${uid1}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
        )
      ).data;
      fs.writeFileSync(path, Buffer.from(pfp, "utf-8"));
      fs.writeFileSync(path1, Buffer.from(pfp1, "utf-8"));
      img.push(fs.createReadStream(path));
      img.push(fs.createReadStream(path1));
      let msg = `💌 ${name} and ${name1} are ${percentage}% in love with each other.`;
      // make a group chat for them and send a message, after that the bot will leave.
      api.sendMessage("Creating a group chat for you two...", event.threadID, async (err, info) => {
        // create a group chat
        api.createNewGroup([uid, uid1], "Pairing", async (err, groupID) => {
          api.sendMessage("I hope this is where your love story begins.", groupID, async () => {
           await api.removeUserFromGroup(api.getCurrentUserID(), groupID);
          })
        })
      })
      return api.sendMessage(
        {
          body: msg,
          attachment: img,
        },
        event.threadID,
        event.messageID,
      );
    } catch (e) {
      return reply(e.message);
    }
  },
};
