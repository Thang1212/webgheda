const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const get_layout = (layoutName = "", data = {}) => {
    let filePath = path.join(__dirname, `../layouts/${layoutName}.ejs`);
    return fs.existsSync(filePath) ? ejs.render(fs.readFileSync(filePath, 'utf8'), data) : `File "${filePath}" không tồn tại!`;
};


module.exports = { get_layout };
