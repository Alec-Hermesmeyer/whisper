'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatWithVoice } from '@/hooks/useChatWithVoice';
import { Send, Mic, StopCircle } from 'lucide-react';


type Message = {
  role: 'user' | 'assistant';
  content: string;
  isList?: boolean;
  listItems?: string[];
};

export function LegalAIAssistant() {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { 
    input, 
    handleInputChange, 
    isRecording, 
    startRecording, 
    stopRecording 
  } = useChatWithVoice();

  const formatResponse = (text: string): Message => {
    const listRegex = /\d+\.\s+/g;
    const matches = text.match(listRegex);

    if (matches && matches.length > 1) {
      const splitText = text.split(listRegex);
      const title = splitText[0].trim();
      const listItems = splitText.slice(1).map((item) => item.trim());

      return { role: 'assistant', content: title, isList: true, listItems };
    }

    return { role: 'assistant', content: text };
  };

  const sendTextMessage = async (text: string) => {
    if (!text.trim()) return;
  
    setConversation((prev) => [...prev, { role: 'user', content: text }]);
    setIsLoading(true);
    const systemMessage = {
      role: "system",
      content: "You are a friendly and approachable legal assistant who provides helpful and professional answers in a conversational tone.",
    };
  
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are a legal assistant chatbot.' },systemMessage,
            ...conversation,
            { role: 'user', content: text },
          ],
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Chat API Error:', errorData);
        throw new Error(errorData.error || 'Failed to fetch response');
      }
  
      const botResponse = await response.json();
      if (botResponse?.text) {
        const formattedResponse = formatResponse(botResponse.text);
        setConversation((prev) => [...prev, formattedResponse]);
      } else {
        throw new Error('Invalid response format from the chat API');
      }
    } catch (error) {
      console.error('Error sending text message:', error);
      setConversation((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, there was an error processing your request.' },
      ]);
    } finally {
      setIsLoading(false);
      handleInputChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>); // Clear the input field
    }
  };
  

  return (
    <div className="grid grid-cols-1 gap-6 p-8 max-w-3xl mx-auto">
      <div className="flex flex-col rounded-xl shadow-lg bg-gray-50">
        <div className="py-6 px-4">
          <ScrollArea className="h-[600px] p-6 bg-gray-200 rounded-lg overflow-y-auto shadow-inner">
            {conversation.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`mb-4 flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <motion.div
                  whileHover={{ scale: message.role === 'user' ? 1.02 : 1 }}
                  className={`max-w-2xl px-4 py-6 rounded-lg shadow ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-black'
                  }`}
                >
                  {message.isList ? (
                    <>
                      <p className="font-semibold mb-2 text-lg">{message.content}</p>
                      <ul className="space-y-2">
                        {message.listItems?.map((item, i) => (
                          <li key={i} className="flex items-center space-x-2 space-y-4 mb-2">
                            
                            <span className='ml-2 text-sm'>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p className="text-sm">{message.content}</p>
                  )}
                </motion.div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="max-w-sm px-4 py-2 rounded-lg shadow bg-gray-300 text-black">
                  Typing...
                </div>
              </motion.div>
            )}
          </ScrollArea>
          <div className="flex items-center mt-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="flex-grow mr-4"
            >
              <Input
                value={input}
                onChange={(e) => handleInputChange(e)}
                placeholder="Type your message..."
                disabled={isRecording}
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => sendTextMessage(input)}
                size="icon"
                disabled={isLoading || isRecording}
              >
                <Send className="h-5 w-5" />
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`ml-4 flex items-center justify-center rounded-full w-10 h-10 ${
                isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-300 text-black'
              }`}
            >
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                size="icon"
              >
                {isRecording ? <StopCircle className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
