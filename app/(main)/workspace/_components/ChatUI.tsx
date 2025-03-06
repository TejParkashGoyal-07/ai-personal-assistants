import { Input } from '@/components/ui/input';
import EmptyChatState from './EmptyChatState'

import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

function ChatUi() {
    return (
        <div className='mt-20 p-6 relative h-[88vh]'>
            <EmptyChatState />

            <div className='flex justify-between p-5 gap-5 absolute bottom-5 w-[94%]'>
                <Input placeholder='Chat Here With AI Assistant...' />
                <Button>
                    <Send />
                </Button>
            </div>
        </div>
    );
}

export default ChatUi;
