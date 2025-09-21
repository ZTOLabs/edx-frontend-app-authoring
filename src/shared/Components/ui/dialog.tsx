import { cn } from 'shared/lib/utils';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import mergeRefs from 'merge-refs';
import * as React from 'react';
import { useRef } from 'react';

import XCloseIcon from '../../Icons/XCloseIcon';

import { Tooltip, TooltipArrow, TooltipContent, TooltipPortal, TooltipProvider, TooltipTrigger } from './tooltip';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'tw-fixed tw-inset-0 tw-z-50 tw-bg-black/80  data-[state=open]:tw-animate-in data-[state=closed]:tw-animate-out data-[state=closed]:tw-fade-out-0 data-[state=open]:tw-fade-in-0',
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    closeIconButtonClassName?: string;
    closeIconButtonOnClick?: () => void;
    hideOverlay?: boolean;
    onUnmount?: () => void;
  }
>(
  (
    { className, children, onUnmount, closeIconButtonClassName, closeIconButtonOnClick, hideOverlay, ...props },
    ref,
  ) => {
    const contentRef = useRef<HTMLDivElement | null>(null);

    const handleAnimationEnd = () => {
      const openState = contentRef.current?.getAttribute('data-state');
      if (openState === 'closed') {
        onUnmount?.();
      }
    };

    return (
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          ref={mergeRefs(ref, contentRef)}
          className={cn(
            'tw-fixed tw-left-[50%] tw-top-[50%] tw-z-50 tw-grid tw-w-full tw-max-w-lg tw-translate-x-[-50%] tw-translate-y-[-50%] tw-gap-4 tw-border tw-border-neutral-200 tw-bg-white tw-shadow-lg tw-duration-200 data-[state=open]:tw-animate-in data-[state=closed]:tw-animate-out data-[state=closed]:tw-fade-out-0 data-[state=open]:tw-fade-in-0 data-[state=closed]:tw-zoom-out-95 data-[state=open]:tw-zoom-in-95 data-[state=closed]:tw-slide-out-to-left-1/2 data-[state=closed]:tw-slide-out-to-top-[48%] data-[state=open]:tw-slide-in-from-left-1/2 data-[state=open]:tw-slide-in-from-top-[48%] sm:tw-rounded-lg dark:tw-border-neutral-800 dark:tw-bg-neutral-950',
            className,
          )}
          onAnimationEnd={handleAnimationEnd}
          {...props}
        >
          {children}
          <div className="tw-absolute tw-right-4 tw-top-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogPrimitive.Close
                    data-testid="dialog-close-button"
                    className={cn(
                      'tw-rounded-sm tw-opacity-70 tw-ring-offset-white tw-transition-opacity hover:tw-opacity-100 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-neutral-950 focus:tw-ring-offset-2 disabled:tw-pointer-events-none data-[state=open]:tw-bg-neutral-100 data-[state=open]:tw-text-neutral-500 dark:tw-ring-offset-neutral-950 dark:focus:tw-ring-neutral-300 dark:data-[state=open]:tw-bg-neutral-800 dark:data-[state=open]:tw-text-neutral-400',
                      closeIconButtonClassName,
                    )}
                    onClick={closeIconButtonOnClick}
                  >
                    <XCloseIcon />
                  </DialogPrimitive.Close>
                </TooltipTrigger>

                <TooltipPortal>
                  <TooltipContent>
                    <TooltipArrow />
                    Close
                  </TooltipContent>
                </TooltipPortal>
              </Tooltip>
            </TooltipProvider>
            <span className="sr-only">Close</span>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    );
  });

DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('tw-flex tw-flex-col tw-space-y-1.5 tw-text-center sm:tw-text-left', className)}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

const DialogBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('dialog-body tw-px-6 tw-pt-4 tw-pb-6 tw-text-gray-600', className)}
      {...props}
    />
  ),
);
DialogBody.displayName = 'DialogBody';

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('dialog-footer tw-flex tw-flex-col-reverse sm:tw-flex-row sm:tw-justify-end sm:tw-space-x-2', className)}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('tw-text-lg tw-font-semibold tw-leading-none tw-tracking-tight', className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('tw-text-sm tw-text-neutral-500 dark:tw-text-neutral-400', className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
