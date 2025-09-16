import React from 'react';
import {
  Row,
} from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import AlertWrapper from 'shared/Components/Common/AlertWrapper';
import { useSelector } from 'react-redux';
import { LoadingSpinner } from '../../generic/Loading';
import LibraryItem from './library-item';
import { getLibraryData, getLoadingStatuses } from '../data/selectors';
import { RequestStatus } from '../../data/constants';
import messages from '../message';

type Props = Record<never, never>;

const Libraries: React.FC<Props> = () => {
  const intl = useIntl();

  const {
    libraryLoadingStatus,
  } = useSelector(getLoadingStatuses);
  const isLoadingLibrary = libraryLoadingStatus === RequestStatus.IN_PROGRESS;
  const isFailedLibraryPage = libraryLoadingStatus === RequestStatus.FAILED;

  const {
    materials,
    numPages,
  } = useSelector(getLibraryData);

  if (isLoadingLibrary) {
    return (
      <Row className="m-0 mt-4 justify-content-center">
        <LoadingSpinner />
      </Row>
    );
  }

  const hasMaterials = !isLoadingLibrary && !isFailedLibraryPage && ((materials.length || 0) > 0);

  return isFailedLibraryPage ? (
    <AlertWrapper status="danger">
      <span>{intl.formatMessage(messages.librariesTabErrorMessage)}</span>
    </AlertWrapper>
  ) : (
    <div className="tw-grid tw-grid-cols-3 tw-gap-4">
      { hasMaterials
        ? materials.map(({
          id, title, fileType, image, isAIGenerated, size, courseKey,
        }) => (
          <LibraryItem
            key={id}
            displayName={title}
            image={image}
            fileType={fileType}
            size={size}
            path={`/library/${id}`}
            isAIGenerated={isAIGenerated}
            courseKey={courseKey}
          />
        )) : !isLoadingLibrary && (
        <AlertWrapper status="danger">
          <span>{intl.formatMessage(messages.librariesTabLibraryNotFoundAlertTitle)}</span>
        </AlertWrapper>
        )}
    </div>
  );
};

export default Libraries;
