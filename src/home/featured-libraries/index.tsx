import React from 'react';
import FeaturedLayout from 'home/layout/featured';
import { useIntl } from '@edx/frontend-platform/i18n';
import StatefulButtonWrapper from 'shared/Components/Common/StatefulButtonWrapper';
import { Plus } from '@untitledui/icons';
import { useNavigate } from 'react-router';
import Libraries from './libraries';
import messages from './messages';

const FeaturedLibraries = () => {
  const intl = useIntl();
  const navigate = useNavigate();

  const actions = (
    <>
      <StatefulButtonWrapper
        className="!tw-w-auto"
        variant="link"
        size="sm"
        disabled={false}
        onClick={() => navigate('/libraries')}
        labels={{ default: intl.formatMessage(messages.allCoursesBtnText) }}
      />
      <StatefulButtonWrapper
        className="!tw-w-auto tw-border-gray-300 tw-text-gray-700"
        variant="secondary"
        iconBefore={Plus}
        size="sm"
        disabled={false}
        // TODO: Add new library button
        onClick={() => undefined}
        labels={{ default: intl.formatMessage(messages.addNewCourseBtnText) }}
      />
    </>
  );

  return (
    <FeaturedLayout title={intl.formatMessage(messages.librariesTabTitle)} actions={actions}>
      <Libraries />
    </FeaturedLayout>
  );
};

export default FeaturedLibraries;
