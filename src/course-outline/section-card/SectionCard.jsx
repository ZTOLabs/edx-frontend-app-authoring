// @ts-check
import React, {
  useContext, useEffect, useState, useRef,
} from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Bubble, Button as OpenEdxButton, useToggle } from '@openedx/paragon';
import { Add as IconAdd } from '@openedx/paragon/icons';
import { useSearchParams } from 'react-router-dom';
import classNames from 'classnames';

import { setCurrentItem, setCurrentSection } from '../data/slice';
import { RequestStatus } from '../../data/constants';
import CardHeader from '../card-header/CardHeader';
import SortableItem from '../drag-helper/SortableItem';
import { DragContext } from '../drag-helper/DragContextProvider';
import TitleButton from '../card-header/TitleButton';
import XBlockStatus from '../xblock-status/XBlockStatus';
import { getItemStatus, getItemStatusBorder, scrollToElement } from '../utils';
import xblockStatusMessages from '../xblock-status/messages';
import { Plus } from 'lucide-react';
import courseUnitMessages from '../../course-unit/course-sequence/messages';
import CardHeaderWithDropdownOnly from '../card-header/CardHeaderWithDropdownOnly';
import Button from 'shared/Components/Common/Button';

const ChevronDown = ({ className, onClick }) => (
  <svg
    width="10"
    height="6"
    viewBox="0 0 10 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    onClick={onClick}
  >
    <path d="M1.00014 1.00016L5.00014 5.00016L9.00014 1.00016" fill="#475467" />
    <path
      d="M9.00014 0.333496C9.26975 0.333496 9.51282 0.495887 9.61603 0.744954C9.71922 0.994071 9.66216 1.28085 9.4715 1.47152L5.4715 5.47152C5.21115 5.73187 4.78914 5.73187 4.52879 5.47152L0.52879 1.47152C0.338124 1.28085 0.281071 0.994071 0.384258 0.744954C0.487466 0.495887 0.730533 0.333496 1.00014 0.333496H9.00014ZM5.00014 4.05745L7.39077 1.66683H2.60952L5.00014 4.05745Z"
      fill="#475467"
    />
  </svg>
);

