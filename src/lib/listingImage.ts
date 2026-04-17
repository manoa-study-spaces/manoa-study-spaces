/**
 * Represents a listing image stored on Vercel Blob.
 */
export type listingImage = {
  id: number;
  mimeType: string;
  url: string;
};

/**
 * Fallback “No Image Available” image.
 */
export const DEFAULT_IMAGE: listingImage = {
  id: -1,
  mimeType: 'image/png',
  url: '/listing-photo/no-image-available.png',
};

/**
 * Fetch listing images from Vercel Blob by listing ID.
 * The API route should use `@vercel/blob` to list or retrieve blob URLs.
 *
 * @param listingID – ID of the listing item whose images you want.
 * @param addDummy – If true, return DEFAULT_IMAGE when no images exist.
 */
export async function getlistingImagesBylistingID(
  listingID: number,
  addDummy: boolean = true,
): Promise<listingImage[]> {
  try {
    const res = await fetch(`/api/blob/listing-images?listingID=${listingID}`, {
      cache: 'no-store',
    });

    let result: listingImage[] = [];

    if (res.ok) {
      result = await res.json();
    }

    if (addDummy && result.length === 0) {
      result.push(DEFAULT_IMAGE);
    }

    return result;
  } catch (err) {
    return addDummy ? [DEFAULT_IMAGE] : [];
  }
}

/**
 * Returns an image source URL for the <Image> component.
 */
export function parseImageSource(image: listingImage): string {
  return (image.url ?? DEFAULT_IMAGE.url) ?? '/listing-photo/no-image-available.png';
}
