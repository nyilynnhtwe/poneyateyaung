import Replicate from 'replicate';
import fetch from 'cross-fetch';

export const generateImageUrl = async (
  content: string,
  isLandscape: boolean,
) => {
  //   let imageWidth = 1024;
  //   let imageHeight = 1024;
  //   if (isLandscape) {
  //     imageWidth = 1024;
  //     imageHeight = 768;
  //   } else {
  //     imageHeight = 1024;
  //     imageWidth = 768;
  //   }
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
    fetch: fetch,
  });

  const output = await replicate.run(
    'stability-ai/sdxl:a00d0b7dcbb9c3fbb34ba87d2d5b46c56969c84a628bf778a7fdaec30b1b99c5',
    {
      input: {
        prompt: content,
      },
    },
  );
  console.log(output);

  return output;
};
