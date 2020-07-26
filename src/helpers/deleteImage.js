// import fs
const fs = require('fs')
const path = 'src/assets/images/';
const imagePath = global.appRoot + "/" + path;
const config = require("../configs/global");

module.exports = {
  delete: function (myRequest, file_name = "") {
    const newFileName = file_name.split(`${myRequest.protocol}://${myRequest.host}/${config.rootProjectPath}/images/`).pop();
    const targetFile = `${imagePath}${newFileName}`;

    if (newFileName.split(`.`)[0] !== `default` || newFileName.split(`.`)[0] !== `avatar`) {
      if (fs.existsSync(targetFile)) {
        try {
          fs.unlinkSync(targetFile);
        } catch (error) {
          console.log(error);
        }
      }
    }
  }
}