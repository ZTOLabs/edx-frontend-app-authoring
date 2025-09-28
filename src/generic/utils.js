import { SITE_NAME } from '../constants';
import { isEmpty } from 'lodash';

/**
 * Generate the string for the page <title>
 * @param {string} courseOrSectionName The name of the course, or the section of the MFE that the user is in currently
 * @param {string} pageName The name of the current page
 * @returns {string} The combined title
 */
const getPageHeadTitle = (courseOrSectionName, pageName) => {
  // Use hard-coded site name instead of getting from config
  return SITE_NAME;
};

export default getPageHeadTitle;
