// @ts-check
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useToggle } from '@openedx/paragon';
import { isEmpty } from 'lodash';
import { useNavigate, useSearchParams } from 'react-router-dom';

import CourseOutlineUnitCardExtraActionsSlot from '../../plugin-slots/CourseOutlineUnitCardExtraActionsSlot';
import { setCurrentItem, setCurrentSection, setCurrentSubsection } from '../data/slice';
import { fetchCourseSectionQuery } from '../data/thunk';
import { RequestStatus } from '../../data/constants';
import { isUnitReadOnly } from '../../course-unit/data/utils';
import CardHeader from '../card-header/CardHeader';
import SortableItem from '../drag-helper/SortableItem';
import TitleLink from '../card-header/TitleLink';
import XBlockStatus from '../xblock-status/XBlockStatus';
import {
  getItemStatus,
  getItemStatusBadgeContent,
  getItemStatusBorder,
  scrollToElement,
} from '../utils';
import { useClipboard } from '../../generic/clipboard';
import { PreviewLibraryXBlockChanges } from '../../course-unit/preview-changes';
import { useIntl } from '@edx/frontend-platform/i18n';
import messages from '../card-header/messages';
import CardHeaderWithDropdownOnly from '../card-header/CardHeaderWithDropdownOnly';
import classNames from 'classnames';

