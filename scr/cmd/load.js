module.exports = {
  config: {
    name: "l",
    description: "Load command",
    usage: "<command name>",
    accessibleby: 0,
    author: "Deku",
    category: "system",
    prefix: true
  },
  start: async function({reply, text, react}){
    const fs = require('fs');
    let name = text[0];
    if (!name) return reply('Please enter the command name!');
    try {
      let msg = "";
      let count = 0;
      if (name == "all"){
        let errorCount = 0;
        let successCount = 0;
        let failedCommand = [];
        let successCommand = [];
        for (let file of fs.readdirSync(__dirname).filter(file => file.endsWith('.js'))){
          if (file == "load.js") continue;
          let command = require(__dirname + `/${file}`);
          if (command.akane.name == "load") continue;
          try {
delete require.cache[require.resolve(__dirname + `/${file}`)];
            let newCommand = require(__dirname + `/${file}`);
            successCount++;
            successCommand.push(newCommand.akane.name);
            count += 1
            msg += `Loaded ${count}.${newCommand.akane.name}\n`
          } catch (e){
            errorCount++;
          failedCommand.push(file);
            msg += `Failed to load ${count}.${newCommand.akane.name}\n`
          }
        }
        msg += `\nSuccessfully loaded ${successCount} command(s) sucessfully.\nFailed to load ${errorCount} command(s).\n\n${failedCommand.join(", ")}`;
        return reply(msg)
      }
      if (!fs.existsSync(__dirname + `/${name}.js`)) return reply('File '+name+".js doesn't exist!");
      delete require.cache[__dirname + `/${name}.js`];
 require(__dirname +'/'+ name);
      console.log('Command '+ name+' has been loaded!');
      return reply('Command '+ name+' has been loaded!');
    } catch (s){
      return reply('Error: '+s.message)
    }
  }
}