const SectionCard = ({
  section,
  isSelfPaced,
  isCustomRelativeDatesActive,
  children,
  index,
  canMoveItem,
  onOpenHighlightsModal,
  onOpenPublishModal,
  onOpenConfigureModal,
  onEditSectionSubmit,
  savingStatus,
  onOpenDeleteModal,
  onDuplicateSubmit,
  isSectionsExpanded,
  onNewSubsectionSubmit,
  onNewUnitSubmit,
  onOrderChange,
}) => {
  const currentRef = useRef(null);
  const intl = useIntl();
  const dispatch = useDispatch();
  const { activeId, overId } = useContext(DragContext);
  const [searchParams] = useSearchParams();
  const locatorId = searchParams.get('show');
  const isScrolledToElement = locatorId === section.id;

  // Expand the section if a search result should be shown/scrolled to
  const containsSearchResult = () => {
    if (locatorId) {
      const subsections = section.childInfo?.children;
      if (subsections) {
        for (let i = 0; i < subsections.length; i++) {
          const subsection = subsections[i];

          // Check if the search result is one of the subsections
          const matchedSubsection = subsection.id === locatorId;
          if (matchedSubsection) {
            return true;
          }

          // Check if the search result is one of the units
          const matchedUnit = !!subsection.childInfo?.children?.filter((child) => child.id === locatorId).length;
          if (matchedUnit) {
            return true;
          }
        }
      }
    }

    return false;
  };
  const [isExpanded, setIsExpanded] = useState(containsSearchResult() || isSectionsExpanded);
  const [isFormOpen, openForm, closeForm] = useToggle(false);
  const namePrefix = 'section';

  useEffect(() => {
    setIsExpanded(isSectionsExpanded);
  }, [isSectionsExpanded]);

  const {
    id,
    category,
    displayName,
    hasChanges,
    published,
    visibilityState,
    highlights,
    actions: sectionActions,
    isHeaderVisible = true,
  } = section;

  useEffect(() => {
    if (activeId === id && isExpanded) {
      setIsExpanded(false);
    } else if (overId === id && !isExpanded) {
      setIsExpanded(true);
    }
  }, [activeId, overId]);

  useEffect(() => {
    if (currentRef.current && (section.shouldScroll || isScrolledToElement)) {
      // Align element closer to the top of the screen if scrolling for search result
      const alignWithTop = !!isScrolledToElement;
      scrollToElement(currentRef.current, alignWithTop);
    }
  }, [isScrolledToElement]);

  useEffect(() => {
    // If the locatorId is set/changed, we need to make sure that the section is expanded
    // if it contains the result, in order to scroll to it
    setIsExpanded((prevState) => containsSearchResult() || prevState);
  }, [locatorId, setIsExpanded]);

  // re-create actions object for customizations
  const actions = { ...sectionActions };
  // add actions to control display of move up & down menu buton.
  actions.allowMoveUp = canMoveItem(index, -1);
  actions.allowMoveDown = canMoveItem(index, 1);

  const sectionStatus = getItemStatus({
    published,
    visibilityState,
    hasChanges,
  });

  // remove border when section is expanded
  const borderStyle = getItemStatusBorder(!isExpanded ? sectionStatus : '');

  const handleExpandContent = () => {
    const firstSection = section.childInfo?.children?.[0];
    if (firstSection && firstSection.childInfo?.children?.length > 0) {
      setIsExpanded((prevState) => !prevState);
    }
  };

  const handleClickMenuButton = () => {
    dispatch(setCurrentItem(section));
    dispatch(setCurrentSection(section));
  };

  const handleEditSubmit = (titleValue) => {
    if (displayName !== titleValue) {
      // both itemId and sectionId are same
      onEditSectionSubmit(id, id, titleValue);
      return;
    }

    closeForm();
  };

  const handleOpenHighlightsModal = () => {
    onOpenHighlightsModal(section);
  };

  const handleNewSubsectionSubmit = () => {
    onNewSubsectionSubmit(id);
  };

  const handleNewUnitSubmit = () => {
    // Find the topmost subsection (first subsection in the section)
    const subsections = section.childInfo?.children;
    if (subsections && subsections.length > 0) {
      const topmostSubsection = subsections[0];
      onNewUnitSubmit(topmostSubsection.id);
    }
  };

  const handleSectionMoveUp = () => {
    onOrderChange(index, index - 1);
  };

  const handleSectionMoveDown = () => {
    onOrderChange(index, index + 1);
  };

  useEffect(() => {
    if (savingStatus === RequestStatus.SUCCESSFUL) {
      closeForm();
    }
  }, [savingStatus]);

  const titleComponent = (
    <TitleButton
      title={displayName}
      isExpanded={isExpanded}
      onTitleClick={handleExpandContent}
      namePrefix={namePrefix}
    />
  );

  const isDraggable = actions.draggable && (actions.allowMoveUp || actions.allowMoveDown);
  const releaseDate = section.releaseDate ? section.releaseDate.replace('UTC', '') : '';

  return (
    <SortableItem
      id={id}
      category={category}
      isDraggable={isDraggable}
      isDroppable={actions.childAddable}
      componentStyle={{
        padding: '16px',
        borderRadius: '16px',
        border: '1px solid #FFF',
        background: 'rgba(255, 255, 255, 0.70)',
        marginBottom: '16px',
        alignItems: 'start',
      }}
      gripContainerClassName="tw-mt-[6px]"
    >
      <div className="tw-flex tw-flex-col tw-gap-6">
        <div className="tw-flex tw-gap-2 tw-items-start">
          <div className="tw-flex tw-flex-col tw-gap-1 tw-flex-1">
            <div className="tw-text-gray-900 tw-text-lg tw-font-bold tw-leading-7 tw-flex tw-gap-2 tw-items-center">
              {isExpanded ? (
                <ChevronDown className="tw-cursor-pointer" onClick={handleExpandContent} />
              ) : (
                <ChevronDown
                  className="tw-rotate-[270deg] tw-cursor-pointer"
                  onClick={handleExpandContent}
                />
              )}
              {displayName}
            </div>
            {releaseDate && (
              <div className="tw-text-gray-500 tw-text-xs tw-font-normal tw-leading-none tw-ml-4">
                {intl.formatMessage(xblockStatusMessages.releasedLabel)} {releaseDate}
              </div>
            )}
          </div>
          <div className="tw-flex tw-gap-2 tw-items-center">
            <Button
              variant="secondary"
              size="sm"
              iconBefore={Plus}
              className="!tw-w-auto tw-border-gray-300 tw-text-gray-700 !tw-py-[6px] !tw-px-[10px] focus:!tw-border"
              labels={{ default: intl.formatMessage(courseUnitMessages.newUnitBtnText) }}
              onClick={handleNewUnitSubmit}
            />
            <CardHeaderWithDropdownOnly
              cardId={id}
              title={displayName}
              status={sectionStatus}
              hasChanges={hasChanges}
              onClickMenuButton={handleClickMenuButton}
              onClickPublish={onOpenPublishModal}
              onClickConfigure={onOpenConfigureModal}
              onClickEdit={openForm}
              onClickDelete={onOpenDeleteModal}
              onClickMoveUp={handleSectionMoveUp}
              onClickMoveDown={handleSectionMoveDown}
              isFormOpen={isFormOpen}
              closeForm={closeForm}
              onEditSubmit={handleEditSubmit}
              isDisabledEditField={savingStatus === RequestStatus.IN_PROGRESS}
              onClickDuplicate={onDuplicateSubmit}
              titleComponent={titleComponent}
              namePrefix={namePrefix}
              actions={actions}
            />
          </div>
        </div>
        {isExpanded && (
          <div
            data-testid="section-card__subsections"
            className={classNames('section-card__subsections', { 'item-children': isDraggable })}
          >
            {children}
          </div>
        )}
      </div>
    </SortableItem>
  );
};

