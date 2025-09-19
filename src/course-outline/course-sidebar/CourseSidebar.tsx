import React, { useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';

import { useModel } from '../../generic/model-store';
import { useContentMenuItems, useSettingMenuItems, useToolsMenuItems } from '../../header/hooks';
import MenuItem from './MenuItem';
import { useSelector } from 'react-redux';
import { getStudioHomeData } from '../../studio-home/data/api';
import Button from 'shared/Components/Common/Button';
import courseOutlineMessages from '../messages';
import { LayoutLeft, Rocket02 } from '@untitledui/icons';
import { IconButton, Collapsible } from '@openedx/paragon';
import { convertFromSnakeCaseToTitleCase } from '../../utils';

interface CourseSidebarProps {
  courseId: string;
}

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
  }

  // Extract run from course ID (e.g., "course-v1:MITx+CS102+2025_T1" -> "2025_T1")
  const getCourseRun = (courseId) => {
    if (!courseId) return null;
    const parts = courseId.split('+');
    return parts[parts.length - 1];
  };

  const chips = [courseDetails?.org, courseDetails?.number, getCourseRun(courseDetails?.id)];
  const dueDate = new Intl.DateTimeFormat('en-US', {
    month: 'short', 
    day: '2-digit', 
    year: 'numeric',
  }).format(courseDetails?.endDate);

  console.log(courseDetails);

  return (
    <div className={`tw-h-screen tw-overflow-y-hidden tw-bg-brand-25 tw-border-0 tw-border-l tw-border-solid tw-flex tw-flex-col tw-border-l-gray-200 ${isSidebarOpen ? 'tw-w-56' : 'tw-w-12'}`}>
      <Collapsible
        open={isSidebarOpen}
        onToggle={handleToggleSidebar}
        styling=""
        iconWhenClosed=""
        iconWhenOpen=""
        title={
          <div className="tw-px-4 tw-py-6 tw-flex tw-flex-col tw-gap-3">
            <div className="tw-flex tw-flex-row">
              <div className="tw-flex-1">
                {isSidebarOpen && courseDetails?.media?.image?.raw && (
                  <img
                    className="tw-w-24 tw-h-16"
                    src={courseDetails?.media?.image?.raw}
                    alt="Course Thumbnail"
                  />
                )}
              </div>
              <div className="tw-size-6 tw-flex tw-items-center tw-justify-center tw-cursor-pointer">
                <LayoutLeft className="tw-size-5 tw-text-gray-600" />
              </div>
            </div>
            {isSidebarOpen && (
              <>
                <div className="tw-flex tw-flex-col tw-gap-1">
                  <div className="tw-flex tw-flex-row tw-gap-1">
                    {chips.slice(0, 2).map((value) => {
                      if (value) {
                        return (
                          <div key={value} className="tw-px-1.5 tw-py-0.5 tw-bg-white tw-rounded-[6px] tw-shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] tw-outline tw-outline-1 tw-outline-offset-[-1px] tw-outline-gray-300 tw-inline-flex tw-justify-start tw-items-center tw-w-fit tw-h-[18px]">
                            <div className="tw-text-center tw-justify-start tw-text-slate-700 tw-text-xs tw-font-medium tw-leading-none">
                              {value}
                            </div>
                          </div>
                        );
                      }
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
                <div>
                  <div className="tw-self-stretch tw-justify-start tw-text-gray-900 tw-text-sm tw-font-semibold tw-leading-tight tw-mb-1">
                    {courseDetails?.name}
                  </div>
                  <div className="tw-justify-start tw-text-gray-500 tw-text-xs tw-font-normal tw-leading-none">
                    {intl.formatMessage(courseOutlineMessages.dueDate, { dueDate })}
                  </div>
                </div>
                <Button
                  labels={{ default: intl.formatMessage(courseOutlineMessages.publishCourse) }}
                  onClick={handlePublishCourse}
                  iconBefore={() => <Rocket02 className="!tw-size-5" />}
                  variant="secondary"
                  className="tw-text-sm"
                  size="sm"
                />
              </>
            )}
          </div>
        }
      >
        <Collapsible.Body className="tw-px-4">
          <div>
            {mainMenuDropdowns.map((menuItem) => (
              <MenuItem key={menuItem.id} menuItem={menuItem} />
            ))}
          </div>
        </Collapsible.Body>
      </Collapsible>
    </div>
  );
};

export default CourseSidebar;
