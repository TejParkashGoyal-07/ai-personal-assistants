'use client'
import React, { useContext, useEffect } from 'react'
import Header from './_components/Header'
import { GetAuthUserData } from '@/services/GlobalAPI';
import { useRouter } from 'next/navigation';
import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { AuthContext } from '@/context/AuthContext';
import { AssistantContext } from '@/context/AssistantContext';

function Provider({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    
    const router=useRouter();
    const convex=useConvex();
    const{user,setUser}=useContext(AuthContext)
    useEffect(()=>{
        CheckUserAuth();
    },[])
    const CheckUserAuth=async()=>{
        const token=localStorage.getItem('user_token');
        const user=token&&await GetAuthUserData(token!);
        if(!user?.email){
            router.replace('/sign-in');
            return ;
        }
        try{
                const result=await convex.query(api.users.GetUser,{
                    email:user?.email
                })
                setUser(result)
        }catch(e){

        }
        

    }
  return (
    <div>
        <AssistantContext.Provider value={{}}>
        <Header/>
        {children}
        </AssistantContext.Provider>
        </div>
  )
}

export default Provider