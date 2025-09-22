// @ts-check
import { camelCaseObject, getConfig, snakeCaseObject } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

export const getApiBaseUrl = () => getConfig().STUDIO_BASE_URL;
export const getStudioHomeApiUrl = () => new URL('api/contentstore/v1/home', getApiBaseUrl()).href;
export const getRequestCourseCreatorUrl = () => new URL('request_course_creator', getApiBaseUrl()).href;

/**
 * Get's studio home courses.
 * @param {string} search - Query string parameters for filtering the courses.
 * @param {object} customParams - Additional custom parameters for the API request.
 * @returns {Promise<Object>} - A Promise that resolves to the response data containing the studio home courses.
 * Note: We are changing /api/contentstore/v1 to /api/contentstore/v2 due to upcoming breaking changes.
 * Features such as pagination, filtering, and ordering are better handled in the new version.
 * Please refer to this PR for further details: https://github.com/openedx/edx-platform/pull/34173
 */
export async function getLibraries(search, customParams) {
  const customParamsFormat = snakeCaseObject(customParams);

  // TODO: Change to real api when BE is ready
  const { data } = await getAuthenticatedHttpClient().get(`${getApiBaseUrl()}/api/libraries${search}`, { params: customParamsFormat });
  return camelCaseObject(data);
}
