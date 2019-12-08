
/**
 * Returns a promise that will resolve with the data from the given path.
 * 
 * The data type determines the returned object:
 *
 *     "image" => Image
 *     "text" => string
 *     "arrayBuffer" => ArrayBuffer
 *     "blob" => Blob
 */
export default async function fetchDataType(path: string, dataType: string) {
  if (dataType === 'image') {
    // Promise wrapper for an image load.
    return new Promise((resolve) => {
      let image = new Image();

      image.onload = () => {
        resolve({ ok: true, data: image });
      };

      image.onerror = (e) => {
        resolve({ ok: false, error: 'ImageError', data: e });
      };

      image.src = path;
    });
  } else {
    let response: Response;

    // Fetch.
    try {
      response = await fetch(path);
    } catch (e) {
      return { ok: false, error: 'NetworkError', data: e };
    }

    // Fetch went ok?
    if (!response.ok) {
      return { ok: false, error: 'HttpError', data: response };
    }

    // Try to get the requested data type.
    try {
      let data: string | ArrayBuffer | Blob | null = null;

      if (dataType === 'text') {
        data = await response.text();
      } else if (dataType === 'arrayBuffer') {
        data = await response.arrayBuffer();
      } else if (dataType === 'blob') {
        data = await response.blob();
      }

      return { ok: true, data };
    } catch (e) {
      return { ok: false, error: 'DataError', data: e };
    }
  }
}