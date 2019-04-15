const jimp = require('jimp');
const fs = require('fs');

/**
 * getBufferAsync(mime)
 * Jimp.MIME_JPEG; // "image/jpeg"
 * @param {*} filename 
 */
async function sliceImage(filename) {
  const image = await jimp.read(filename);
  const { width, height } = image.bitmap;
  console.log('width',width, 'height', height);
  const sliceHeight = Math.round(height / 2);
  const slice1 = image.clone().crop(0, 0, width, sliceHeight);
  await slice1.writeAsync('slice1.jpg');
  const slice2 = image.clone().crop(0, sliceHeight, width, sliceHeight);
  await slice2.writeAsync('slice2.jpg');
}

const imageChunks = async (filename, chunk, step = 0, chunks = []) => {

  const image = await jimp.read(filename);
  const { width, height } = image.bitmap;



  console.log(chunk, height);
  if(height <= (chunk + step)) {
    const slice = image.clone().crop(0, step, width, (chunk + step) - (height + 100));
    const buffer = await slice.getBufferAsync(jimp.MIME_JPEG);
    chunks.push(buffer);
    return chunks;
  } else {
    const slice = image.clone().crop(0, step, width, chunk);
    const buffer = await slice.getBufferAsync(jimp.MIME_JPEG);
    chunks.push(buffer);
    return imageChunks(filename, chunk + step, step + chunk, chunks);
  }


};


(async()=> {
try {

  // sliceImage('test.jpg');
  const img = await jimp.read('test.jpg');
  const {  height, width } = img.bitmap;
  const split = Math.round(height / 3);
  const chuncks = await imageChunks('test.jpg',split,0);
  console.log(chuncks);
  const actions = [];
  let i = 0;
  chuncks.forEach(c => {
    i++;
    actions.push(fs.writeFile(`slice_${i}.jpg`,c));
  });
  await Promise.all(actions);
} catch (e) {
  console.log(e);
}




})();