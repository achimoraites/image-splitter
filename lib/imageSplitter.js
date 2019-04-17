const jimp = require('jimp');

// constants


// helpers
/**
 * 
 * @param {*} image the image to process
 * @param {*} chunk size of each chunk
 * @param {*} step the start of image , defaults to 0
 * @param {*} chunks the array of chunks 
 * @param {*} height the height of the image
 * @param {*} width the width of the image
 */
async function imageChunks (image, chunk, step = 0, chunks = [],height, width)  {
  
   // console.log(chunks.length + 1);
    if(height <= (chunk + step)) {
      const slice = image.clone().autocrop().crop(0, step, width, (height - step));
      let buffer;
      slice.getBuffer(jimp.AUTO,(err, data)=> {
        if(data) {
          buffer = data;
        }
      });
      chunks.push(buffer);
      return chunks;
    } else {
      let slice = image.clone().crop(0, step, width, chunk).autocrop();
      let buffer;
      slice.getBuffer(jimp.AUTO,(err, data)=> {
        if(data) {
          buffer = data;
          chunks.push(buffer);
          return imageChunks(image, chunk, (step + chunk), chunks,height,width);
        } else {
          return chunks;
        }
      });
  
    }
  
  }
// exports

  /**
   * creates an array of image chunks
   * @returns Array<Buffer>
   */
  exports.imageToChunks = async (image, chunkSize) => {
      const img = await jimp.read(image);
      const { width, height } = img.bitmap;
      const chunks = [];
      await imageChunks(img,chunkSize,0,chunks,height,width);
      return chunks;
  }
  