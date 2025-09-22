import { useIntl } from '@edx/frontend-platform/i18n';
import messages from 'library-page/message';
import Button from 'shared/Components/Common/Button';
import { Plus, Upload01 } from '@untitledui/icons';
import { cn } from 'shared/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { Icon, IconButtonWithTooltip, Row } from '@openedx/paragon';
import { useEffect } from 'react';
import { MainCardLayout } from 'shared/Components/Common/Layouts/MainCardLayout';
import { LoadingSpinner } from '../generic/Loading';
import InternetConnectionAlert from '../generic/internet-connection-alert';
import { RequestStatus } from '../data/constants';
import { getLibraryRequestParams, getLoadingStatuses } from './data/selectors';
import SubHeader from '../generic/sub-header/SubHeader';
import LibraryFilters from './library-filters';
import { fetchLibraryData } from './data/thunks';
import Libraries from './libraries';

const LibraryPage = () => {
  const {
    libraryLoadingStatus,
  } = useSelector(getLoadingStatuses);
  const isLoadingLibrary = libraryLoadingStatus === RequestStatus.IN_PROGRESS;
  const isFailedLibraryPage = libraryLoadingStatus === RequestStatus.FAILED;
  const intl = useIntl();
  const dispatch = useDispatch();
  const location = useLocation();
  const locationValue = location.search ?? '';

  const libraryRequestParams = useSelector(getLibraryRequestParams);
  const { isFiltered } = libraryRequestParams;

  useEffect(() => {
    dispatch(fetchLibraryData(locationValue, libraryRequestParams));
  }, []);

  if (isLoadingLibrary && !isFiltered) {
    return (
      <Row className="m-0 mt-4 justify-content-center">
        <LoadingSpinner />
      </Row>
    );
  }

  return (
    <div className="tw-h-screen tw-w-full tw-p-3">
      <MainCardLayout>
        <section className="tw-flex tw-flex-col tw-gap-8">
          <article className="studio-home-sub-header">
            <section>
              <SubHeader
                hideBorder
                title={intl.formatMessage(messages.headingTitle)}
                headerActions={[
                  <Button
                    className="!tw-w-auto tw-border-gray-300"
                    variant="brand"
                    iconBefore={Plus}
                    size="sm"
                    disabled={false}
                    onClick={() => {}}
                    labels={{ default: intl.formatMessage(messages.addNewMaterialBtnText) }}
                  />,
                  <IconButtonWithTooltip
                    variant="secondary"
                    tooltipPlacement="top"
                    tooltipContent={intl.formatMessage(messages.addNewMaterialBtnText)}
                    className={cn(
                      'tw-bg-white !tw-rounded-[100px] tw-px-[14px] tw-py-[10px]',
                      'tw-border tw-border-solid tw-border-gray-300',
                      'tw-shadow-xs',
                      '!tw-text-black tw-text-sm tw-font-semibold',
                      'after:tw-hidden',
                      '!tw-size-10',
                    )}
                    src={Upload01}
                    iconAs={Icon}
                    onClick={() => {}}
                  />,
                ]}
              />
            </section>
          </article>
          <section className="tw-flex tw-flex-col tw-gap-8">
            <div id="library-page-filters">
              <LibraryFilters
                dispatch={dispatch}
                locationValue={locationValue}
              />
            </div>
            <div>
              <Libraries />
            </div>
          </section>
        </section>
      </MainCardLayout>

      <div className="alert-toast">
        <InternetConnectionAlert
          isFailed={isFailedLibraryPage}
          isQueryPending={isLoadingLibrary}
        />
      </div>
    </div>
  );
};

export default LibraryPage;
