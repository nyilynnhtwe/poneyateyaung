import Replicate from 'replicate';
import fetch from 'cross-fetch';

export const generateImageUrl = async (
  content: string,
  isLandscape: boolean,
) => {
  let imageWidth = 1024;
  let imageHeight = 1024;
  if (isLandscape) {
    imageWidth = 1024;
    imageHeight = 768;
  } else {
    imageHeight = 1024;
    imageWidth = 768;
  }
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
    fetch: fetch,
  });

  const output = await replicate.run(
    'stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4',
    {
      input: {
        prompt: content,
        width: imageWidth,
        height: imageHeight,
      },
    },
  );
  return output;
};
