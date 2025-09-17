import { Sidebar } from 'shared/Components/ui/sidebar';
import { cn } from 'shared/lib/utils';

const ChatBoxContainer = () => (
  <Sidebar
    side="right"
    collapsible="offcanvas"
    className={cn(
      'tw-w-[352px] tw-right-3',
      'tw-py-3',
    )}
  >
    <div
      className={cn(
        'tw-z-10 tw-h-full',
        'tw-p-8',
        'tw-border tw-border-white tw-border-solid',
        'tw-rounded-[20px]',
        'tw-shadow-[0px_2px_4px_-2px_#1018280F,0px_4px_8px_-2px_#1018281A]',
        'tw-flex tw-flex-col tw-gap-8',
      )}
    >
      Chatbox
    </div>
  </Sidebar>
);

export default ChatBoxContainer;
