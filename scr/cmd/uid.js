module.exports = {
  config: {
    name: "id",
    accessableby: 0,
    description: "Get user ID",
    usage: "id/reply/group/all",
    prefix: false,
    credits: "Deku"
  },
  start: async function ({ text, reply, event }) {
    let id;
    if (!text[0]) {
      id = event.senderID
    }
    
    if (event.type == "message_reply") {
      id = event.messageReply.senderID;
    }
    let t = text.join(' ')
    if (t.indexOf('@') !== -1) {
      id = Object.keys(event.mentions)[0]
    }
    let m = '', c = 0;
    if (t == "all") {
     for (let i of event.participantIDs) {
       c += 1
       m += `${c}. ${i}\n`
     }
      return reply(m)
    }
    if (t == "-g" || t == "group") {
      id = event.senderID
    }
    return reply(id)
  }
}