import { Image } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import { IMAGE_COMPRESSION_STEPS, IMAGE_MAX_DATA_URI_LENGTH } from '../../constants';

interface ImageSize {
  width: number;
  height: number;
}

const readSize = (uri: string): Promise<ImageSize | null> =>
  new Promise((resolve) => {
    Image.getSize(uri, (width, height) => resolve({ width, height }), () => resolve(null));
  });

const resizeActions = (size: ImageSize | null, maxDimension: number): ImageManipulator.Action[] => {
  if (!size || Math.max(size.width, size.height) <= maxDimension) return [];
  return [
    size.width >= size.height
      ? { resize: { width: maxDimension } }
      : { resize: { height: maxDimension } },
  ];
};

export const compressImageToDataUri = async (
  uri: string,
  knownSize?: ImageSize,
): Promise<string | null> => {
  const size = knownSize ?? (await readSize(uri));
  for (const { maxDimension, quality } of IMAGE_COMPRESSION_STEPS) {
    const result = await ImageManipulator.manipulateAsync(uri, resizeActions(size, maxDimension), {
      compress: quality,
      format: ImageManipulator.SaveFormat.JPEG,
      base64: true,
    });
    if (!result.base64) continue;
    const dataUri = `data:image/jpeg;base64,${result.base64}`;
    if (dataUri.length <= IMAGE_MAX_DATA_URI_LENGTH) return dataUri;
  }
  return null;
};
