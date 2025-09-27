import classNames from 'classnames';
import React from 'react';

interface NavigationMenuItemProps {
  className?: string;
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const NavigationMenuItem: React.FC<NavigationMenuItemProps> = ({
  className,
  isActive,
  onClick,
  children,
}) => {
  return (
    <button
      type="button"
      className={classNames(
        'tw-self-stretch tw-justify-start tw-text-slate-700 tw-text-sm tw-font-medium tw-leading-tight tw-py-[10px] tw-px-3 tw-cursor-pointer tw-bg-transparent tw-border-0 tw-text-left',
        isActive && 'tw-text-violet-700 tw-bg-violet-100 tw-rounded-[8px]',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default NavigationMenuItem;
