import React from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from '@edx/frontend-platform/i18n';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Col, Icon, Row,
} from '@openedx/paragon';
import { DragIndicator } from '@openedx/paragon/icons';

import classNames from 'classnames';
import messages from './messages';
import { Grip } from 'lucide-react';

const SortableItem = ({
  id,
  category,
  isDraggable,
  isDroppable,
  componentStyle,
  children,
  // injected
  intl,
  gripContainerClassName,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    setActivatorNodeRef,
  } = useSortable({
    id,
    data: {
      category,
    },
    disabled: {
      draggable: !isDraggable,
      droppable: !isDroppable,
    },
    animateLayoutChanges: () => false,
  });

  const style = {
    position: 'relative',
    zIndex: isDragging ? 200 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
    ...componentStyle,
  };

  return (
    <div ref={setNodeRef} style={style} className="tw-flex tw-items-center">
      {isDraggable && (
        <div
          className={classNames(
            'tw-flex tw-items-center tw-justify-center tw-mr-2',
            gripContainerClassName,
          )}
        >
          <Grip
            className="tw-w-4 tw-h-4"
            ref={setActivatorNodeRef}
            key="drag-to-reorder-icon"
            aria-label={intl.formatMessage(messages.tooltipContent)}
            {...attributes}
            {...listeners}
          />
        </div>
      )}
      <div className="tw-flex-1">{children}</div>
    </div>
  );
};

SortableItem.defaultProps = {
  componentStyle: null,
  isDroppable: true,
  isDraggable: true,
};

SortableItem.propTypes = {
  id: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  isDroppable: PropTypes.bool,
  isDraggable: PropTypes.bool,
  children: PropTypes.node.isRequired,
  componentStyle: PropTypes.shape({}),
  gripContainerClassName: PropTypes.string,
  // injected
  intl: intlShape.isRequired,
};

export default injectIntl(SortableItem);
