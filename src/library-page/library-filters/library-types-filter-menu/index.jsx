import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';

import messages from './messages';

import LibraryFilterMenu from '../library-filter-menu';

const LibraryTypesFilterMenu = ({ onItemMenuSelected }) => {
  const intl = useIntl();

  const courseTypes = useMemo(
    () => [
      {
        id: 'all-courses',
        name: intl.formatMessage(messages.coursesTypesFilterMenuAllCurses),
        value: 'allCourses',
      },
      {
        id: 'active-courses',
        name: intl.formatMessage(messages.coursesTypesFilterMenuActiveCurses),
        value: 'activeCourses',
      },
      {
        id: 'archived-courses',
        name: intl.formatMessage(messages.coursesTypesFilterMenuArchivedCurses),
        value: 'archivedCourses',
      },
    ],
    [intl],
  );

  const handleCourseTypeSelected = (courseType) => {
    onItemMenuSelected(courseType);
  };

  return (
    <LibraryFilterMenu
      id="dropdown-toggle-course-type-menu"
      menuItems={courseTypes}
      onItemMenuSelected={handleCourseTypeSelected}
      defaultItemSelectedText={intl.formatMessage(messages.coursesTypesFilterMenuAllCurses)}
    />
  );
};

LibraryTypesFilterMenu.propTypes = {
  onItemMenuSelected: PropTypes.func.isRequired,
};

export default LibraryTypesFilterMenu;
