const fs = require('fs');
const sourcePath = 'E:\\研究生\\StructV2\\dist\\sv.js';
const targetPath = 'E:\\研究生\\froend_student\\src\\pages\\student\\assets\\js\\sv.js'


function COPY(from, to) {
    const file = fs.readFileSync(from);
    fs.writeFileSync(to, file);
}


COPY(sourcePath, targetPath);