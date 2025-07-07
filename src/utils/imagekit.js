import ImageKit from 'imagekit';
import fs from 'fs';

const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const uploadOnImageKit = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const fileBuffer = fs.readFileSync(localFilePath);
    const fileName = localFilePath.split('/').pop();

    const response = await imageKit.upload({
      file: fileBuffer,
      fileName: fileName,
    });

    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
  }
};

const deleteFromImagekit = async (fieldId) => {
  try {
    const response = await imageKit.deleteFile(fieldId);
    return response;
  } catch (error) {
    console.error('ImageKit deletion failed:', error?.message || error);
    return null;
  }
};

export { uploadOnImageKit, deleteFromImagekit };
