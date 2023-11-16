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
    'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
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
