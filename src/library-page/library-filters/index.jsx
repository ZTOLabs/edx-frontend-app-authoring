import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';

import SearchFieldWrapper from 'shared/Components/Common/SearchFieldWrapper';
import { getLibraryRequestParams } from '../data/selectors';
import { updateLibraryRequestParams } from '../data/slice';
import { fetchLibraryData } from '../data/thunks';
import LibraryTypesFilterMenu from './library-types-filter-menu';
import LibraryOrderFilterMenu from './library-order-filter-menu';
import './index.scss';
import LibraryFileTypesChips from './library-file-types-chips';

/* regex to check if a string has only whitespace
  example "    "
*/
const regexOnlyWhiteSpaces = /^\s+$/;

const LibraryFilters = ({
  dispatch,
  locationValue,
  onSubmitSearchField,
}) => {
  const libraryRequestParams = useSelector(getLibraryRequestParams);
  const {
    order,
    search,
    activeOnly,
    archivedOnly,
    cleanFilters,
    type,
  } = libraryRequestParams;
  const [inputSearchValue, setInputSearchValue] = useState('');

  const getFilterTypeData = (baseFilters) => ({
    archivedCourses: { ...baseFilters, archivedOnly: true, activeOnly: undefined },
    activeCourses: { ...baseFilters, activeOnly: true, archivedOnly: undefined },
    allCourses: { ...baseFilters, archivedOnly: undefined, activeOnly: undefined },
    azCourses: { ...baseFilters, order: 'display_name' },
    zaCourses: { ...baseFilters, order: '-display_name' },
    newestCourses: { ...baseFilters, order: '-created' },
    oldestCourses: { ...baseFilters, order: 'created' },

    allTypes: { ...baseFilters, type: 'all-types' },
    video: { ...baseFilters, type: 'video' },
    document: { ...baseFilters, type: 'document' },
    image: { ...baseFilters, type: 'image' },
    presentation: { ...baseFilters, type: 'presentation' },
    assignment: { ...baseFilters, type: 'assignment' },
  });

  const handleMenuFilterItemSelected = (filterType) => {
    const baseFilters = {
      page: 1,
      search,
      order,
      isFiltered: true,
      archivedOnly,
      activeOnly,
      cleanFilters: false,
      type,
    };

    const filterParams = getFilterTypeData(baseFilters);
    const filterParamsFormat = filterParams[filterType] || baseFilters;
    const {
      coursesOrderLabel,
      coursesTypesLabel,
      isFiltered,
      orderTypeLabel,
      cleanFilters: cleanFilterParams,
      currentPage,
      typeFilter,
      ...customParams
    } = filterParamsFormat;
    dispatch(updateLibraryRequestParams(filterParamsFormat));
    dispatch(fetchLibraryData(locationValue, { page: 1, ...customParams }));
  };

  const handleSearchCourses = (searchValueDebounced) => {
    const valueFormatted = searchValueDebounced.trim();
    const filterParams = {
      search: valueFormatted.length > 0 ? valueFormatted : undefined,
      order,
      archivedOnly,
      activeOnly,
      type: 'all-types',
    };
    const hasOnlySpaces = regexOnlyWhiteSpaces.test(searchValueDebounced);

    if (valueFormatted !== search && !hasOnlySpaces && !cleanFilters) {
      dispatch(updateLibraryRequestParams({
        currentPage: 1,
        isFiltered: true,
        cleanFilters: false,
        ...filterParams,
      }));

      dispatch(fetchLibraryData(locationValue, { page: 1, ...filterParams }));
    }

    setInputSearchValue(searchValueDebounced);
  };

  const handleSearchCoursesDebounced = useCallback(
    debounce((value) => handleSearchCourses(value), 400),
    [activeOnly, archivedOnly, order, inputSearchValue],
  );

  return (
    <div className="tw-flex tw-flex-col tw-items-start tw-justify-between tw-gap-8">
      <div className="d-flex flex-row tw-w-[384px]">
        <SearchFieldWrapper
          onSubmit={onSubmitSearchField}
          onChange={handleSearchCoursesDebounced}
          value={cleanFilters ? '' : inputSearchValue}
          data-testid="input-filter-courses-search"
        />
      </div>

      <div className="tw-flex tw-w-full tw-flex-row tw-items-center tw-gap-3 tw-justify-between">
        <LibraryFileTypesChips onItemMenuSelected={handleMenuFilterItemSelected} />
        <div className="tw-flex tw-flex-row tw-items-center tw-gap-3">
          <LibraryOrderFilterMenu onItemMenuSelected={handleMenuFilterItemSelected} />
          <LibraryTypesFilterMenu onItemMenuSelected={handleMenuFilterItemSelected} />
        </div>
      </div>
    </div>
  );
};

LibraryFilters.defaultProps = {
  locationValue: '',
  onSubmitSearchField: () => {},
};

LibraryFilters.propTypes = {
  dispatch: PropTypes.func.isRequired,
  locationValue: PropTypes.string,
  onSubmitSearchField: PropTypes.func,
};

export default LibraryFilters;
