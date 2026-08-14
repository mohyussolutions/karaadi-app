import { Image } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';

const MAX_DIMENSION = 1080;
const JPEG_QUALITY = 0.8;

function getImageSize(uri: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    Image.getSize(uri, (width, height) => resolve({ width, height }), reject);
  });
}

export async function compressToDataUri(uri: string): Promise<string> {
  const actions: ImageManipulator.Action[] = [];
  try {
    const { width, height } = await getImageSize(uri);
    const longEdge = Math.max(width, height);
    if (longEdge > MAX_DIMENSION) {
      actions.push(
        width >= height
          ? { resize: { width: MAX_DIMENSION } }
          : { resize: { height: MAX_DIMENSION } },
      );
    }
  } catch {}

  const result = await ImageManipulator.manipulateAsync(uri, actions, {
    compress: JPEG_QUALITY,
    format: ImageManipulator.SaveFormat.JPEG,
    base64: true,
  });

  return `data:image/jpeg;base64,${result.base64}`;
}
