import { useIntl } from '@edx/frontend-platform/i18n';
import React, { useMemo } from 'react';
import { Button } from 'shared/Components/ui/button';
import { cn } from 'shared/lib/utils';
import { useSelector } from 'react-redux';
import { getLibraryRequestParams } from '../../data/selectors';
import messages from './messages';

const LibraryFileTypesChips = ({ onItemMenuSelected }: { onItemMenuSelected: (value: string) => void }) => {
  const intl = useIntl();

  const { type } = useSelector(getLibraryRequestParams);

  const libraryFileTypes = useMemo(
    () => [
      {
        id: 'all-types',
        name: intl.formatMessage(messages.libraryFileTypesChipsAllTypes),
        value: 'allTypes',
      },
      {
        id: 'document',
        name: intl.formatMessage(messages.libraryFileTypesChipsDocumentTypes),
        value: 'document',
      },
      {
        id: 'image',
        name: intl.formatMessage(messages.libraryFileTypesChipsImageTypes),
        value: 'image',
      },
      {
        id: 'presentation',
        name: intl.formatMessage(messages.libraryFileTypesChipsPresentationTypes),
        value: 'presentation',
      },
      {
        id: 'assignment',
        name: intl.formatMessage(messages.libraryFileTypesChipsAssignmentTypes),
        value: 'assignment',
      },
      {
        id: 'video',
        name: intl.formatMessage(messages.libraryFileTypesChipsVideoTypes),
        value: 'video',
      },
    ],
    [intl],
  );
  return (
    <div className="tw-flex tw-flex-row tw-items-center tw-gap-2">
      {libraryFileTypes.map(({ id, name, value }) => {
        const isActive = type === id;
        return (
          <Button
            className={cn(
              'tw-border-none tw-shadow-none tw-font-semibold !tw-rounded-[100px]',
              isActive && 'tw-bg-brand-100 tw-text-gray-900',
              !isActive && 'tw-bg-transparent tw-text-gray-600',
            )}
            key={id}
            onClick={() => onItemMenuSelected(value)}
          >
            {name}
          </Button>
        );
      })}
    </div>
  );
};

export default LibraryFileTypesChips;
