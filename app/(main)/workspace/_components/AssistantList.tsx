'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AuthContext } from '@/context/AuthContext'
import { api } from '@/convex/_generated/api'
import { useConvex } from 'convex/react'
import React, { useContext, useEffect, useState } from 'react'
import { ASSISTANT } from '../../ai-assistants/page'
import AiAssistantsList from '@/services/AiAssistantsList'
import Image from 'next/image'
import { AssistantContext } from '@/context/AssistantContext'
import AddNewAssistant from './AddNewAssistant'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { LogOut, UserCircle2 } from 'lucide-react'
import Profile from './Profile'
  
function AssistantList() {
    const { user } = useContext(AuthContext);
    const convex = useConvex();
    const [assistantList, setAssistantList] = useState<ASSISTANT[]>([]);
    const { assistant, setAssistant } = useContext(AssistantContext);
    const[openProfile,setOpenProfile]=useState(false)
    useEffect(() => {
        if (user) {
            GetUserAssistants();
        }
    }, [user, assistant]);

    const GetUserAssistants = async () => {
        try {
            const result = await convex.query(api.userAiAssistant.GetAllUsersAssistants, { uid: user?._id });
            console.log(result);
            setAssistantList(result as unknown as ASSISTANT[]);
        } catch (error) {
            console.error("Error fetching assistants:", error);
        }
    };

    return (
        <div className='p-5 bg-secondary border-r-[1px] h-screen'>
            <h2 className='font-bold text-lg'>Your Personal AI Assistants</h2>

            <AddNewAssistant>
            <Button className='w-full mt-3'>+ Add New Assistant</Button>
            </AddNewAssistant>
            <Input className='bg-white mt-3' placeholder='Search' />
            
            <div className='mt-5'>
                {assistantList.map((assistant, index) => (
                    <div className='p-2 cursor-pointer flex gap-3 items-center hover:bg-gray-200 rounded-xl' key={index}>
                        <Image 
                            className="rounded-lg w-[60px] h-[60px] object-cover"  
                            src={assistant.image} 
                            alt={assistant.name} 
                            width={60} 
                            height={60} 
                        />
                        <div>
                            <h2 className='font-bold'>{assistant.name}</h2>
                            <h2 className='text-gray-600 dark:text-gray text-sm'>{assistant.title}</h2>
                        </div>
                    </div>
                ))}
            </div>

            
            <DropdownMenu>
  <DropdownMenuTrigger asChild>
  <div className='absolute bottom-10 flex gap-3 items-center hover:bg-gray-200 p-2 w-[90%] cursor-pointer rounded-xl'>
                <Image 
                    src={user?.picture || '/default-avatar.png'} 
                    alt='user' 
                    width={35} 
                    height={35} 
                    className='rounded-full' 
                />
                <div>
                    <h2 className='font-bold'>{user?.name}</h2>
                    <h2 className='text-gray-400 text-sm'>{user?.orderId ? "Pro Plan" : "Free Plan"}</h2>
                </div>
            </div>
  </DropdownMenuTrigger>
  <DropdownMenuContent className='w-[200px]'>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={()=>setOpenProfile(true)}><UserCircle2/>Profile</DropdownMenuItem>
    <DropdownMenuItem> <LogOut/> Logout</DropdownMenuItem>
    
   
  </DropdownMenuContent>
</DropdownMenu>
<Profile openDialog={openProfile}/>

        </div>
    );
}

export default AssistantList;
