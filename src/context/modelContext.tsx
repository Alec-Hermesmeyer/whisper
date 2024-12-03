// "use client";
// import React, { createContext, useState, useContext } from 'react';

// interface ModelContextType {
//   isLoading: boolean;
//   error: string | null;
//   whisperPipeline: any;
//   toxicityModel: any;
// }

// const ModelContext = createContext<ModelContextType | undefined>(undefined);



// export const ModelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [whisperPipeline, setWhisperPipeline] = useState<any>(null);
//   const [toxicityModel, setToxicityModel] = useState<any>(null);
  

  


//   return (
//     <ModelContext.Provider value={{ isLoading, error, whisperPipeline, toxicityModel }}>
//       {children}
//     </ModelContext.Provider>
//   );
// };

// export const useModelContext = () => {
//   const context = useContext(ModelContext);
//   if (!context) {
//     throw new Error('useModelContext must be used within a ModelProvider');
//   }
//   return context;
// };


