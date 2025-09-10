import { useNavigate } from 'react-router-dom';

import {
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/Components/ui/sidebar';
import { AppNavigation } from 'types/app';

const Items = ({
  item,
}: {
  item: AppNavigation;
}) => {
  const navigate = useNavigate();

  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton
        asChild
        size="lg"
        isActive={item.isActive}
        className="tw-justify-center tw-bg-transparent tw-text-grayWarm950 tw-group-data-[collapsible=icon]:h-11"
      >
        <div
          className="tw-flex tw-flex-col tw-items-center tw-gap-[2px] tw-h-auto tw-w-[56px] tw-cursor-pointer tw-[&_svg]:w-5 tw-[&_svg]:h-5 !tw-p-0"
          onClick={() => navigate(item.url)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              navigate(item.url);
            }
          }}
        >
          <div className={`tw-w-12 tw-h-12 tw-flex tw-items-center tw-justify-center tw-rounded-[12px] ${item.isActive ? 'tw-bg-brand-100' : ''}`}>
            <item.icon fill={item.isActive ? '#7839EE' : 'none'} className={`tw-w-5 tw-h-5 ${item.isActive ? 'tw-text-brand-600' : 'tw-text-gray-500'}`} />
          </div>
          {item.title && <div className="tw-text-gray-700 tw-text-xs tw-font-normal tw-h-[18px]">{item.title}</div>}
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default Items;
