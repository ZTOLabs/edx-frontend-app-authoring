import React, { Fragment, useImperativeHandle, useRef } from 'react';
import styled from 'styled-components';
import { cn } from 'shared/lib/utils';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from 'shared/Components/ui/dialog';
import { Separator } from 'shared/Components/ui/separator';

import Button, { ButtonProps } from './Button';
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '../ui/sheet';

export enum ModalSizeEnum {
  SMALL = 'small',
  COMPACT = 'compact',
  MEDIUM = 'medium',
  LARGE = 'large',
  EXTRA_LARGE = 'extraLarge',
}

export enum FooterType {
  SINGLE = 'single',
  DOUBLE = 'double',
  TRIPLE = 'triple',
  FULL_WIDTH_DOUBLE = 'full-width-double',
  VERTICAL_DOUBLE = 'vertical-double',
  BETWEEN_DOUBLE = 'between-double',
  SINGLE_RIGHT = 'single-right',
  NONE = 'none',
}

export enum ModalType {
  DIALOG = 'dialog',
  DRAWER = 'drawer',
}

const Width = {
  [ModalSizeEnum.SMALL]: 'min(100vw, 400px)',
  [ModalSizeEnum.COMPACT]: 'min(100vw, 600px)',
  [ModalSizeEnum.MEDIUM]: 'min(100vw, 800px)',
  [ModalSizeEnum.LARGE]: 'min(100vw, 882px)',
  [ModalSizeEnum.EXTRA_LARGE]: '100vw',
};

const DrawerSize = {
  [ModalSizeEnum.SMALL]: '!max-w-[400px]',
  [ModalSizeEnum.COMPACT]: '!max-w-[600px]',
  [ModalSizeEnum.MEDIUM]: '!max-w-[800px]',
  [ModalSizeEnum.LARGE]: '!max-w-[882px]',
  [ModalSizeEnum.EXTRA_LARGE]: '!max-w-[calc(100vw-var(--modal-screen-spacing)*2)]',
};

const DialogSize = {
  [ModalSizeEnum.SMALL]: '!max-w-[400px]',
  [ModalSizeEnum.COMPACT]: '!max-w-[600px]',
  [ModalSizeEnum.MEDIUM]: '!max-w-[800px]',
  [ModalSizeEnum.LARGE]: '!max-w-[882px]',
  [ModalSizeEnum.EXTRA_LARGE]: '!max-w-[calc(100vw-var(--modal-screen-spacing)*2)]',
};

export interface BaseModalProps {
  id: string;
  dataTestId?: string;
  type?: ModalType;
  closable?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  showHeader?: boolean;
  header?: React.ReactNode;
  headerText?: string;
  description?: string;
  body: React.ReactNode;
  showFooter?: boolean;
  footer?: React.ReactNode;
  footerType?: FooterType;
  footerInfo?: React.ReactNode;
  size?: ModalSizeEnum;
  isMultipleSteps?: boolean;
  disableCloseButton?: boolean;
  primaryButtonProps?: Partial<ButtonProps>;
  primaryButtonText?: string;
  primaryButtonVariant?: ButtonProps['variant'];
  onClickPrimaryButton?: (...args: any[]) => any;
  disablePrimaryButton?: boolean;
  primaryButtonTestId?: string;
  secondaryButtonProps?: Partial<ButtonProps>;
  secondaryButtonText?: string;
  secondaryButtonVariant?: ButtonProps['variant'];
  onClickSecondaryButton?: () => any;
  disableSecondaryButton?: boolean;
  secondaryButtonTestId?: string;
  tertiaryButtonText?: string;
  tertiaryButtonVariant?: ButtonProps['variant'];
  tertiaryButtonProps?: Partial<ButtonProps>;
  onClickTertiaryButton?: (...args: any[]) => any;
  disableTertiaryButton?: boolean;
  tertiaryButtonTestId?: string;
  isPrimaryButtonLoading?: boolean;
  onCloseModal: () => any;
  onUnmountModal: () => void;
  show: boolean;
  hideOverlay?: boolean;
  modalHandlersRef?: React.ForwardedRef<ModalHandlers>;
  dialogContentProps?: React.ComponentProps<typeof DialogContent>;
  fitScreen?: boolean;
  bodyClassName?: string;
  disableAutoFocus?: boolean;
}

