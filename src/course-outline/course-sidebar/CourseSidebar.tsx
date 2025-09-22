import React, { useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';

import Button from 'shared/Components/Common/Button';
import { LayoutLeft, Rocket02 } from '@untitledui/icons';
import classNames from 'classnames';
import { useModel } from '../../generic/model-store';
import { useContentMenuItems, useSettingMenuItems, useToolsMenuItems } from '../../header/hooks';
import MenuItem from './MenuItem.tsx';
import courseOutlineMessages from '../messages';

interface CourseSidebarProps {
  courseId: string;
}

const RocketIcon = () => <Rocket02 className="!tw-size-5" />;

const CourseSidebar: React.FC<CourseSidebarProps> = ({ courseId }) => {
  const intl = useIntl();
  const courseDetails = useModel('courseDetails', courseId);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Get menu items using the same hooks as the header
  const contentMenuItems = useContentMenuItems(courseId);
  const settingMenuItems = useSettingMenuItems(courseId);
  const toolsMenuItems = useToolsMenuItems(courseId);

  // Build the navigation tree similar to header
  const mainMenuDropdowns = [
    {
      id: `${intl.formatMessage({ id: 'header.links.content', defaultMessage: 'Content' })}-dropdown-menu`,
      title: intl.formatMessage({ id: 'header.links.content', defaultMessage: 'Content' }),
      items: contentMenuItems,
    },
    {
      id: `${intl.formatMessage({ id: 'header.links.settings', defaultMessage: 'Settings' })}-dropdown-menu`,
      title: intl.formatMessage({ id: 'header.links.settings', defaultMessage: 'Settings' }),
      items: settingMenuItems,
    },
    {
      id: `${intl.formatMessage({ id: 'header.links.tools', defaultMessage: 'Tools' })}-dropdown-menu`,
      title: intl.formatMessage({ id: 'header.links.tools', defaultMessage: 'Tools' }),
      items: toolsMenuItems,
    },
  ];

  const handlePublishCourse = () => {
    // TODO: Implement publish course functionality
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Extract run from course ID (e.g., "course-v1:MITx+CS102+2025_T1" -> "2025_T1")
  const getCourseRun = (courseIdParam) => {
    if (!courseIdParam) {
      return null;
    }
    const parts = courseIdParam.split('+');
    return parts[parts.length - 1];
  };

  const chips = [courseDetails?.org, courseDetails?.number, getCourseRun(courseDetails?.id)];
  const dueDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(courseDetails?.endDate);

  return (
    <div
      className={classNames(
        'tw-h-full tw-overflow-y-hidden tw-border-0 tw-border-l tw-border-solid tw-flex tw-flex-col tw-border-l-gray-200 tw-transition-all tw-duration-300 tw-ease-in-out',
        isSidebarOpen ? 'tw-w-56' : 'tw-w-8',
      )}
    >
      {/* Header Section */}
      <div
        className={classNames(
          'tw-py-6 tw-flex tw-flex-col tw-gap-3',
          isSidebarOpen ? 'tw-px-4' : 'tw-px-0 !tw-pl-2',
        )}
      >
        <div className="tw-flex tw-flex-row">
          <div className="tw-flex-1 tw-overflow-hidden">
            {courseDetails?.media?.image?.raw && (
              <img
                className={classNames(
                  'tw-w-24 tw-h-16 tw-rounded-[8px] tw-transition-all tw-duration-300 tw-ease-in-out',
                  isSidebarOpen ? 'tw-opacity-100 tw-scale-100' : 'tw-opacity-0 tw-scale-95',
                )}
                src={courseDetails?.media?.image?.raw}
                alt="Course Thumbnail"
              />
            )}
          </div>
          <button
            onClick={handleToggleSidebar}
            className="tw-size-6 tw-flex tw-items-center tw-justify-center tw-cursor-pointer tw-bg-transparent tw-border-none tw-p-0 hover:tw-bg-gray-100 tw-rounded"
            type="button"
            aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <LayoutLeft className="tw-size-4 tw-text-gray-600" />
          </button>
        </div>
        <div
          className={classNames(
            'tw-flex tw-flex-col tw-gap-3 tw-transition-all tw-duration-300 tw-ease-in-out',
            isSidebarOpen
              ? 'tw-opacity-100 tw-max-h-96'
              : 'tw-opacity-0 tw-max-h-0 tw-overflow-hidden',
          )}
        >
          <div className="tw-flex tw-flex-col tw-gap-1">
            <div className="tw-flex tw-flex-row tw-gap-1">
              {chips.slice(0, 2).map((value) => {
                if (value) {
                  return (
                    <div
                      key={value}
                      className="tw-px-1.5 tw-py-0.5 tw-bg-white tw-rounded-[6px] tw-shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] tw-outline tw-outline-1 tw-outline-offset-[-1px] tw-outline-gray-300 tw-inline-flex tw-justify-start tw-items-center tw-w-fit tw-h-[18px]"
                    >
                      <div className="tw-text-center tw-justify-start tw-text-slate-700 tw-text-xs tw-font-medium tw-leading-none">
                        {value}
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
            {chips[2] && (
              <div className="tw-flex tw-flex-row tw-gap-1">
                <div className="tw-px-1.5 tw-py-0.5 tw-bg-white tw-rounded-[6px] tw-shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] tw-outline tw-outline-1 tw-outline-offset-[-1px] tw-outline-gray-300 tw-inline-flex tw-justify-start tw-items-center tw-w-fit tw-h-[18px]">
                  <div className="tw-text-center tw-justify-start tw-text-slate-700 tw-text-xs tw-font-medium tw-leading-none">
                    {chips[2]}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="tw-flex tw-flex-col tw-gap-1">
            <div className="tw-self-stretch tw-justify-start tw-text-gray-900 tw-text-sm tw-font-semibold tw-leading-tight">
              {courseDetails?.name}
            </div>
            {dueDate && (
              <div className="tw-text-gray-500 tw-text-xs">
                {intl.formatMessage(courseOutlineMessages.dueDate, { dueDate })}
              </div>
            )}
          </div>
          <Button
            labels={{ default: intl.formatMessage(courseOutlineMessages.publishCourse) }}
            onClick={handlePublishCourse}
            iconBefore={RocketIcon}
            variant="secondary"
            className="tw-text-sm !tw-h-10"
            size="sm"
          />
        </div>
      </div>

      {/* Menu Items Section */}
      <div
        className={classNames(
          'tw-flex-1 tw-transition-all tw-duration-300 tw-ease-in-out',
          isSidebarOpen
            ? 'tw-opacity-100 tw-max-h-full tw-overflow-y-auto'
            : 'tw-opacity-0 tw-max-h-0 tw-overflow-hidden',
        )}
      >
        <div className="tw-px-4 tw-pb-6 tw-flex tw-flex-col tw-gap-1">
          {mainMenuDropdowns.map((menuItem) => (
            <MenuItem key={menuItem.id} menuItem={menuItem} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseSidebar;
