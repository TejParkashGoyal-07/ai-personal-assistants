"use client"
import { Button } from '@/components/ui/button'
import { AuthContext } from '@/context/AuthContext';
import { api } from '@/convex/_generated/api';
import { GetAuthUserData } from '@/services/GlobalAPI';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useMutation } from 'convex/react';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React, { useContext } from 'react'

function SignIn() {
    const CreateUser=useMutation(api.users.CreateUser)
    const {user,setUser}=useContext(AuthContext)
    const router=useRouter();
    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log(tokenResponse);
            if(typeof window!==undefined){
                localStorage.setItem("user_token",tokenResponse.access_token)

            }
            

            const user=await GetAuthUserData(tokenResponse.access_token);
            console.log(user)
            const result=await CreateUser({
                name:user?.name,
                email:user?.email,
                picture:user?.picture
            });
            console.log(result);
            setUser(result)
            router.replace("/ai-assistants")
        },
        onError: errorResponse => console.log(errorResponse),
    });
    return (
        <div className='flex items-center flex-col justify-center h-screen'>

            <div className=' flex flex-col items-center gap-10 border rounded-2xl p-10 shadow-md'>
                <Image src={'/logo.svg'}
                    alt="logo" height={50} width={50}
                />
                <h2 className='text-2xl'>Sign In To AI Personal Assistant &Agent </h2>
                <Button onClick={()=>googleLogin()}>Sign In With Email</Button>
            </div>
        </div>

    )
}

export default SignIn