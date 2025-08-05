import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Agent } from '@/types/agent';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

interface AgentContextType {
  agents: Agent[];
  loading: boolean;
  defaultAgentId: string | null;
  getAgentById: (id: string) => Agent | undefined;
  addAgent: (agent: Omit<Agent, 'id'>) => void;
  updateAgent: (id: string, agent: Partial<Agent>) => void;
  deleteAgent: (id: string) => void;
  setDefaultAgent: (id: string | null) => void;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export const AgentProvider = ({ children }: { children: ReactNode }) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [defaultAgentId, setDefaultAgentId] = useState<string | null>(null);
  const { user } = useAuth();

  // Load agents when user changes
  useEffect(() => {
    if (user && !user.isGuest) {
      loadAgents();
    } else {
      // For guests, use sample data
      setAgents([
        {
          id: 'sample-1',
          name: 'Assistant',
          instructions: 'You are a helpful AI assistant that can answer general questions and provide information.',
          model: 'gpt-4.1-nano',
          apiKeyId: 'sample-1',
          color: '#3B82F6',
          tags: ['Helpful', 'Informative', 'General'],
          temperature: 1.0,
          maxTokens: 1000
        },
        {
          id: 'sample-2',
          name: 'Creative',
          instructions: 'You are a creative AI that helps with writing, storytelling, and generating creative content.',
          model: 'gpt-4.1-nano',
          apiKeyId: 'sample-1',
          color: '#8B5CF6',
          tags: ['Creative', 'Writing', 'Storytelling'],
          temperature: 0.9,
          maxTokens: 2000
        }
      ]);
    }
  }, [user]);

  const loadAgents = async () => {
    if (!user || user.isGuest) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedAgents: Agent[] = data.map(agent => ({
        id: agent.id,
        name: agent.name,
        instructions: agent.instructions,
        model: agent.model,
        apiKeyId: agent.api_key_id,
        color: agent.color,
        tags: agent.tags,
        temperature: agent.temperature,
        maxTokens: agent.max_tokens,
      }));

      setAgents(formattedAgents);
    } catch (error) {
      console.error('Error loading agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const setDefaultAgent = async (id: string | null) => {
    if (!user || user.isGuest) {
      // For guests, store in local state only
      setDefaultAgentId(id);
      return;
    }

    try {
      // Store default agent preference in user metadata or separate table
      // For now, we'll just store it locally
      setDefaultAgentId(id);
    } catch (error) {
      console.error('Error saving default agent:', error);
    }
  };

  const getAgentById = (id: string) => {
    return agents.find(agent => agent.id === id);
  };

  const addAgent = async (agent: Omit<Agent, 'id'>) => {
    if (!user || user.isGuest) {
      // For guests, add to local state only
      const newAgent = {
        ...agent,
        id: Date.now().toString(),
      };
      setAgents(prev => [newAgent, ...prev]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('agents')
        .insert({
          user_id: user.id,
          name: agent.name,
          instructions: agent.instructions,
          model: agent.model,
          api_key_id: agent.apiKeyId,
          color: agent.color,
          tags: agent.tags,
          temperature: agent.temperature,
          max_tokens: agent.maxTokens,
        })
        .select()
        .single();

      if (error) throw error;

      const newAgent: Agent = {
        id: data.id,
        name: data.name,
        instructions: data.instructions,
        model: data.model,
        apiKeyId: data.api_key_id,
        color: data.color,
        tags: data.tags,
        temperature: data.temperature,
        maxTokens: data.max_tokens,
      };

      setAgents(prev => [newAgent, ...prev]);
    } catch (error) {
      console.error('Error adding agent:', error);
      throw error;
    }
  };

  const updateAgent = async (id: string, updates: Partial<Agent>) => {
    if (!user || user.isGuest) {
      // For guests, update local state only
      setAgents(prev =>
        prev.map(agent =>
          agent.id === id
            ? { ...agent, ...updates }
            : agent
        )
      );
      return;
    }

    try {
      const { error } = await supabase
        .from('agents')
        .update({
          name: updates.name,
          instructions: updates.instructions,
          model: updates.model,
          api_key_id: updates.apiKeyId,
          color: updates.color,
          tags: updates.tags,
          temperature: updates.temperature,
          max_tokens: updates.maxTokens,
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setAgents(prev =>
        prev.map(agent =>
          agent.id === id
            ? { ...agent, ...updates }
            : agent
        )
      );
    } catch (error) {
      console.error('Error updating agent:', error);
      throw error;
    }
  };

  const deleteAgent = async (id: string) => {
    if (defaultAgentId === id) {
      setDefaultAgent(null);
    }

    if (!user || user.isGuest) {
      // For guests, remove from local state only
      setAgents(prev => prev.filter(agent => agent.id !== id));
      return;
    }

    try {
      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setAgents(prev => prev.filter(agent => agent.id !== id));
    } catch (error) {
      console.error('Error deleting agent:', error);
      throw error;
    }
  };

  return (
    <AgentContext.Provider value={{ 
      agents,
      loading,
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