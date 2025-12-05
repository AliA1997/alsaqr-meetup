import { HowSimilarKeys } from "@models/enums";

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export function openGoogleMaps(lat: number, lng: number) {
  const url = `https://www.google.com/maps?q=${lat},${lng}`;
  window.open(url, '_blank'); // opens in new tab
}

export function getHowSimilarKey(titleSimilarity: number, categorySimilarity: number, descriptionSimilarity: number) {
  const totalSimilarity = (titleSimilarity + categorySimilarity + descriptionSimilarity);
  return totalSimilarity > 1.1 ? HowSimilarKeys.MostSimilar : totalSimilarity < 0.3 ? HowSimilarKeys.NotSimilar : HowSimilarKeys.KindaSimilar;
}
