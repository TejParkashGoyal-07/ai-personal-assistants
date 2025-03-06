'use client'
import { AssistantContext } from '@/context/AssistantContext'
import Image from 'next/image'
import React, { useContext, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import AiModelOptions from './AiModelOptions'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Loader2Icon, Save, Trash } from 'lucide-react'
import { ASSISTANT } from '../../ai-assistants/page'
import { api } from '@/convex/_generated/api'
import { useMutation } from 'convex/react'
import { toast } from 'sonner'
import ConfirmAlert from '../ConfirmAlert'
  
function AssistantSettings() {
    const{assistant,setAssistant}=useContext(AssistantContext)
    const UpdateAssistant=useMutation(api.userAiAssistant.UpdateUserAiAssistant)
    const DeleteAssistant=useMutation(api.userAiAssistant.DeleteAIAssistant)
    const[loading,setLoading]=useState(false)
    const handleInputChange=(feild:string,value:string)=>{
      setAssistant((prev:any)=>({
        ...prev,
        [feild]:value
      }))
    }
    const OnSave=async()=>{
      setLoading(true)
      const result=await UpdateAssistant({
        id:assistant?._id,
        aiModelId:assistant?.aiModelId,
        userInstruction:assistant?.userInstruction
      })
      toast("Saved!")
      setLoading(false)
    }
    const OnDelete=async()=>{
      setLoading(true)
      await DeleteAssistant({
        id:assistant?._id,

      })
      setAssistant(null)
      setLoading(false)
    }
  return assistant&& (
    <div className='p-5 bg-secondary border-l-[1px] h-screen'>
        <h2 className='font-bold text-2xl'>Settings</h2>
        <div className='mt-4 flex gap-3'>
            <Image
            src={assistant?.image}
            alt="Assistant"
            width={100}
            height={100}
            className='rounded-xl h-[80px] w-[80px]'
            />
            <div>
                <h2 className='font-bold'>{assistant?.name}</h2>
                <p className='text-gray-700'>{assistant?.title}</p>
            </div>
            
        </div>
        
        <div className='mt-4'>
                <h2>Model:</h2>
                <Select defaultValue={assistant.aiModelId} onValueChange={(value)=>handleInputChange('aiModelId',value)}>
  <SelectTrigger className="w-full bg-white">
    <SelectValue placeholder="Select Model" />
  </SelectTrigger>
  <SelectContent>
    {AiModelOptions.map((model,index)=>(
        <SelectItem value={model.name}>
            <div key={index} className='flex gap-2 items-center m-1'>
                <Image
                src={model.logo}
                alt={model.name}
                width={20}
                height={20}
                className="rounded-md"
                />
                <h2>{model.name}</h2>
            </div>
        </SelectItem>
    ))}
    
  </SelectContent>
</Select>

            </div>
            <div className='mt-4'>
                <h2 className='text-gray-500'>Instrucutions:</h2>
                <Textarea className='h-[180px] bg-white' placeholder='Add Instrucutions' value={assistant.userInstruction} onChange={(e)=>handleInputChange('userInstructions',e.target.value)}/>
            </div>
            <div className='absolute bottom-10 right-5 flex gap-5'>
              <ConfirmAlert OnDelete={OnDelete}>
              <Button disabled={loading} variant='ghost'><Trash/>Delete</Button>
              </ConfirmAlert>
                
                <Button  disabled={loading} onClick={OnSave}>{loading?<Loader2Icon className='animate-spin'/>:<Save/>}Save</Button>
            </div>
        </div>
    
  )
}

export default AssistantSettings