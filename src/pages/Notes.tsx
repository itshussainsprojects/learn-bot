import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import {
  FileText,
  Search,
  Trash2,
  BookOpen,
  Clock,
  Tag,
  Sparkles,
  Plus,
  Pin,
  Loader2,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { notesAPI, Note } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const topics = ['All Topics', 'javascript', 'react', 'typescript', 'general', 'quiz'];

const topicColors: Record<string, string> = {
  javascript: 'bg-yellow-500/20 text-yellow-500',
  react: 'bg-cyan-500/20 text-cyan-500',
  typescript: 'bg-blue-500/20 text-blue-500',
  general: 'bg-purple-500/20 text-purple-500',
  quiz: 'bg-green-500/20 text-green-500',
};

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All Topics');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '', category: 'general' });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const data = await notesAPI.getAll();
      setNotes(data);
    } catch (error) {
      console.error('Failed to load notes:', error);
      // Use empty array if API fails
      setNotes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createNote = async () => {
    if (!newNote.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a note title",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const note = await notesAPI.create(newNote);
      setNotes([note, ...notes]);
      setNewNote({ title: '', content: '', category: 'general' });
      setShowCreateForm(false);
      toast({
        title: "Note created!",
        description: "Your note has been saved",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create note",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const togglePin = async (note: Note) => {
    try {
      const updated = await notesAPI.update(note._id, { isPinned: !note.isPinned });
      setNotes(notes.map(n => n._id === note._id ? updated : n));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive",
      });
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      await notesAPI.delete(noteId);
      setNotes(notes.filter(n => n._id !== noteId));
      toast({
        title: "Note deleted",
        description: "Your note has been removed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = selectedTopic === 'All Topics' || note.category === selectedTopic;
    return matchesSearch && matchesTopic;
  });

  // Sort: pinned first, then by date
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-glow mx-auto mb-6 flex items-center justify-center">
              <FileText className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Your <span className="gradient-text">Notes</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Keep track of what you've learned with personal notes
            </p>
          </motion.div>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-4xl mx-auto mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-white/5 border-white/10 focus:border-primary"
                />
              </div>

              {/* Add Note Button */}
              <Button
                variant="hero"
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                New Note
              </Button>
            </div>

            {/* Topic Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 mt-4">
              {topics.map((topic) => (
                <Button
                  key={topic}
                  variant={selectedTopic === topic ? 'hero' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedTopic(topic)}
                  className="flex-shrink-0 capitalize"
                >
                  {topic === 'All Topics' ? topic : topic}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Create Note Form */}
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-4xl mx-auto mb-8"
            >
              <div className="glass-card p-6">
                <h3 className="font-semibold mb-4">Create New Note</h3>
                <div className="space-y-4">
                  <Input
                    placeholder="Note title..."
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    className="h-12 bg-white/5 border-white/10 focus:border-primary"
                  />
                  <textarea
                    placeholder="Write your note content here..."
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    className="w-full h-32 p-3 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none resize-none text-foreground placeholder:text-muted-foreground"
                  />
                  <div className="flex items-center gap-4">
                    <select
                      value={newNote.category}
                      onChange={(e) => setNewNote({ ...newNote, category: e.target.value })}
                      className="h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-foreground"
                    >
                      <option value="general">General</option>
                      <option value="javascript">JavaScript</option>
                      <option value="react">React</option>
                      <option value="typescript">TypeScript</option>
                      <option value="quiz">Quiz Notes</option>
                    </select>
                    <div className="flex-1" />
                    <Button variant="ghost" onClick={() => setShowCreateForm(false)}>
                      Cancel
                    </Button>
                    <Button variant="hero" onClick={createNote} disabled={isCreating}>
                      {isCreating ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save Note
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Notes Grid */}
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-4">
              {sortedNotes.map((note, index) => (
                <motion.div
                  key={note._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="glass-card p-6 hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium capitalize ${topicColors[note.category] || topicColors.general}`}>
                          {note.category}
                        </span>
                        {note.isPinned && (
                          <span className="flex items-center gap-1 text-xs text-warning">
                            <Pin className="w-3 h-3" />
                            Pinned
                          </span>
                        )}
                      </div>

                      <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                        {note.title}
                      </h3>

                      {note.content && (
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {note.content}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(note.updatedAt).toLocaleDateString()}
                        </span>
                        {note.tags && note.tags.length > 0 && (
                          <div className="flex items-center gap-2">
                            <Tag className="w-3.5 h-3.5" />
                            {note.tags.map((tag) => (
                              <span key={tag} className="px-2 py-0.5 rounded bg-white/5">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => togglePin(note)}
                      >
                        <Pin className={`w-4 h-4 ${note.isPinned ? 'text-warning' : ''}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-destructive hover:text-destructive"
                        onClick={() => deleteNote(note._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {sortedNotes.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No notes yet</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Create your first note to start organizing your learning
                </p>
                <Button variant="hero" onClick={() => setShowCreateForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Note
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