const UnitCard = ({
  unit,
  subsection,
  section,
  isSelfPaced,
  isCustomRelativeDatesActive,
  index,
  getPossibleMoves,
  onOpenPublishModal,
  onOpenConfigureModal,
  onEditSubmit,
  savingStatus,
  onOpenDeleteModal,
  onDuplicateSubmit,
  getTitleLink,
  onOrderChange,
  discussionsSettings,
}) => {
  const currentRef = useRef(null);
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const locatorId = searchParams.get('show');
  const isScrolledToElement = locatorId === unit.id;
  const [isFormOpen, openForm, closeForm] = useToggle(false);
  const [isSyncModalOpen, openSyncModal, closeSyncModal] = useToggle(false);
  const namePrefix = 'unit';

  const { copyToClipboard } = useClipboard();
  const navigate = useNavigate();
  const {
    id,
    category,
    displayName,
    hasChanges,
    published,
    visibilityState,
    actions: unitActions,
    isHeaderVisible = true,
    enableCopyPasteUnits = false,
    discussionEnabled,
    upstreamInfo,
  } = unit;

  const blockSyncData = useMemo(() => {
    if (!upstreamInfo.readyToSync) {
      return undefined;
    }
    return {
      displayName,
      downstreamBlockId: id,
      upstreamBlockId: upstreamInfo.upstreamRef,
      upstreamBlockVersionSynced: upstreamInfo.versionSynced,
      isVertical: true,
    };
  }, [upstreamInfo]);

  const readOnly = isUnitReadOnly(unit);

  // re-create actions object for customizations
  const actions = { ...unitActions };
  // add actions to control display of move up & down menu buton.
  const moveUpDetails = getPossibleMoves(index, -1);
  const moveDownDetails = getPossibleMoves(index, 1);
  actions.allowMoveUp = !isEmpty(moveUpDetails);
  actions.allowMoveDown = !isEmpty(moveDownDetails);

  const parentInfo = {
    graded: subsection.graded,
    isTimeLimited: subsection.isTimeLimited,
  };

  const unitStatus = getItemStatus({
    published,
    visibilityState,
    hasChanges,
  });
  const borderStyle = getItemStatusBorder(unitStatus);

  const handleClickMenuButton = () => {
    dispatch(setCurrentItem(unit));
    dispatch(setCurrentSection(section));
    dispatch(setCurrentSubsection(subsection));
  };

  const handleEditSubmit = (titleValue) => {
    if (displayName !== titleValue) {
      onEditSubmit(id, section.id, titleValue);
      return;
    }

    closeForm();
  };

  const handleUnitMoveUp = () => {
    onOrderChange(section, moveUpDetails);
  };

  const handleUnitMoveDown = () => {
    onOrderChange(section, moveDownDetails);
  };

  const handleCopyClick = () => {
    copyToClipboard(id);
  };

  const handleOnPostChangeSync = useCallback(async () => {
    await dispatch(fetchCourseSectionQuery([section.id]));
  }, [dispatch, section]);

  const titleComponent = (
    <TitleLink title={displayName} titleLink={getTitleLink(id)} namePrefix={namePrefix} />
  );

  const extraActionsComponent = (
    <CourseOutlineUnitCardExtraActionsSlot unit={unit} subsection={subsection} section={section} />
  );

  useEffect(() => {
    // if this items has been newly added, scroll to it.
    // we need to check section.shouldScroll as whole section is fetched when a
    // unit is duplicated under it.
    if (currentRef.current && (section.shouldScroll || unit.shouldScroll || isScrolledToElement)) {
      // Align element closer to the top of the screen if scrolling for search result
      const alignWithTop = !!isScrolledToElement;
      scrollToElement(currentRef.current, alignWithTop);
    }
  }, [isScrolledToElement]);

  useEffect(() => {
    if (savingStatus === RequestStatus.SUCCESSFUL) {
      closeForm();
    }
  }, [savingStatus]);

  const intl = useIntl();
  const { badgeTitle } = getItemStatusBadgeContent(unitStatus, messages, intl);

  if (!isHeaderVisible) {
    return null;
  }

  const isDraggable = actions.draggable && (actions.allowMoveUp || actions.allowMoveDown);

  return (
    <>
      <SortableItem
        id={id}
        category={category}
        key={id}
        isDraggable
        isDroppable={actions.childAddable}
        componentStyle={{
          marginBottom: '24px',
        }}
      >
        <div className="tw-flex tw-gap-2 tw-items-center" ref={currentRef}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.33317 1.51318V4.26688C9.33317 4.64025 9.33317 4.82693 9.40583 4.96954C9.46975 5.09498 9.57173 5.19697 9.69718 5.26088C9.83978 5.33354 10.0265 5.33354 10.3998 5.33354H13.1535M9.33317 11.3335H5.33317M10.6665 8.66683H5.33317M13.3332 6.65898V11.4668C13.3332 12.5869 13.3332 13.147 13.1152 13.5748C12.9234 13.9511 12.6175 14.2571 12.2412 14.4488C11.8133 14.6668 11.2533 14.6668 10.1332 14.6668H5.8665C4.7464 14.6668 4.18635 14.6668 3.75852 14.4488C3.3822 14.2571 3.07624 13.9511 2.88449 13.5748C2.6665 13.147 2.6665 12.5869 2.6665 11.4668V4.5335C2.6665 3.41339 2.6665 2.85334 2.88449 2.42552C3.07624 2.04919 3.3822 1.74323 3.75852 1.55148C4.18635 1.3335 4.7464 1.3335 5.8665 1.3335H8.00769C8.49687 1.3335 8.74146 1.3335 8.97163 1.38876C9.17571 1.43775 9.3708 1.51856 9.54974 1.62822C9.75157 1.7519 9.92453 1.92485 10.2704 2.27075L12.3959 4.39624C12.7418 4.74214 12.9148 4.91509 13.0385 5.11693C13.1481 5.29587 13.2289 5.49096 13.2779 5.69503C13.3332 5.92521 13.3332 6.1698 13.3332 6.65898Z"
              stroke="#875BF7"
              strokeWidth="1.33"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div
            className="tw-text-slate-700 tw-text-sm tw-font-semibold tw-leading-tight tw-flex-1 tw-cursor-pointer"
            onClick={() => navigate(getTitleLink(id))}
          >
            {displayName}
          </div>
          <div className="tw-flex tw-gap-2 tw-items-center">
            <div
              className={classNames(
                'tw-py-[2px] tw-pl-[6px] tw-pr-[8px] tw-rounded-2xl tw-border tw-flex tw-items-center tw-gap-1 tw-border-solid',
                {
                  'tw-bg-green-50 tw-border-green-200': unitStatus === 'live',
                  'tw-bg-[#FFFAEB] tw-border-[#FEDF89]': unitStatus === 'draft',
                  'tw-bg-gray-50 tw-border-gray-200':
                    unitStatus !== 'live' && unitStatus !== 'draft',
                },
              )}
            >
              <div
                className={classNames('tw-w-[6px] tw-h-[6px] tw-rounded-full', {
                  'tw-bg-green-500': unitStatus === 'live',
                  'tw-bg-[#F79009]': unitStatus === 'draft',
                  'tw-bg-gray-400': unitStatus !== 'live' && unitStatus !== 'draft',
                })}
              />
              <span
                className={classNames('tw-text-xs tw-font-medium', {
                  'tw-text-green-700': unitStatus === 'live',
                  'tw-text-[#B54708]': unitStatus === 'draft',
                  'tw-text-gray-600': unitStatus !== 'live' && unitStatus !== 'draft',
                })}
              >
                {badgeTitle}
              </span>
            </div>
            <CardHeaderWithDropdownOnly
              title={displayName}
              status={unitStatus}
              hasChanges={hasChanges}
              cardId={id}
              onClickMenuButton={handleClickMenuButton}
              onClickPublish={onOpenPublishModal}
              onClickConfigure={onOpenConfigureModal}
              onClickEdit={openForm}
              onClickDelete={onOpenDeleteModal}
              onClickMoveUp={handleUnitMoveUp}
              onClickMoveDown={handleUnitMoveDown}
              onClickSync={openSyncModal}
              isFormOpen={isFormOpen}
              closeForm={closeForm}
              onEditSubmit={handleEditSubmit}
              isDisabledEditField={readOnly || savingStatus === RequestStatus.IN_PROGRESS}
              onClickDuplicate={onDuplicateSubmit}
              titleComponent={titleComponent}
              namePrefix={namePrefix}
              actions={actions}
              isVertical
              enableCopyPasteUnits={enableCopyPasteUnits}
              onClickCopy={handleCopyClick}
              discussionEnabled={discussionEnabled}
              discussionsSettings={discussionsSettings}
              parentInfo={parentInfo}
              extraActionsComponent={extraActionsComponent}
              readyToSync={upstreamInfo.readyToSync}
            />
          </div>
        </div>
      </SortableItem>
      {blockSyncData && (
        <PreviewLibraryXBlockChanges
          blockData={blockSyncData}
          isModalOpen={isSyncModalOpen}
          closeModal={closeSyncModal}
          postChange={handleOnPostChangeSync}
        />
      )}
    </>
  );
};

