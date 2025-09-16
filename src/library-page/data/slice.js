/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import { RequestStatus } from '../../data/constants';

const slice = createSlice({
  name: 'libraryPage',
  initialState: {
    loadingStatuses: {
      libraryLoadingStatus: RequestStatus.IN_PROGRESS,
    },
    libraryData: {},
    libraryRequestParams: {
      page: 1,
      search: undefined,
      order: 'display_name',
      archivedOnly: undefined,
      activeOnly: undefined,
      isFiltered: false,
      cleanFilters: false,
    },
  },
  reducers: {
    updateLoadingStatuses: (state, { payload }) => {
      state.loadingStatuses = { ...state.loadingStatuses, ...payload };
    },

    fetchLibraryDataSuccess: (state, { payload }) => {
      const { libraries } = payload;
      state.libraryData = libraries;
    },
    updateLibraryRequestParams: (state, { payload }) => {
      Object.assign(state.libraryRequestParams, payload);
    },
  },
});

export const {
  updateLoadingStatuses,
  fetchLibraryDataSuccess,
  updateLibraryRequestParams,
} = slice.actions;

export const {
  reducer,
} = slice;
