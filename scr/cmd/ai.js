module.exports = {
  config: {
    name: "ai",
    description: "Talk to GPT (conversational)",
    prefix: false,
    usage: "[ask]",
    accessableby: 0
  },
  start: async function ({ text, reply, react, event}) {
    let p = text.join(' '), uid = event.senderID;
    const axios = require('axios');
    if (!p) return reply('Please enter a prompt.');
    react('✨');
    try {
      const r = (await axios.get(`https://ai-tools.replit.app/gpt?prompt=${p}&uid=${uid}`)).data;
      return reply(r.gpt4 + "\n\nNOTE: THIS AI IS CONVERSATIONAL SO IF YOU WANT TO RESET YOUR CONVERSATION WITH AI JUST TYPE “clear”");
    } catch (g) {
      return reply(g.message);
    }
  }
}