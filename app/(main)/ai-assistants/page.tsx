'use client';
import { BlurFade } from '@/components/magicui/blur-fade';
import { RainbowButton } from '@/components/magicui/rainbow-button';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { AuthContext } from '@/context/AuthContext';
import { api } from '@/convex/_generated/api';
import AiAssistantsList from '@/services/AiAssistantsList';
import { useConvex, useMutation } from 'convex/react';
import { Loader, Loader2Icon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import React, { useContext, useEffect, useState } from 'react';

export type ASSISTANT = {
  id: number;
  name: string;
  title: string;
  image: string;
  instruction: string;
  userInstruction: string;
  sampleQuestions: string[];
  aiModelId?:string
};

function AIAssistants() {
  const [selectedAssistant, setSelectedAssistant] = useState<ASSISTANT[]>([]);
  const insertAssistant=useMutation(api.userAiAssistant.InsertSelectedAssistant);
  const {user}=useContext(AuthContext)
  const[loading,setLoading]=useState(false)
  const router=useRouter();
  const convex=useConvex();
  useEffect(()=>{user&&GetUserAssistants()},[user])
  const GetUserAssistants=async()=>{
    const result=await convex.query(api.userAiAssistant.GetAllUsersAssistants,{uid:user?._id});
    console.log(result)
    if(result.length>0){
      router.replace('/worksapce')
      return;
    }
  }
  const onSelect = (assistant: ASSISTANT) => {
    const item = selectedAssistant.find((item: ASSISTANT) => item.id === assistant.id);
    if (item) {
      setSelectedAssistant(selectedAssistant.filter((item: ASSISTANT) => item.id !== assistant.id));
    } else {
      setSelectedAssistant(prev => [...prev, assistant]);
    }
  };

  const isSelected = (assistant: ASSISTANT) => {
    return selectedAssistant.some((item: ASSISTANT) => item.id === assistant.id);
  };
  const OnClickContinue=async()=>{
    setLoading(true)
    const result=await insertAssistant({
      records:selectedAssistant,
      uid:user?._id
    })
    setLoading(false)
    console.log(result);
    
  }
  return (
    <div className='px-10 mt-20 md:px-28 lg:px-36 xl:px-48'>
      {/* Text Content */}
      <div>
        <h2 className='text-3xl font-bold'>Welcome To The World Of AI Assistants.</h2>
        <p className='text-xl mt-2'>Choose Your AI Companion for Specific Task</p>
      </div>

      {/* Button aligned to the right */}
      <div className='flex justify-end mt-4'>
        <Button onClick={OnClickContinue}>{loading&&<Loader2Icon className='animate-spin mr-2'/>}Continue</Button>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5'>
        {AiAssistantsList.map((assistant, index) => (
          <BlurFade key={assistant.id} delay={0.25 + index * 0.05} inView>
            <div
              className='hover:border p-3 rounded-xl hover:scale-105 transition-full relative ease-in-out cursor-pointer'
              onClick={() => onSelect(assistant)}
            >
              <Checkbox
                checked={isSelected(assistant)}
                className='absolute m-2'
                aria-label={`Select ${assistant.name}`}
              />

              <Image
                src={assistant.image}
                alt={assistant.title}
                width={400}
                height={400}
                className='rounded-xl w-full h-[200px] object-cover mt-5'
              />
              <h2 className='text-center font-bold text-lg'>{assistant.name}</h2>
              <h2 className='text-center text-gray-600 dark:text-gray-300'>{assistant.title}</h2>
            </div>
          </BlurFade>
        ))}
      </div>
      
    </div>
  );
}

export default AIAssistants;