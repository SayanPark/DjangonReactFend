/**
 * Utility to map category slugs to image files in frontend/public/categories
 * This function checks if there's an image file matching the category slug
 * and returns the appropriate path
 */

const categoryImages = {
  'byn-lmll': '/categories/byn-lmll.jpg',
  'md-w-pwshkh': '/categories/md-w-pwshkh.jpg',
  'rslt-jtm-y': '/categories/rslt-jtm-y.jpg',
  'shhr-hwshmnd': '/categories/shhr-hwshmnd.jpg',
  'slmt': '/categories/slmt.jpg',
  'sny-dsty': '/categories/sny-dsty.jpg',
  'sny-gdhyy': '/categories/sny-gdhyy.jpg',
  'sny-khshwrzy': '/categories/sny-khshwrzy.jpg',
};

/**
 * Get the image path for a category based on its slug
 * @param {string} slug - The category slug
 * @returns {string|null} - The image path or null if no match found
 */
export const getCategoryImage = (slug) => {
  if (!slug) return null;
  
  // Check if we have a direct match
  if (categoryImages[slug]) {
    return categoryImages[slug];
  }
  
  // Remove file extension if present and check again
  const cleanSlug = slug.replace(/\.(jpg|jpeg|png|gif)$/i, '');
  if (categoryImages[cleanSlug]) {
    return categoryImages[cleanSlug];
  }
  
  return null;
};

/**
 * Check if a category has a matching image
 * @param {string} slug - The category slug
 * @returns {boolean} - True if image exists, false otherwise
 */
export const hasCategoryImage = (slug) => {
  return getCategoryImage(slug) !== null;
};

export default { getCategoryImage, hasCategoryImage };
