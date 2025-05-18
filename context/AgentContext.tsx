// context/AgentContext.tsx
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Agent } from '@/types/agent';
import { sampleAgents } from '@/data/sampleData';

interface AgentContextType {
  agents: Agent[];
  defaultAgentId: string | null;
  getAgentById: (id: string) => Agent | undefined;
  addAgent: (agent: Omit<Agent, 'id'>) => void;
  updateAgent: (id: string, agent: Partial<Agent>) => void;
  deleteAgent: (id: string) => void;
  setDefaultAgent: (id: string | null) => void;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);
const DEFAULT_AGENT_KEY = '@default_agent';

export const AgentProvider = ({ children }: { children: ReactNode }) => {
  const [agents, setAgents] = useState<Agent[]>(sampleAgents);
  const [defaultAgentId, setDefaultAgentId] = useState<string | null>(null);

  useEffect(() => {
    loadDefaultAgent();
  }, []);

  const loadDefaultAgent = async () => {
    try {
      const savedDefaultAgent = await AsyncStorage.getItem(DEFAULT_AGENT_KEY);
      if (savedDefaultAgent) {
        setDefaultAgentId(savedDefaultAgent);
      }
    } catch (error) {
      console.error('Error loading default agent:', error);
    }
  };

  const setDefaultAgent = async (id: string | null) => {
    try {
      if (id) {
        await AsyncStorage.setItem(DEFAULT_AGENT_KEY, id);
      } else {
        await AsyncStorage.removeItem(DEFAULT_AGENT_KEY);
      }
      setDefaultAgentId(id);
    } catch (error) {
      console.error('Error saving default agent:', error);
    }
  };

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
    if (defaultAgentId === id) {
      setDefaultAgent(null);
    }
    setAgents(prev => prev.filter(agent => agent.id !== id));
  };

  return (
    <AgentContext.Provider value={{ 
      agents, 
      defaultAgentId,
      getAgentById,
      addAgent,
      updateAgent,
      deleteAgent,
      setDefaultAgent
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