UnitCard.defaultProps = {
  discussionsSettings: {},
};

UnitCard.propTypes = {
  unit: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    published: PropTypes.bool.isRequired,
    hasChanges: PropTypes.bool.isRequired,
    visibilityState: PropTypes.string.isRequired,
    shouldScroll: PropTypes.bool,
    actions: PropTypes.shape({
      deletable: PropTypes.bool.isRequired,
      draggable: PropTypes.bool.isRequired,
      childAddable: PropTypes.bool.isRequired,
      duplicable: PropTypes.bool.isRequired,
    }).isRequired,
    isHeaderVisible: PropTypes.bool,
    enableCopyPasteUnits: PropTypes.bool,
    discussionEnabled: PropTypes.bool,
    upstreamInfo: PropTypes.shape({
      readyToSync: PropTypes.bool.isRequired,
      upstreamRef: PropTypes.string.isRequired,
      versionSynced: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  subsection: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    published: PropTypes.bool.isRequired,
    hasChanges: PropTypes.bool.isRequired,
    visibilityState: PropTypes.string.isRequired,
    shouldScroll: PropTypes.bool,
    isTimeLimited: PropTypes.bool,
    graded: PropTypes.bool,
  }).isRequired,
  section: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    published: PropTypes.bool.isRequired,
    hasChanges: PropTypes.bool.isRequired,
    visibilityState: PropTypes.string.isRequired,
    shouldScroll: PropTypes.bool,
  }).isRequired,
  onOpenPublishModal: PropTypes.func.isRequired,
  onOpenConfigureModal: PropTypes.func.isRequired,
  onEditSubmit: PropTypes.func.isRequired,
  savingStatus: PropTypes.string.isRequired,
  onOpenDeleteModal: PropTypes.func.isRequired,
  onDuplicateSubmit: PropTypes.func.isRequired,
  getTitleLink: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  getPossibleMoves: PropTypes.func.isRequired,
  onOrderChange: PropTypes.func.isRequired,
  isSelfPaced: PropTypes.bool.isRequired,
  isCustomRelativeDatesActive: PropTypes.bool.isRequired,
  discussionsSettings: PropTypes.shape({
    providerType: PropTypes.string,
    enableGradedUnits: PropTypes.bool,
  }),
};

export default UnitCard;
