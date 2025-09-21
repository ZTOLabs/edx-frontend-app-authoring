import { useState } from 'react';

import BaseModal, { FooterType, ModalSizeEnum } from 'shared/Components/Common/BaseModal';
import { ModalProps } from 'types/modal';

const ConfirmAction = ({
  onCloseModal,
  headerText = 'Confirm Action',
  onSubmit,
  onCancel,
  bodyText = 'Are you sure you want to proceed with this action?',
  primaryButtonText = 'Yes',
  primaryButtonVariant = 'brand',
  secondaryButtonText = 'No',
  secondaryButtonVariant = 'secondary',
  ...rest
}: ModalProps.ConfirmAction) => {
  const [submittingPrimary, setSubmittingPrimary] = useState(false);
  const [submittingSecondary, setSubmittingSecondary] = useState(false);

  const runFnAndCloseModal = async (setSubmitting: (_: boolean) => void, fn?: () => void | Promise<void>) => {
    try {
      setSubmitting(true);
      await fn?.();
      setSubmitting(false);
      onCloseModal();
    } catch {
      setSubmitting(false);
    }
  };

  const disableButtons = submittingPrimary || submittingSecondary;

  return (
    <BaseModal
      id="modal-confirmation"
      data-testid="modal-confirmation"
      onCloseModal={onCloseModal}
      disableCloseButton={submittingPrimary || submittingSecondary}
      size={ModalSizeEnum.SMALL}
      headerText={headerText}
      body={
        <div
          style={{ maxHeight: 'calc(100vh - 260px)' }}
          className="u-overflowAuto u-text300 u-fontRegular u-marginBottomNone"
        >
          {bodyText}
        </div>
      }
      primaryButtonText={primaryButtonText}
      onClickPrimaryButton={() => {
        runFnAndCloseModal(setSubmittingPrimary, onSubmit);
      }}
      disablePrimaryButton={disableButtons}
      primaryButtonVariant={primaryButtonVariant}
      secondaryButtonVariant={secondaryButtonVariant}
      secondaryButtonText={secondaryButtonText}
      onClickSecondaryButton={() => {
        runFnAndCloseModal(setSubmittingSecondary, onCancel);
      }}
      disableSecondaryButton={disableButtons}
      footerType={FooterType.FULL_WIDTH_DOUBLE}
      isPrimaryButtonLoading={submittingPrimary}
      {...rest}
    />
  );
};

export default ConfirmAction;
