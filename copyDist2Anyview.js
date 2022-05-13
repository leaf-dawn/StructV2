const fs = require('fs');
const sourcePath = 'D:\\个人项目\\StructV2\\dist\\sv.js';
const targetPath = 'D:\\个人项目\\froend_student\\src\\pages\\student\\assets\\js\\sv.js'


function COPY(from, to) {
    const file = fs.readFileSync(from);
    fs.writeFileSync(to, file);
}


COPY(sourcePath, targetPath);