import React, { useContext, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import AiAssistantsList from '@/services/AiAssistantsList';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { ASSISTANT } from '../../ai-assistants/page';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import AiModelOptions from './AiModelOptions';
import { Textarea } from '@/components/ui/textarea';
import AssistantAvatar from './AssistantAvatar';
import { toast } from 'sonner';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { AuthContext } from '@/context/AuthContext';
import { AssistantContext } from '@/context/AssistantContext';
import { Loader2Icon } from 'lucide-react';

const DEFAULT_ASSISTANT = {
    image: '/bug-fixer.avif',
    name: "",
    title: '',
    instruction: '',
    id: 0,
    sampleQuestions: [],
    userInstruction: "",
    aiModelId: ''
};

function AddNewAssistant({ children }: any) {
    const [selectedAssistant, setSelectedAssistant] = useState<ASSISTANT>(DEFAULT_ASSISTANT);
    const AddAssistant=useMutation(api.userAiAssistant.InsertSelectedAssistant)
    const{user}=useContext(AuthContext)
    const[loading,setLoading]=useState(false)
    const{assistant,setAssistant}=useContext(AssistantContext)
    const onHandleInputChange = (field: string, value: string) => {
        setSelectedAssistant((prev) => ({
            ...prev,
            [field]: value
        }));
    };
    const onSave=async()=>{
        if(!selectedAssistant?.name||!selectedAssistant.title||!selectedAssistant.userInstruction){
            toast("Enter All Details")
            return 

        }
        setLoading(true)
        const result=await AddAssistant({
            records:[selectedAssistant],
            uid:user?._id
        })
        toast('New Assistant Added')
        setAssistant(null)
        setLoading(false)

    }

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Assistant</DialogTitle>
                    <DialogDescription asChild>
                        <div className='grid grid-cols-3 gap-5 mt-5'>
                            {/* Left Side - Assistant List */}
                            <div className='mt-5'>
                                <Button 
                                    variant='secondary' 
                                    size='sm' 
                                    onClick={() => setSelectedAssistant(DEFAULT_ASSISTANT)} 
                                    className='w-full'
                                >
                                    + Create New Assistant
                                </Button>
                                <div className='mt-2'>
                                    {AiAssistantsList.map((assistant, index) => (
                                        <div 
                                            key={index} 
                                            className='p-2 hover:bg-secondary flex gap-2 items-center rounded-xl cursor-pointer border border-gray-300'
                                            onClick={() => setSelectedAssistant(assistant)}
                                        >
                                            <Image
                                                src={assistant.image}
                                                width={60}
                                                height={60}
                                                alt={assistant.name}
                                                className='w-[35px] h-[35px] object-cover rounded-lg'
                                            />
                                            <h2 className='text-xs'>{assistant.title}</h2>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Side - Form */}
                            <div className='col-span-2 border border-gray-300 p-4 rounded-lg'>
                                <div className='flex gap-5'>
                                    <div>
                                        {selectedAssistant && (
                                            <AssistantAvatar selectedImage={(v:any) => onHandleInputChange('image', v)}>
                                                <Image 
                                                    src={selectedAssistant.image || '/default-image.png'} 
                                                    alt='Assistant' 
                                                    width={150} 
                                                    height={150} 
                                                    className='w-[100px] h-[100px] rounded-xl cursor-pointer object-cover'
                                                />
                                            </AssistantAvatar>
                                        )}
                                    </div>
                                    <div className='flex flex-col gap-3 w-full'>
                                        <Input 
                                            placeholder='Name of the Assistant' 
                                            className='w-full' 
                                            value={selectedAssistant.name} 
                                            onChange={(e) => onHandleInputChange('name', e.target.value)}
                                        />
                                        <Input 
                                            placeholder='Title Of Assistant' 
                                            className='w-full' 
                                            value={selectedAssistant.title} 
                                            onChange={(e) => onHandleInputChange('title', e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* AI Model Selection */}
                                <div className='mt-4'>
                                    <h2>Model:</h2>
                                    <Select 
                                        defaultValue={selectedAssistant.aiModelId} 
                                        onValueChange={(value) => onHandleInputChange('aiModelId', value)}
                                    >
                                        <SelectTrigger className="w-full bg-white">
                                            <SelectValue placeholder="Select Model" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {AiModelOptions.map((model, index) => (
                                                <SelectItem key={index} value={model.name}>
                                                    <div className='flex gap-2 items-center m-1'>
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

                                {/* Instructions Section */}
                                <div className='mt-4'>
                                    <h2 className='text-gray-500'>Instruction:</h2>
                                    <Textarea 
                                        className='h-[200px]'
                                        placeholder='Add Instructions'
                                        value={selectedAssistant.userInstruction}
                                        onChange={(e) => onHandleInputChange('userInstruction', e.target.value)}
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-5 justify-end mt-10">
                                    <Button variant="outline">Cancel</Button>
                                    <Button onClick={onSave} disabled={loading}>{loading&&<Loader2Icon className='animate-spin'/>}Add</Button>
                                </div>
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

export default AddNewAssistant;
