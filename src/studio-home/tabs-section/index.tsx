import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { useLocation } from 'react-router-dom';

import { getLoadingStatuses, getStudioHomeData } from '../data/selectors';
import CoursesTab from './courses-tab';
import { RequestStatus } from '../../data/constants';
import { fetchLibraryData } from '../data/thunks';

const TabsSection = ({
  showNewCourseContainer,
  onClickNewCourse,
  isShowProcessing,
  isPaginationCoursesEnabled,
  librariesV2Enabled,
}) => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const TABS_LIST = {
    courses: 'courses',
    libraries: 'libraries',
    legacyLibraries: 'legacyLibraries',
    archived: 'archived',
    taxonomies: 'taxonomies',
  } as const;

  const initTabKeyState = (pname) => {
    if (pname.includes('/libraries-v1')) {
      return TABS_LIST.legacyLibraries;
    }

    if (pname.includes('/libraries')) {
      return librariesV2Enabled
        ? TABS_LIST.libraries
        : TABS_LIST.legacyLibraries;
    }

    // Default to courses tab
    return TABS_LIST.courses;
  };

  const {
    courses,
    numPages, coursesCount,
  } = useSelector(getStudioHomeData);
  const {
    courseLoadingStatus,
  } = useSelector(getLoadingStatuses);
  const isLoadingCourses = courseLoadingStatus === RequestStatus.IN_PROGRESS;
  const isFailedCoursesPage = courseLoadingStatus === RequestStatus.FAILED;

  return (
    <CoursesTab
      coursesDataItems={courses}
      showNewCourseContainer={showNewCourseContainer}
      onClickNewCourse={onClickNewCourse}
      isShowProcessing={isShowProcessing}
      isLoading={isLoadingCourses}
      isFailed={isFailedCoursesPage}
      numPages={numPages}
      coursesCount={coursesCount}
      isEnabledPagination={isPaginationCoursesEnabled}
    />
  );
};

TabsSection.defaultProps = {
  isPaginationCoursesEnabled: false,
};

TabsSection.propTypes = {
  showNewCourseContainer: PropTypes.bool.isRequired,
  onClickNewCourse: PropTypes.func.isRequired,
  isShowProcessing: PropTypes.bool.isRequired,
  isPaginationCoursesEnabled: PropTypes.bool,
  librariesV1Enabled: PropTypes.bool,
  librariesV2Enabled: PropTypes.bool,
};

export default TabsSection;
