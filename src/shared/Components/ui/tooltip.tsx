import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from 'shared/lib/utils';

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipPortal = TooltipPrimitive.Portal;

const TooltipArrow = TooltipPrimitive.Arrow;

const tooltipContentVariants = cva(
  'z-[var(--zto-tooltip-z-index)] rounded-md border px-3 py-1.5 text-sm shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50',
  {
    variants: {
      variant: {
        default: 'bg-gray-900 text-white border-gray-900',
        light: 'bg-white text-gray-900 border-gray-200 [&_svg]:fill-white [&_svg]:drop-shadow-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> &
    VariantProps<typeof tooltipContentVariants>
>(({ className, sideOffset = 4, variant, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn('max-w-[320px]', className, tooltipContentVariants({ variant }))}
    {...props}
    style={{
      wordBreak: 'break-word',
      ...props.style,
    }}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, TooltipPortal, TooltipArrow };
