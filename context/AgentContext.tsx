import { createContext, useContext, ReactNode, useState } from 'react';
import { Agent } from '@/types/agent';
import { sampleAgents } from '@/data/sampleData';

interface AgentContextType {
  agents: Agent[];
  getAgentById: (id: string) => Agent | undefined;
  addAgent: (agent: Omit<Agent, 'id'>) => void;
  updateAgent: (id: string, agent: Partial<Agent>) => void;
  deleteAgent: (id: string) => void;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export const AgentProvider = ({ children }: { children: ReactNode }) => {
  const [agents, setAgents] = useState<Agent[]>(sampleAgents);

  const getAgentById = (id: string) => {
    return agents.find(agent => agent.id === id);
  };

  const addAgent = (agent: Omit<Agent, 'id'>) => {
    const newAgent = {
      ...agent,
      id: Date.now().toString(),
    };
    setAgents(prev => [newAgent, ...prev]);
  };

  const updateAgent = (id: string, updates: Partial<Agent>) => {
    setAgents(prev =>
      prev.map(agent =>
        agent.id === id
          ? { ...agent, ...updates }
          : agent
      )
    );
  };

  const deleteAgent = (id: string) => {
    setAgents(prev => prev.filter(agent => agent.id !== id));
  };

  return (
    <AgentContext.Provider value={{ 
      agents, 
      getAgentById,
      addAgent,
      updateAgent,
      deleteAgent
    }}>
      {children}
    </AgentContext.Provider>
  );
};

export const useAgentContext = () => {
  const context = useContext(AgentContext);
  if (context === undefined) {
    throw new Error('useAgentContext must be used within an AgentProvider');
  }
  return context;
};