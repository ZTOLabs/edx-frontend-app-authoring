import React from 'react';
import { useSelector } from 'react-redux';
import {
  Card,
} from '@openedx/paragon';
import { getConfig } from '@edx/frontend-platform';
import { Link } from 'react-router-dom';

import { cn } from 'shared/lib/utils';
import { ClipboardCheck, Stars02 } from '@untitledui/icons';
import { getWaffleFlags } from '../../../data/selectors';

interface BaseProps {
  displayName: string;
  fileType: string;
  size?: string;
  image: string;
  lmsLink?: string | null;
  rerunLink?: string | null;
  courseKey?: string;
  isAIGenerated?: boolean;
}
type Props = BaseProps & (
  /** If we should open this course/library in this MFE, this is the path to the edit page, e.g. '/course/foo' */
  { path: string, url?: never } |
  /**
   * If we might be redirecting to the legacy Studio view, this is the URL to redirect to.
   * URLs starting with '/' are assumed to be relative to the legacy Studio root.
   */
  { url: string, path?: never }
);

/**
 * A card on the Studio home page that represents a Course or a Library
 */
const LibraryItem: React.FC<Props> = ({
  displayName,
  fileType,
  image,
  lmsLink = '',
  rerunLink = '',
  courseKey = '',
  size = '',
  path,
  url,
  isAIGenerated = false,
}) => {
  const waffleFlags = useSelector(getWaffleFlags);

  const subtitle = [fileType, size].filter(Boolean).join(' | ');

  const destinationUrl: string = path ?? (
    waffleFlags.useNewCourseOutlinePage
      ? url
      : new URL(url, getConfig().STUDIO_BASE_URL).toString()
  );

  const readOnlyItem = !(lmsLink || rerunLink || url || path);
  const hasDisplayName = (displayName ?? '').trim().length ? displayName : courseKey;

  return (
    <Card className={cn(
      'tw-bg-white/70 tw-border tw-border-solid tw-border-white tw-h-full',
      'tw-rounded-2xl tw-p-2',
      'tw-flex tw-flex-row tw-gap-4',
      'tw-shadow-none',
    )}
    >
      <div
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
        className="tw-h-[80px] tw-w-[80px] tw-rounded-[8px]"
      />
      <div className="tw-flex tw-flex-col tw-flex-1 tw-h-auto tw-min-w-0">
        <Card.Header
          className="!tw-p-0 tw-flex tw-flex-col tw-gap-1"
          size="sm"
          title={!readOnlyItem ? (
            <Link
              className="tw-text-sm tw-font-semibold tw-text-gray-900 tw-line-clamp-2 hover:tw-no-underline"
              to={destinationUrl}
            >
              {hasDisplayName}
            </Link>
          ) : (
            <span className="tw-text-sm tw-font-semibold tw-text-gray-900 tw-line-clamp-2 hover:tw-no-underline">
              {displayName}
            </span>
          )}
          subtitle={
            <span className="tw-text-xs tw-font-normal tw-text-gray-500 tw-block tw-truncate tw-whitespace-nowrap hover:tw-no-underline">{subtitle}</span>
          }
        />
        {courseKey && (
        <div className="tw-mt-2 tw-flex tw-flex-row tw-gap-1 tw-items-center tw-text-gray-500">
          <ClipboardCheck className="tw-size-4" />
          <span className=" tw-text-xs tw-font-normal tw-leading-5 tw-block tw-truncate tw-whitespace-nowrap hover:tw-no-underline">{courseKey}</span>
        </div>
        )}
      </div>

      <div className="tw-top-0 tw-right-0">
        {isAIGenerated && (
          <AIGeneratedBadge />
        )}
      </div>
    </Card>
  );
};

const AIGeneratedBadge = () => (
  <div className="tw-w-[20px] tw-h-[20px] tw-bg-gradient-to-t tw-from-[#FA71CD] tw-to-[#C471F5] tw-flex tw-items-center tw-justify-center tw-p-1 tw-rounded">
    <Stars02 fill="#fff" stroke="#fff" />
  </div>
);

export default LibraryItem;
