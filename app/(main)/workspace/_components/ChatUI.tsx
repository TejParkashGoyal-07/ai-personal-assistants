import { Input } from '@/components/ui/input';
import EmptyChatState from './EmptyChatState';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useContext, useEffect, useRef, useState } from 'react';
import AiModelOptions from './AiModelOptions';
import { AssistantContext } from '@/context/AssistantContext';
import axios from 'axios';
import Image from 'next/image';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { AuthContext } from '@/context/AuthContext';
import { ASSISTANT } from '../../ai-assistants/page';

type MESSAGE = {
    role: string;
    content: string;
};

function ChatUi() {
    const UpdateTokens=useMutation(api.users.UpdateTokens)
    const{user,setUser}=useContext(AuthContext)
    const [input, setInput] = useState<string>("");
    const { assistant } = useContext(AssistantContext);
    const [messages, setMessages] = useState<MESSAGE[]>([]);
    const [loading, setLoading] = useState(false);
    const chatRef=useRef<any>(null)
    const onSendMessage = async () => {
        if (!input.trim() || loading) return; // Prevent sending empty messages or multiple API calls
        
        setLoading(true);
        setMessages((prev) => [...prev, 
            
        { role: 'user', 
        content: input 
        },
        {
            role:'assistant',
            content:'Loading....'
        }

        ]);
        
        const userInput = input;
        setInput('');

        const AiModel = AiModelOptions.find(item => item.name === assistant.aiModelId);

        try {
            const result = await axios.post('/api/eden-ai-model', {
                provider: AiModel?.edenAi,
                userInput: userInput,
                aiResp:messages[messages?.length-1]?.content
            });
            setMessages(prev=>prev.slice(0,-1))
            setMessages((prev) => [...prev, result.data]);
            updateUserToken(result.data?.content)
        } catch (error) {
            console.error("Error fetching AI response:", error);
        } finally {
            setLoading(false);
        }
    };
    const updateUserToken=async(resp:string)=>{
        const tokenCount=resp&&resp.trim()?resp.trim().split(/\s+/).length:0;
        console.log(tokenCount)
        const result=await UpdateTokens({
            credits:user?.credits-tokenCount,
            uid:user?._id
        })
        setUser((prev:ASSISTANT)=>({
            ...prev,
            credits:user?.credits-tokenCount
        }))
        console.log(result)

    }
    useEffect(()=>{
        if(chatRef.current){
            chatRef.current.scrollTop=chatRef.current.scrollHeight
        }
    },[messages])
    useEffect(()=>{
        setMessages([]);
    },[assistant?.id])
    return (
        <div className="mt-20 p-6 relative h-[88vh]">
            {messages.length === 0 && <EmptyChatState />}

            <div ref={chatRef} className='h-[75vh] overflow-scroll'>
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className='flex gap-3 items-center'>
                            {msg.role === 'assistant' && (
                                <Image
                                    src={assistant.image}
                                    alt='assistant'
                                    width={30}
                                    height={30}
                                    className='w-[30px] h-[30px] rounded-full object-cover'
                             />
                            )}
                            <div className={`p-3 rounded-lg ${msg.role === 'user' ? 'bg-gray-200 text-black' : 'bg-gray-500 text-white'}`}>
                                {msg.content}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Show Loader2 animation when waiting for response */}
                {loading && (
                    <div className="flex justify-start gap-3 items-center mt-2">
                        <Image
                            src={assistant.image}
                            alt='assistant'
                            width={30}
                            height={30}
                            className='w-[30px] h-[30px] rounded-full object-cover'
                        />
                        <div className="p-3 rounded-lg bg-gray-500 text-white flex items-center gap-2">
                            <Loader2 className="animate-spin" size={20} />
                            <span>Typing...</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-between p-5 gap-5 absolute bottom-5 w-[94%]">
                <Input
                    placeholder="Chat Here With AI Assistant..."
                    onKeyDown={(e) => e.key === 'Enter' && onSendMessage()}
                    value={input}
                    
                    onChange={(event) => setInput(event.target.value)}
                    disabled={loading} // Disable input while waiting
                />
                <Button onClick={onSendMessage} disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : <Send />}
                </Button>
            </div>
        </div>
    );
}

export default ChatUi;
