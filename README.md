# split-images

## What is it
split-images is a simple package that allows you to split an image to chunks 
the chunks are returned as an Array<Buffer> (Array of buffers) of the image type provided.


## Examples
### 
```
const fs = require('fs');
const { imageToChunks } = require('split-images');

(async()=> {
try {
  const chunckSize = 1000;
  const chuncks = await imageToChunks('imgs/test.png',chunckSize);
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
```