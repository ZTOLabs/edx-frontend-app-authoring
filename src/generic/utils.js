import { isEmpty } from 'lodash';

/**
 * Generate the string for the page <title>
 * @param {string} courseOrSectionName The name of the course, or the section of the MFE that the user is in currently
 * @param {string} pageName The name of the current page
 * @returns {string} The combined title
 */
const getPageHeadTitle = (courseOrSectionName, pageName) => {
  // For now, we just need to display the site name. This might change in the future 
  return process.env.SITE_NAME;
};

export default getPageHeadTitle;
