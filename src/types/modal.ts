import { BaseModalProps, ModalType } from 'shared/Components/Common/BaseModal';
import { ModalKey } from 'constants/modal';

export interface ModalPropsMap {
  [ModalKey.CONFIRM_ACTION]: ModalProps.ConfirmAction;
  [ModalKey.CANVAS]: ModalProps.Canvas;
}

// Default props that already exist in Modal component
export interface DefaultModalProps {
  show: boolean;
  type: ModalType;
  onCloseModal: () => void | Promise<void>;
  onUnmountModal: () => void;
}

// Props that can be extended by other Modal components
export type ToExtendModalProps = DefaultModalProps & Partial<BaseModalProps>;

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ModalProps {
  export interface ConfirmAction extends ToExtendModalProps {
    onSubmit: () => void | Promise<void>;
    onCancel?: () => void | Promise<void>;
    bodyText?: string;
  }

  export interface Canvas extends ToExtendModalProps {
    type: any; // TODO: REVIEW
    data: any; // TODO: REVIEW
    onCloseCanvas?: () => void | Promise<void>;
  }
}
