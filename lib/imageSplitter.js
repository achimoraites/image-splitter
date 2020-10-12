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
  * @param vertical split direction (boolean)
 */
async function imageChunks(image, chunk, step = 0, chunks = [], height, width, vertical) {

    // console.log(chunks.length + 1);
    if ((vertical ? width : height) <= (chunk + step)) {
        const slice = image.clone().autocrop().crop(vertical ? step : 0, vertical ? 0 : step, vertical ? (width - step) : width, vertical ? height : (height - step));
        let buffer;
        slice.getBuffer(jimp.AUTO, (err, data) => {
            if (data) {
                buffer = data;
            }
        });
        chunks.push(buffer);
        return chunks;
    } else {
        let slice = image.clone().crop(0, step, vertical ? chunk : width, vertical ? height : chunk).autocrop();
        let buffer;
        slice.getBuffer(jimp.AUTO, (err, data) => {
            if (data) {
                buffer = data;
                chunks.push(buffer);
                return imageChunks(image, chunk, (step + chunk), chunks, height, width, vertical);
            } else {
                return chunks;
            }
        });

    }

}

// exports

/**
 * creates an array of image chunks
 * @param image the image to process
 * @param chunkSize the size of each chunk
 * @param vertical split direction (boolean)
 *
 * @returns Array<Buffer>
 */
exports.imageToChunks = async (image, chunkSize, vertical) => {
    const img = await jimp.read(image);
    const {width, height} = img.bitmap;
    if (chunkSize >= vertical ? width : height) {
        throw new Error(`The chunk size can't be bigger than the image ${vertical ? 'width' : 'height'}!`);
    }
    const chunks = [];
    await imageChunks(img, chunkSize, 0, chunks, height, width, vertical);
    return chunks;
}
