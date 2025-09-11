import React from 'react';
import { useSelector } from 'react-redux';
import { RequestStatus } from '../../data/constants';
import { getLoadingStatuses, getStudioHomeData } from '../data/selectors';
import Courses from './courses';

const FeaturedCourses = ({
  hasAbilityToCreateNewCourse,
  onClickNewCourse,
  isShowProcessing,
  isPaginationCoursesEnabled,
}: {
  hasAbilityToCreateNewCourse: boolean;
  onClickNewCourse: () => void;
  isShowProcessing: boolean;
  isPaginationCoursesEnabled: boolean;
}) => {
  const { courses } = useSelector(getStudioHomeData);

  const { courseLoadingStatus } = useSelector(getLoadingStatuses);

  const isLoadingCourses = courseLoadingStatus === RequestStatus.IN_PROGRESS;
  const isFailedCoursesPage = courseLoadingStatus === RequestStatus.FAILED;

  return (
    <Courses
      hasAbilityToCreateNewCourse={hasAbilityToCreateNewCourse}
      coursesDataItems={courses}
      showNewCourseContainer={false}
      onClickNewCourse={onClickNewCourse}
      isShowProcessing={isShowProcessing}
      isLoading={isLoadingCourses}
      isFailed={isFailedCoursesPage}
      isEnabledPagination={isPaginationCoursesEnabled}
    />
  );
};

export default FeaturedCourses;
