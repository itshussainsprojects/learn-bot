import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import {
  Send,
  Sparkles,
  User,
  Loader2,
  BookOpen,
  Code,
  Lightbulb,
  HelpCircle,
  History,
  Trash2,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { chatAPI, ChatMessage } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  { icon: Code, text: 'Explain closures in JavaScript' },
  { icon: BookOpen, text: 'How do React hooks work?' },
  { icon: Lightbulb, text: 'Best practices for TypeScript' },
  { icon: HelpCircle, text: 'What is the virtual DOM?' },
];

const defaultMessage: Message = {
  id: '1',
  role: 'assistant',
  content: "Hi! I'm LearnBotX, your AI learning assistant! 🚀\n\nI can help you understand programming concepts, debug code, and guide you through your learning journey. What would you like to learn today?",
  timestamp: new Date(),
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([defaultMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ _id: string; title: string; updatedAt: string }>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history on mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const history = await chatAPI.getHistory();
      setChatHistory(history);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const handleSend = async (text?: string) => {
    const message = text || input;
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Send message to backend
      const response = await chatAPI.sendMessage(message, currentChatId || undefined);

      // Update chat ID for conversation continuity
      if (response.chatId) {
        setCurrentChatId(response.chatId);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message.content,
        timestamp: new Date(response.message.timestamp),
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Refresh chat history
      loadChatHistory();
    } catch (error: any) {
      console.error('Chat error:', error);

      // Fallback response if backend is unavailable
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting to the server right now. Please make sure the backend server is running on http://localhost:5000.\n\nTo start the server:\n```bash\ncd server\nnpm install\nnpm run dev\n```",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, fallbackMessage]);

      toast({
        title: "Connection Error",
        description: "Could not connect to the AI server. Using offline mode.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = () => {
    setMessages([defaultMessage]);
    setCurrentChatId(null);
  };

  const loadChat = async (chatId: string) => {
    try {
      const chat = await chatAPI.getChat(chatId);
      setCurrentChatId(chatId);
      setMessages(chat.messages.map((m: ChatMessage, i: number) => ({
        id: i.toString(),
        role: m.role,
        content: m.content,
        timestamp: new Date(m.timestamp),
      })));
      setShowHistory(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load chat",
        variant: "destructive",
      });
    }
  };

  const deleteChat = async (chatId: string) => {
    try {
      await chatAPI.deleteChat(chatId);
      setChatHistory((prev) => prev.filter(c => c._id !== chatId));
      if (currentChatId === chatId) {
        startNewChat();
      }
      toast({
        title: "Chat deleted",
        description: "The conversation has been removed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete chat",
        variant: "destructive",
      });
    }
  };

  // Format message content with markdown-like styling
  const formatContent = (content: string) => {
    // Simple markdown parsing for display
    return content.split('\n').map((line, i) => {
      // Code blocks
      if (line.startsWith('```')) {
        return null; // Skip code block markers
      }

      // Bold text
      line = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

      // Inline code
      line = line.replace(/`(.+?)`/g, '<code class="text-primary bg-primary/10 px-1 rounded">$1</code>');

      return (
        <span key={i} className="block" dangerouslySetInnerHTML={{ __html: line || '<br/>' }} />
      );
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 pb-4 flex flex-col">
        <div className="container mx-auto px-4 flex-1 flex flex-col max-w-4xl">
          {/* Header */}
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">AI Tutor</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={startNewChat}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                New Chat
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="gap-2"
              >
                <History className="w-4 h-4" />
                History
              </Button>
            </div>
          </div>

          {/* Chat History Sidebar */}
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-card p-4 mb-4 overflow-hidden"
              >
                <h3 className="font-semibold mb-3">Recent Conversations</h3>
                {chatHistory.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No previous conversations</p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {chatHistory.map((chat) => (
                      <div
                        key={chat._id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer group"
                        onClick={() => loadChat(chat._id)}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{chat.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(chat.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteChat(chat._id);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-primary-foreground" />
                    </div>
                  )}

                  <div className={`max-w-[80%] ${message.role === 'user' ? 'order-1' : ''}`}>
                    <div className={`rounded-2xl p-4 ${message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'glass-card rounded-bl-md'
                      }`}>
                      <div className="text-sm leading-relaxed">
                        {formatContent(message.content)}
                      </div>
                    </div>
                    <span className={`text-xs text-muted-foreground mt-1 block ${message.role === 'user' ? 'text-right' : ''
                      }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {message.role === 'user' && (
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="glass-card rounded-2xl rounded-bl-md p-4">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-3 text-center">Suggested questions</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {suggestedQuestions.map((q, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => handleSend(q.text)}
                    className="glass-card p-3 text-left hover:bg-white/10 transition-colors flex items-center gap-3 text-sm"
                  >
                    <q.icon className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{q.text}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="glass-card p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-3"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about your learning..."
                className="flex-1 h-12 bg-white/5 border-white/10 focus:border-primary"
                disabled={isLoading}
              />
              <Button
                type="submit"
                variant="hero"
                size="icon"
                className="h-12 w-12"
                disabled={!input.trim() || isLoading}
              >
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
