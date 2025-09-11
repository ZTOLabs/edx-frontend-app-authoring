import { useSelector } from 'react-redux';
import { useIntl } from '@edx/frontend-platform/i18n';
import { useNavigate } from 'react-router';
import StatefulButtonWrapper from 'shared/Components/Common/StatefulButtonWrapper';
import { Plus } from '@untitledui/icons';
import FeaturedLayout from 'home/layout/featured';
import { RequestStatus } from '../../data/constants';
import { getLoadingStatuses, getStudioHomeData } from '../data/selectors';
import Courses from './courses';
import messages from './messages';

const FeaturedCourses = ({
  hasAbilityToCreateNewCourse,
  onClickNewCourse,
  isPaginationCoursesEnabled,
}: {
  hasAbilityToCreateNewCourse: boolean;
  onClickNewCourse: () => void;
  isPaginationCoursesEnabled: boolean;
}) => {
  const intl = useIntl();
  const navigate = useNavigate();

  const { courses } = useSelector(getStudioHomeData);

  const { courseLoadingStatus } = useSelector(getLoadingStatuses);

  const isLoadingCourses = courseLoadingStatus === RequestStatus.IN_PROGRESS;
  const isFailedCoursesPage = courseLoadingStatus === RequestStatus.FAILED;

  const actions = (
    <>
      {hasAbilityToCreateNewCourse && (
      <StatefulButtonWrapper
        className="!tw-w-auto"
        variant="link"
        size="sm"
        disabled={false}
        onClick={() => navigate('/courses')}
        labels={{ default: intl.formatMessage(messages.allCoursesBtnText) }}
      />
      )}
      <StatefulButtonWrapper
        className="!tw-w-auto tw-border-gray-300 tw-text-gray-700"
        variant="secondary"
        iconBefore={Plus}
        size="sm"
        disabled={false}
        onClick={onClickNewCourse}
        labels={{ default: intl.formatMessage(messages.addNewCourseBtnText) }}
      />
    </>
  );

  return (
    <FeaturedLayout title={intl.formatMessage(messages.coursesTabTitle)} actions={actions}>
      <Courses
        coursesDataItems={courses}
        showNewCourseContainer={false}
        onClickNewCourse={onClickNewCourse}
        isLoading={isLoadingCourses}
        isFailed={isFailedCoursesPage}
        isEnabledPagination={isPaginationCoursesEnabled}
      />
    </FeaturedLayout>

  );
};

export default FeaturedCourses;
