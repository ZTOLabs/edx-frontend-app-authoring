import { useState } from 'react';

import { ModalKey } from 'constants/modal';
import { DisplayModal, useModalContext } from 'context/modal';

import ConfirmAction from './ConfirmAction';

const modalsMap = {
  [ModalKey.CONFIRM_ACTION]: ConfirmAction,
  [ModalKey.CANVAS]: null,
};

interface ModalContainerProps {
  displayModal: DisplayModal;
  closeModal: () => void;
}

const ModalContainerRoot = () => {
  const { modalStack, closeModal } = useModalContext();

  return (
    <div>
      {modalStack.map((modal) => (
        <ModalContainer
          key={modal.id}
          displayModal={modal}
          closeModal={() => closeModal(modal.id)}
        />
      ))}
    </div>
  );
};

const ModalContainer = ({ displayModal, closeModal }: ModalContainerProps) => {
  const [showModal, setShowModal] = useState(true);

  const ModalComponent: React.FC<any> | null = displayModal ? modalsMap[displayModal.name] : null;

  const handleCloseModal = () => {
    setShowModal(false);
  };

  if (!ModalComponent) {
    return null;
  }

  return (
    <ModalComponent
      show={showModal}
      type={displayModal?.type}
      onCloseModal={handleCloseModal}
      onUnmountModal={closeModal}
      {...displayModal?.props}
    />
  );
};

export default ModalContainerRoot;
