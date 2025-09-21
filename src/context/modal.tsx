import { nanoid } from 'nanoid';
import React, { useCallback, useMemo, useState } from 'react';

import { ModalType } from 'shared/Components/Common/BaseModal';
import { ModalKey } from 'constants/modal';
import { DefaultModalProps, ModalPropsMap } from 'types/modal';
import { createContext } from 'utils/context';

export type DisplayModal = {
  id: string;
  name: ModalKey;
  type: ModalType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Record<string, any>;
};

interface SetModalParams<T extends ModalKey> {
  name: T;
  type: ModalType;
  props: Omit<ModalPropsMap[T], keyof DefaultModalProps>;
}

type SetModalFn = <T extends ModalKey>(params: SetModalParams<T>) => void;
type CloseModalFn = (id: string) => void;

interface ModalContextType {
  setModal: SetModalFn;
  closeModal: CloseModalFn;
  modalStack: DisplayModal[];
}

export const [useModalContext, ModalContext] = createContext<ModalContextType>();

export default function ModalContextProvider({ children }: { children: React.ReactNode }) {
  const [modalStack, setModalStack] = useState<DisplayModal[]>([]);

  const setModal = useCallback<SetModalFn>(({ name, type, props }) => {
    setModalStack((prev) => [...prev, { id: nanoid(), name, type, props }]);
  }, []);

  const closeModal = useCallback<CloseModalFn>((id) => {
    setModalStack((prev) => prev.filter((modal) => modal.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      modalStack,
      setModal,
      closeModal,
    }),
    [closeModal, modalStack, setModal],
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}
