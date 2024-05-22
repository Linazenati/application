import multer from 'multer';
const path = require('path');
import * as fse from 'fs-extra';

const clientStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    const rootPath = path.resolve(__dirname, '..', '..');
    const destinationPath = path.join(rootPath, 'clientPictures');
    callback(null, destinationPath);
  },
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    callback(null, file.fieldname + '-' + uniqueSuffix + '.jpg');
  },
});

const eventStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    const rootPath = path.resolve(__dirname, '..', '..');
    const destinationPath = path.join(rootPath, 'eventPictures');
    callback(null, destinationPath);
  },
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    callback(null, file.fieldname + '-' + uniqueSuffix + '.jpg');
  },
});

const companyStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    const rootPath = path.resolve(__dirname, '..', '..');
    const destinationPath = path.join(rootPath, 'companyPictures');
    callback(null, destinationPath);
  },
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    callback(null, file.fieldname + '-' + uniqueSuffix + '.jpg');
  },
});



export const uploadClient = multer({ storage: clientStorage });
export const uploadEvent = multer({ storage: eventStorage });
export const uploadCompanyLogo = multer({ storage: companyStorage });

function checkClientsPicDirectoryExists() {
  const rootPath = path.resolve(__dirname, '..', '..');
  const clientDirectory = path.join(rootPath, 'clientPictures');
  const eventDirectory = path.join(rootPath, 'eventPictures');
  const companyDirectory = path.join(rootPath, 'companyPictures');
  console.log(rootPath);
  
  // Utilisez fs-extra pour créer le répertoire de manière récursive
  fse.ensureDirSync(clientDirectory);
  fse.ensureDirSync(eventDirectory);
  fse.ensureDirSync(companyDirectory);
}


export default checkClientsPicDirectoryExists;
