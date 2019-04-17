/* eslint-disable require-jsdoc */
// const jimp = require('jimp');
const fs = require('fs');
const imageSplitter = require('./lib/imageSplitter.js');

(async()=> {
try {

  // sliceImage('test.jpg');

//  const image = fs.readFileSync('2364.png');
  const  chunckSize = 200;
  const chuncks = await imageSplitter.imageToChunks('imgs/test.png',chunckSize);
  console.log('Number of chunks', chuncks.length);

  console.log(chuncks);
  const actions = [];
  let i = 0;
  chuncks.forEach(c => {
    i++;
    actions.push(fs.writeFile(`slice_${i}.png`,c));
  });
  await Promise.all(actions);
} catch (e) {
  console.log(e);
}




})();