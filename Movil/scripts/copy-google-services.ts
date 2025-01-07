const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, '../docs/google-services.json');
const destination = path.join(__dirname, '../android/app/google-services.json');

fs.copyFileSync(source, destination);
console.log('Archivo google-services.json copiado a android/app.');