import { BlurFade } from '@/components/magicui/blur-fade'
import { SparklesText } from '@/components/magicui/sparkles-text'
import { AssistantContext } from '@/context/AssistantContext'
import { ChevronRight } from 'lucide-react'
import React, { useContext } from 'react'

function EmptyChatState() {
    const { assistant, setAssistant } = useContext(AssistantContext)

    return (
        <div className="flex flex-col items-center">
            <SparklesText className="text-4xl text-center" text="How Can I Assist You Today!!!" />
            <div className="mt-7">
                {assistant?.sampleQuestions.map((suggestion: string, index: number) => (
                    <BlurFade key={index} delay={0.25 * index}>
                        <div>
                            <h2 className="p-4 flex items-center justify-between gap-8 text-lg border mt-1 rounded-xl hover:bg-gray-300 cursor-pointer">
                                {suggestion}
                                <ChevronRight />
                            </h2>
                        </div>
                    </BlurFade>
                ))}
            </div>
        </div>
    )
}

export default EmptyChatState
