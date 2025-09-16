import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';

import messages from './messages';

import LibraryFilterMenu from '../library-filter-menu';

const LibraryOrderFilterMenu = ({ onItemMenuSelected }) => {
  const intl = useIntl();

  const courseOrders = useMemo(
    () => [
      {
        id: 'az-courses',
        name: intl.formatMessage(messages.coursesOrderFilterMenuAscendantCurses),
        value: 'azCourses',
      },
      {
        id: 'za-courses',
        name: intl.formatMessage(messages.coursesOrderFilterMenuDescendantCurses),
        value: 'zaCourses',
      },
      {
        id: 'newest-courses',
        name: intl.formatMessage(messages.coursesOrderFilterMenuNewestCurses),
        value: 'newestCourses',
      },
      {
        id: 'oldest-courses',
        name: intl.formatMessage(messages.coursesOrderFilterMenuOldestCurses),
        value: 'oldestCourses',
      },
    ],
    [intl],
  );

  const handleCourseTypeSelected = (courseOrder) => {
    onItemMenuSelected(courseOrder);
  };

  return (
    <LibraryFilterMenu
      id="dropdown-toggle-courses-order-menu"
      menuItems={courseOrders}
      onItemMenuSelected={handleCourseTypeSelected}
      defaultItemSelectedText={intl.formatMessage(messages.coursesOrderFilterMenuAscendantCurses)}
    />
  );
};

LibraryOrderFilterMenu.propTypes = {
  onItemMenuSelected: PropTypes.func.isRequired,
};

export default LibraryOrderFilterMenu;
