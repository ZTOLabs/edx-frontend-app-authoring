import { Collapsible } from '@openedx/paragon';
import { ChevronDown, ChevronRight } from '@untitledui/icons';
import classNames from 'classnames';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationMenuItem from './NavigationMenuItem';

interface MenuItemProps {
  menuItem: {
    id: string;
    title: string;
    href?: string;
    items?: Array<{
      href: string;
      title: string;
    }>;
  };
  isItemActive: (href: string) => boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ menuItem, isItemActive }) => {
  const navigate = useNavigate();

  // Check if any item in this menu is active (only if items exist)
  const hasActiveItem = menuItem.items
    ? menuItem.items.some((item) => isItemActive(item.href))
    : false;
  const [isCollapsed, setIsCollapsed] = useState(!hasActiveItem);

  const handleToggle = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, [setIsCollapsed]);

  // If item has no children, render it as a simple clickable item
  if (!menuItem.items || menuItem.items.length === 0) {
    return (
      <NavigationMenuItem
        isActive={menuItem.href ? isItemActive(menuItem.href) : false}
        onClick={() => menuItem.href && navigate(menuItem.href)}
      >
        {menuItem.title}
      </NavigationMenuItem>
    );
  }

  return (
    <Collapsible.Advanced open={!isCollapsed} onToggle={handleToggle}>
      <Collapsible.Trigger
        className={classNames(
          'tw-flex tw-border-0 tw-items-center tw-justify-between tw-w-full tw-py-[10px] tw-px-3',
          !isCollapsed && 'tw-mb-1',
        )}
      >
        <div className="tw-self-stretch tw-justify-start tw-text-slate-700 tw-text-sm tw-font-medium tw-leading-tight">
          {menuItem.title}
        </div>
        {isCollapsed ? (
          <ChevronRight className="tw-size-5" />
        ) : (
          <ChevronDown className="tw-size-5" />
        )}
      </Collapsible.Trigger>
      <Collapsible.Body>
        <div className="tw-flex tw-flex-col tw-gap-1">
          {menuItem.items.map((item) => (
            <NavigationMenuItem
              key={item.title}
              className="tw-pl-6 tw-pr-3"
              isActive={isItemActive(item.href)}
              onClick={() => navigate(item.href)}
            >
              {item.title}
            </NavigationMenuItem>
          ))}
        </div>
      </Collapsible.Body>
    </Collapsible.Advanced>
  );
};

export default MenuItem;
