import { RequestStatus } from '../../data/constants';
import {
  getStudioHomeLibraries,
} from './api';
import {
  updateLoadingStatuses,
  fetchLibraryDataSuccess,
} from './slice';

function fetchLibraryData(
  search,
  requestParams = {},
) {
  return async (dispatch) => {
    dispatch(updateLoadingStatuses({ libraryLoadingStatus: RequestStatus.IN_PROGRESS }));
    try {
      const libraryData = await getStudioHomeLibraries(search, requestParams);
      dispatch(fetchLibraryDataSuccess(libraryData));
      dispatch(updateLoadingStatuses({ libraryLoadingStatus: RequestStatus.SUCCESSFUL }));
    } catch (error) {
      dispatch(updateLoadingStatuses({ libraryLoadingStatus: RequestStatus.FAILED }));
    }
  };
}

export {
  fetchLibraryData,
};
