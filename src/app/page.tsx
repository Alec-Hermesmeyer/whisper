import { LegalAIAssistant } from '@/components/legal-ai-assistant'
import {ModelProvider} from '@/context/modelContext'

export default function LegalAIAssistantPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Legal AI Assistant</h1>
      
      <LegalAIAssistant />
    
    </div>
  )
}
