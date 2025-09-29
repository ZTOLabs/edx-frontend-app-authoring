/**
 * Removes leading and trailing slashes from a string.
 * @param {string} str - The string to trim.
 * @returns {string} The trimmed string.
 */
export const trimSlashes = (str: string): string => str.replace(/^\/|\/$/g, '');

export const getLibraryTypeTranslation = (type: string, locale: string) => {
  const TYPE_MAP = {
    text: {
      en: 'Text',
      vi: 'Văn bản',
    },
    image: {
      en: 'Image',
      vi: 'Hình ảnh',
    },
    video: {
      en: 'Video',
      vi: 'Video',
    },
    presentation: {
      en: 'Presentation',
      vi: 'Bài thuyết trình',
    },
  };
  return TYPE_MAP[type?.toLowerCase()]?.[locale] || TYPE_MAP[type?.toLowerCase()]?.en || type;
};