export type ModalHandlers = {
  scrollBodyToTop: () => void;
};

const BaseModal = ({
  id,
  dataTestId,
  type = ModalType.DIALOG,
  closable = true,
  children,
  className,
  style,
  showHeader = true,
  header,
  headerText,
  description,
  body,
  footer,
  showFooter = true,
  footerType = FooterType.SINGLE,
  footerInfo = null,
  isMultipleSteps = false,
  size = ModalSizeEnum.MEDIUM,
  disableCloseButton = false,
  primaryButtonProps,
  primaryButtonText,
  primaryButtonVariant = 'brand',
  onClickPrimaryButton,
  disablePrimaryButton,
  primaryButtonTestId,
  secondaryButtonProps,
  secondaryButtonText,
  secondaryButtonVariant = 'secondary',
  onClickSecondaryButton,
  disableSecondaryButton,
  secondaryButtonTestId,
  tertiaryButtonText,
  tertiaryButtonVariant = 'link',
  tertiaryButtonProps,
  onClickTertiaryButton,
  disableTertiaryButton,
  tertiaryButtonTestId,
  isPrimaryButtonLoading,
  onCloseModal,
  onUnmountModal,
  show,
  hideOverlay = false,
  modalHandlersRef,
  dialogContentProps,
  fitScreen = false,
  bodyClassName,
  disableAutoFocus = true,
}: BaseModalProps) => {
  const Root = type === ModalType.DRAWER ? Sheet : Dialog;
  const Content = type === ModalType.DRAWER ? SheetContent : DialogContent;
  const Header = type === ModalType.DRAWER ? SheetHeader : DialogHeader;
  const Title = type === ModalType.DRAWER ? SheetTitle : DialogTitle;
  const Description = type === ModalType.DRAWER ? SheetDescription : DialogDescription;
  const Body = type === ModalType.DRAWER ? SheetBody : DialogBody;
  const Footer = type === ModalType.DRAWER ? SheetFooter : DialogFooter;

  const bodyRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(modalHandlersRef, () => ({
    scrollBodyToTop: () => {
      bodyRef.current?.scrollTo({ top: 0 });
    },
  }));

  const getContentProps = () => {
    return {
      id,
      dataTestId,
      className: cn(
        'tw-p-0 tw-flex tw-flex-col tw-gap-0',
        type === ModalType.DIALOG && DialogSize[size],
        type === ModalType.DRAWER && DrawerSize[size],
        fitScreen && 'tw-max-h-[calc(100vh-2*var(--modal-screen-spacing))] tw-overflow-hidden',
        className,
      ),
      closeIconButtonClassName: cn(!closable && 'tw-hidden', disableCloseButton && 'tw-pointer-events-none'),
      closeIconButtonOnClick: onCloseModal,
      onUnmount: onUnmountModal,
      hideOverlay,
      style: {
        width: Width[size],
        ...style,
      },
      onOpenAutoFocus: disableAutoFocus ? (e: Event) => e.preventDefault() : undefined,
      ...dialogContentProps,
    };
  };

  const renderHeader = () => {
    return (
      <>
        <Title
          className="tw-font-semibold tw-text-2xl"
          asChild={!!header}
        >
          {header || headerText}
        </Title>
        {description && <Description>{description}</Description>}
      </>
    );
  };

  const renderPrimaryButton = (customProps?: any) => {
    const { className: customClassName, ...customPropsRest } = customProps || {};
    const { className: primaryButtonClassName, ...primaryButtonPropsRest } = primaryButtonProps || {};
    return (
      <Button
        className={cn('tw-w-fit', primaryButtonClassName || customClassName)}
        data-testid={primaryButtonTestId || 'modal-primary-button'}
        variant={primaryButtonVariant}
        onClick={onClickPrimaryButton}
        disabled={disablePrimaryButton || isPrimaryButtonLoading}
        labels={{ default: primaryButtonText }}
        {...customPropsRest}
        {...primaryButtonPropsRest}
      />
    );
  };

  const renderSecondaryButton = (customProps?: any) => {
    const { className: customClassName, ...customPropsRest } = customProps || {};
    const { className: secondaryButtonClassName, ...secondaryButtonPropsRest } = secondaryButtonProps || {};
    return (
      <Button
        className={cn('tw-w-fit', secondaryButtonClassName || customClassName)}
        data-testid={secondaryButtonTestId || 'modal-secondary-button'}
        variant={secondaryButtonVariant}
        onClick={onClickSecondaryButton}
        disabled={disableSecondaryButton}
        labels={{ default: secondaryButtonText }}
        {...customPropsRest}
        {...secondaryButtonPropsRest}
      />
    );
  };

  const renderFooter = () => {
    return (
      <FooterWrapper>
        {renderFooterButtons()}
        {renderFooterInfo()}
      </FooterWrapper>
    );
  };

  const renderFooterButtons = () => {
    switch (footerType) {
      case FooterType.SINGLE: {
        return renderPrimaryButton({ className: 'tw-w-full' });
      }

      case FooterType.DOUBLE: {
        return (
          <DoubleFooterWrapper className={`tw-flex tw-grow ${isMultipleSteps ? 'tw-justify-between' : 'tw-justify-end'}`}>
            {renderSecondaryButton()}
            {renderPrimaryButton()}
          </DoubleFooterWrapper>
        );
      }

      case FooterType.TRIPLE: {
        return (
          <div
            className="tw-flex tw-justify-between"
            data-testid="modal-triple-footer"
          >
            <Button
              size="sm"
              variant={tertiaryButtonVariant}
              disabled={disableTertiaryButton}
              onClick={onClickTertiaryButton}
              data-testid={tertiaryButtonTestId || 'modal-tertiary-button'}
              {...tertiaryButtonProps}
              labels={{ default: tertiaryButtonText }}
            />
            <DoubleFooterWrapper className={`tw-flex tw-grow ${isMultipleSteps ? 'tw-justify-between' : 'tw-justify-end'}`}>
              {renderSecondaryButton()}
              {renderPrimaryButton()}
            </DoubleFooterWrapper>
          </div>
        );
      }

      case FooterType.FULL_WIDTH_DOUBLE: {
        return (
          <div className="tw-flex tw-grow tw-justify-end">
            {renderSecondaryButton({ className: 'grow' })}
            <div className="mr-3" />
            {renderPrimaryButton({ className: 'grow' })}
          </div>
        );
      }

      case FooterType.VERTICAL_DOUBLE: {
        return (
          <Fragment>
            <div className="tw-mb-1">{renderPrimaryButton({ className: 'tw-w-full' })}</div>
            {renderSecondaryButton({ className: 'w-full' })}
          </Fragment>
        );
      }

      case FooterType.BETWEEN_DOUBLE: {
        return (
          <div className="tw-flex tw-grow tw-justify-between">
            {renderSecondaryButton()}
            {renderPrimaryButton()}
          </div>
        );
      }

      case FooterType.SINGLE_RIGHT: {
        return <div className="tw-flex tw-grow tw-justify-end">{renderPrimaryButton()}</div>;
      }

      case FooterType.NONE: {
        return null;
      }

      default:
        throw new Error('Footer type not supported');
    }
  };

  const renderFooterInfo = () =>
    footerInfo && (
      <>
        <Separator className="tw-my-4" />
        {footerInfo}
      </>
    );

  return (
    <Root open={show}>
      <Content
        {...getContentProps()}
        data-testid={dataTestId}
        data-modal-size={size}
      >
        {children || (
          <>
            {showHeader && <Header className="tw-pt-8 tw-pb-4 tw-px-6 tw-text-gray-900">{renderHeader()}</Header>}
            <Body
              ref={bodyRef}
              id={`${id}-body`}
              className={bodyClassName}
            >
              {body}
            </Body>
            {showFooter && (
              <Footer className="!flex-row tw-p-6 tw-bg-[#F9FAFB] tw-mt-auto tw-rounded-b-[inherit]">
                {footer || renderFooter()}
              </Footer>
            )}
          </>
        )}
      </Content>
    </Root>
  );
};

export default BaseModal;

const FooterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const DoubleFooterWrapper = styled.div`
  gap: 12px;
  button {
    width: fit-content;
  }
`;
