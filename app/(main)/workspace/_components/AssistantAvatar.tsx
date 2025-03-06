import React from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import AiAssistantsList from '@/services/AiAssistantsList'
import Image from 'next/image'
function AssistantAvatar({children}:any,selectedImage:any) {
  return (
    <Popover>
  <PopoverTrigger>{children}</PopoverTrigger>
  <PopoverContent>
    <div className='grid gris-cols-5 gap-2'>
        {AiAssistantsList.map((assistant,index)=>(
            <Image key={index}
            src={assistant.image} alt={assistant.name}
            width={80}
            height={80}
            className='w-[30px] h-[30px] rounded-lg object-cover'
            onClick={()=>selectedImage(assistant.image)}
            />
        ))}
    </div>
  </PopoverContent>
</Popover>

  )
}

export default AssistantAvatar