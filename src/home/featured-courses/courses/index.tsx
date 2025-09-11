import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Icon, Row,
} from '@openedx/paragon';
import { Error } from '@openedx/paragon/icons';
import React from 'react';
import { useSelector } from 'react-redux';

import { Plus } from '@untitledui/icons';

import StatefulButtonWrapper from 'shared/Components/Common/StatefulButtonWrapper';
import { useNavigate } from 'react-router';
import { COURSE_CREATOR_STATES } from '../../../constants';
import { LoadingSpinner } from '../../../generic/Loading';
import AlertMessage from '../../../generic/alert-message';
import { getStudioHomeCoursesParams, getStudioHomeData } from '../../data/selectors';
import ContactAdministrator from './contact-administrator';
import './index.scss';
import messages from '../messages';
import CardItem from './card-item';

interface Props {
  hasAbilityToCreateNewCourse: boolean;
  coursesDataItems: {
    courseKey: string;
    displayName: string;
    lmsLink: string | null;
    number: string;
    org: string;
    rerunLink: string | null;
    run: string;
    url: string;
  }[];
  showNewCourseContainer: boolean;
  onClickNewCourse: () => void;
  isShowProcessing: boolean;
  isLoading: boolean;
  isFailed: boolean;
  isEnabledPagination?: boolean;
}

const Courses: React.FC<Props> = ({
  hasAbilityToCreateNewCourse,
  coursesDataItems,
  showNewCourseContainer,
  onClickNewCourse,
  isShowProcessing,
  isLoading,
  isFailed,
  isEnabledPagination = false,
}) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const { courseCreatorStatus, optimizationEnabled } = useSelector(getStudioHomeData);
  const studioHomeCoursesParams = useSelector(getStudioHomeCoursesParams);
  const { isFiltered } = studioHomeCoursesParams;
  const hasAbilityToCreateCourse = courseCreatorStatus === COURSE_CREATOR_STATES.granted;

  const isNotFilteringCourses = !isFiltered && !isLoading;
  const hasCourses = coursesDataItems?.length > 0;

  if (isLoading && !isFiltered) {
    return (
      <Row className="m-0 mt-4 justify-content-center">
        <LoadingSpinner />
      </Row>
    );
  }

  return isFailed && !isFiltered ? (
    <AlertMessage
      variant="danger"
      description={(
        <Row className="m-0 align-items-center">
          <Icon src={Error} className="text-danger-500 mr-1" />
          <span data-testid="error-failed-message">
            {intl.formatMessage(messages.courseTabErrorMessage)}
          </span>
        </Row>
      )}
    />
  ) : (
    <div className="tw-flex tw-flex-col tw-gap-6">
      <div className="tw-flex tw-justify-between tw-items-center">
        <h3 className="tw-font-semibold tw-text-lg tw-text-gray-900">
          {intl.formatMessage(messages.coursesTabTitle)}
        </h3>
        <div className="tw-flex tw-gap-2">
          {hasAbilityToCreateNewCourse && (
          <StatefulButtonWrapper
            className="!tw-w-auto"
            variant="link"
            size="sm"
            disabled={showNewCourseContainer}
            onClick={() => navigate('/courses')}
            labels={{ default: intl.formatMessage(messages.allCoursesBtnText) }}
          />
          )}
          <StatefulButtonWrapper
            className="!tw-w-auto tw-border-gray-300 tw-text-gray-700"
            variant="secondary"
            iconBefore={Plus}
            size="sm"
            disabled={showNewCourseContainer}
            onClick={onClickNewCourse}
            labels={{ default: intl.formatMessage(messages.addNewCourseBtnText) }}
          />
        </div>
      </div>
      <div className="tw-grid tw-grid-cols-1 tw-gap-4 sm:tw-grid-cols-2 md:tw-grid-cols-2 lg:tw-grid-cols-3">
        {hasCourses ? (
          <>
            {coursesDataItems.map(
              ({
                courseKey, displayName, lmsLink, org, rerunLink, number, run, url,
              }) => (
                <CardItem
                  key={courseKey}
                  courseKey={courseKey}
                  displayName={displayName}
                  lmsLink={lmsLink}
                  rerunLink={rerunLink}
                  org={org}
                  number={number}
                  run={run}
                  url={url}
                  isPaginated={isEnabledPagination}
                />
              ),
            )}
          </>
        ) : (
          !optimizationEnabled
          && isNotFilteringCourses && (
            <ContactAdministrator
              hasAbilityToCreateCourse={hasAbilityToCreateCourse}
              showNewCourseContainer={showNewCourseContainer}
              onClickNewCourse={onClickNewCourse}
            />
          )
        )}
      </div>
    </div>
  );
};

export default Courses;
