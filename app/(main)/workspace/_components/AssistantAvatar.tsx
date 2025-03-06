import React from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import AiAssistantsList from '@/services/AiAssistantsList';
import Image from 'next/image';

interface AssistantAvatarProps {
    children: React.ReactNode;
    selectedImage: (image: string) => void;
}

function AssistantAvatar({ children, selectedImage }: AssistantAvatarProps) {
    return (
        <Popover>
            <PopoverTrigger>{children}</PopoverTrigger>
            <PopoverContent>
                <div className='grid grid-cols-5 gap-2'>
                    {AiAssistantsList.map((assistant, index) => (
                        <Image
                            key={index}
                            src={assistant.image}
                            alt={assistant.name}
                            width={80}
                            height={80}
                            className='w-[30px] h-[30px] rounded-lg object-cover cursor-pointer'
                            onClick={() => selectedImage(assistant.image)}
                        />
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default AssistantAvatar;