SectionCard.defaultProps = {
  children: null,
};

SectionCard.propTypes = {
  section: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    published: PropTypes.bool.isRequired,
    hasChanges: PropTypes.bool.isRequired,
    visibilityState: PropTypes.string.isRequired,
    highlights: PropTypes.arrayOf(PropTypes.string).isRequired,
    shouldScroll: PropTypes.bool,
    actions: PropTypes.shape({
      deletable: PropTypes.bool.isRequired,
      draggable: PropTypes.bool.isRequired,
      childAddable: PropTypes.bool.isRequired,
      duplicable: PropTypes.bool.isRequired,
    }).isRequired,
    isHeaderVisible: PropTypes.bool,
    childInfo: PropTypes.shape({
      children: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          childInfo: PropTypes.shape({
            children: PropTypes.arrayOf(
              PropTypes.shape({
                id: PropTypes.string.isRequired,
              }),
            ).isRequired,
          }).isRequired,
        }),
      ).isRequired,
    }).isRequired,
  }).isRequired,
  isSelfPaced: PropTypes.bool.isRequired,
  isCustomRelativeDatesActive: PropTypes.bool.isRequired,
  children: PropTypes.node,
  onOpenHighlightsModal: PropTypes.func.isRequired,
  onOpenPublishModal: PropTypes.func.isRequired,
  onOpenConfigureModal: PropTypes.func.isRequired,
  onEditSectionSubmit: PropTypes.func.isRequired,
  savingStatus: PropTypes.string.isRequired,
  onOpenDeleteModal: PropTypes.func.isRequired,
  onDuplicateSubmit: PropTypes.func.isRequired,
  isSectionsExpanded: PropTypes.bool.isRequired,
  onNewSubsectionSubmit: PropTypes.func.isRequired,
  onNewUnitSubmit: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  canMoveItem: PropTypes.func.isRequired,
  onOrderChange: PropTypes.func.isRequired,
};

export default SectionCard;
