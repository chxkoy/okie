const { dalle, stablediffusion, emi, pixart, render3d } = require("gpti");

const fs = require("fs");

async function decoder(base64, path) {

  fs.writeFileSync(

    path,

    base64.split(";base64,").pop(),

    { encoding: "base64" },

    function (err) {

      if (err) return console.log(err);

      console.log("File " + path + " created");

    },

  );

}

let sdxlPath = __dirname + "/cache/sdxl.jpg",

  emiPath = __dirname + "/cache/emi.jpg",

  pixartPath = __dirname + "/cache/pixart.jpg",

  dallePath = __dirname + "/cache/dall-e.jpg",

  render3dPath =  __dirname + "/cache/render3d.jpg";

module.exports = {

  config: {
    name: "genv2",
    description: "Generate image with AI",
    accessableby: 0,
    prefix: false,
    usage: "type | prompt | style",
  },
  start: async function ({ reply, text }) {

    if (!text[0]) return reply("Missing type or prompt!");

    var type;

    var style;

    const content = text

      .join(" ")

      .split("|")

      .map((item) => (item = item.trim()));

    let types = content[0];

    let prompt = content[1];

    let styles = content[2];

    if (text[0] == "list") {

      var msg =

        "[ AVAILABLE TYPE ]\n\n1. SDXL\n2. EMI\n3. PIXART\n4. DALL-E\n5. Render 3D\n\nUse: " +

        this.akane.name +

        " type (1-4) | prompt | style (1-9) (if needed)\n\n[ AVAILABLE IMAGE STYLES ]\n\nSDXL\n1. Cinematic\n2. Photographic\n3. Anime\n4. Manga\n5. Digital Art\n6. Pixel art\n7. Fantasy art\n8. Neonpunk\n9. 3D Model\n\nPIXART\n1. Cinematic\n2. Photographic\n3. Anime\n4. Manga\n5. Digital Art\n6. Pixel art\n7. Fantasy art\n8. Neonpunk\n9. 3D Model";

      return reply(msg);

    }
if (!types || !prompt) return reply('Missing type or prompt!');
    switch (types) {

      case "1":

        type = "sdxl";

        break;

      case "2":

        type = "emi";

        break;

      case "3":

        type = "pixart";

        break;

      case "4":

        type = "dall-e"

        break;

      case "5":

        type = "render3d"

        break;

      default:

        return reply("Choose 1-5 only.");

    }

    switch (styles) {

      case "1":

        style = "Cinematic";

        break;

      case "2":

        style = "Photographic";

        break;

      case "3":

        style = "Anime";

        break;

      case "4":

        style = "Manga";

        break;

      case "5":

        style = "Digital Art";

        break;

      case "6":

        style = "Pixel art";

        break;

      case "7":

        style = "Fantasy art";

        break;

      case "8":

        style = "Neonpunk";

        break;

      case "9":

        style = "3D Model";

        break;

     // default:

   //reply("Choose 1-9 only.");

    }

    if (type == "sdxl") {

      if (!styles) return reply("Missing style.");
reply('✨Generating');
      stablediffusion.xl(

        {

          prompt,

          data: {

            prompt_negative:

              "",

            image_style: style,

            guidance_scale: 7.5,

          },

        },

        (err, data) => {

          if (err != null) {

            return reply(err);

          } else {

            if (!data) return reply("No results found.");

            decoder(data.images[0], sdxlPath);

            return reply({ attachment: fs.createReadStream(sdxlPath) });

          }

        },

      ); //end of xl

    } //end of sdxl

    if (type == "emi") {
reply('✨Generating');
      emi(

        {

          prompt,

        },

        (err, data) => {

          if (err != null) {

            return reply(err);

          } else {

            if (!data) return reply("No results found.");

            decoder(data.images[0], emiPath);

            return reply({ attachment: fs.createReadStream(emiPath) });

          }

        },

      );

    } //end of emi

    if (type == "pixart") {

      if (!styles) return reply("Missing style.");
reply('✨Generating');
      pixart.lcm(

        {

          prompt,

          data: {

            prompt_negative:

              "",

            image_style: style,

            width: 1024,

            height: 1024,

            lcm_inference_steps: 9,

          }, //Data

        },

        (err, data) => {

          if (err != null) {

            console.log(err);

          } else {

            decoder(data.images[0], pixartPath);

            return reply({ attachment: fs.createReadStream(pixartPath) });

          }

        },

      );

    } //end of pixart

    if (type == "dall-e"){
      reply('✨Generating');
      dalle.v1({
       prompt
}, (err, data) => {
    if(err != null){
        return reply(err);
    } else {
        decoder(data.images[0], dallePath);
        return reply({ attachment: fs.createReadStream(dallePath) });
    }
});
    } // end of dall-e

if (type == "render3d") {

reply('✨Generating');

      render3d(

        {

          prompt,
          data: {
              prompt_negative: ""
              }

        },

        (err, data) => {

          if (err != null) {

            return reply(err);

          } else {

            if (!data) return reply("No results found.");

            decoder(data.images[0], render3dPath);

            return reply({ attachment: fs.createReadStream(render3dPath) });

          }

        },

      );

    } //render3d
  },

};