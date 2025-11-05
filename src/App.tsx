import { useState, useEffect } from "react";
import { MovieCard } from "./components/MovieCard";
import { MovieDialog } from "./components/MovieDialog";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./components/ui/alert-dialog";
import { Plus, Search, Film, Tv, Star } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";

interface Movie {
  id: string;
  title: string;
  type: "movie" | "series";
  genre: string;
  year: string;
  rating: number;
  notes: string;
  imageUrl: string;
}

const STORAGE_KEY = "movie-catalog";

const initialMovies: Movie[] = [
  {
    id: "1",
    title: "Interestelar",
    type: "movie",
    genre: "Ficção Científica",
    year: "2014",
    rating: 9.5,
    notes: "Uma obra-prima de Christopher Nolan. A trilha sonora e os efeitos visuais são espetaculares!",
    imageUrl: "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWElMjBtb3ZpZSUyMHRoZWF0ZXJ8ZW58MXx8fHwxNzYyMzEwNzU2fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "2",
    title: "Breaking Bad",
    type: "series",
    genre: "Drama/Crime",
    year: "2008",
    rating: 10,
    notes: "A melhor série já feita. A evolução do personagem Walter White é incrível.",
    imageUrl: "https://images.unsplash.com/photo-1615986200762-a1ed9610d3b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0diUyMHNlcmllcyUyMHN0cmVhbWluZ3xlbnwxfHx8fDE3NjIzMTA3NTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "3",
    title: "A Origem",
    type: "movie",
    genre: "Ação/Ficção",
    year: "2010",
    rating: 9,
    notes: "Complexo e fascinante. Cada revisita revela novos detalhes.",
    imageUrl: "https://images.unsplash.com/photo-1585647347384-2593bc35786b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3Bjb3JuJTIwbW92aWVzfGVufDF8fHx8MTc2MjMxMDc1N3ww&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "movie" | "series">("all");
  const [sortBy, setSortBy] = useState<"title" | "year" | "rating">("title");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState<string | null>(null);

  // Load movies from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setMovies(JSON.parse(stored));
      } catch {
        setMovies(initialMovies);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMovies));
      }
    } else {
      setMovies(initialMovies);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMovies));
    }
  }, []);

  // Save to localStorage whenever movies change
  useEffect(() => {
    if (movies.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
    }
  }, [movies]);

  const handleSaveMovie = (movie: Movie) => {
    if (editingMovie) {
      setMovies(movies.map((m) => (m.id === movie.id ? movie : m)));
      toast.success("Conteúdo atualizado com sucesso!");
    } else {
      setMovies([...movies, movie]);
      toast.success("Conteúdo adicionado ao catálogo!");
    }
    setEditingMovie(null);
  };

  const handleEditMovie = (id: string) => {
    const movie = movies.find((m) => m.id === id);
    if (movie) {
      setEditingMovie(movie);
      setDialogOpen(true);
    }
  };

  const handleDeleteMovie = (id: string) => {
    setMovieToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (movieToDelete) {
      setMovies(movies.filter((m) => m.id !== movieToDelete));
      toast.success("Conteúdo removido do catálogo!");
      setMovieToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleAddNew = () => {
    setEditingMovie(null);
    setDialogOpen(true);
  };

  // Filter and sort movies
  const filteredMovies = movies
    .filter((movie) => {
      const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.genre.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === "all" || movie.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "year") return parseInt(b.year) - parseInt(a.year);
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  const movieCount = filteredMovies.filter((m) => m.type === "movie").length;
  const seriesCount = filteredMovies.filter((m) => m.type === "series").length;
  const avgRating = filteredMovies.length > 0
    ? filteredMovies.reduce((sum, m) => sum + m.rating, 0) / filteredMovies.length
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Toaster />
      
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-3 rounded-xl">
                <Film className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1>CineTrack</h1>
                <p className="text-sm text-muted-foreground">
                  Seu catálogo pessoal de filmes e séries
                </p>
              </div>
            </div>
            <Button onClick={handleAddNew} size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Adicionar Conteúdo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <Film className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-800">Filmes</p>
                  <p className="text-2xl text-blue-900">{movieCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center gap-3">
                <Tv className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm text-purple-800">Séries</p>
                  <p className="text-2xl text-purple-900">{seriesCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-3">
                <Star className="w-8 h-8 text-yellow-600" />
                <div>
                  <p className="text-sm text-yellow-800">Média de Avaliação</p>
                  <p className="text-2xl text-yellow-900">
                    {avgRating > 0 ? avgRating.toFixed(1) : "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Buscar por título ou gênero..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Título (A-Z)</SelectItem>
                <SelectItem value="year">Ano (Mais Recente)</SelectItem>
                <SelectItem value="rating">Nota (Maior)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={filterType} onValueChange={(value: any) => setFilterType(value)}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">
              Todos ({filteredMovies.length})
            </TabsTrigger>
            <TabsTrigger value="movie">
              <Film className="w-4 h-4 mr-2" />
              Filmes ({movieCount})
            </TabsTrigger>
            <TabsTrigger value="series">
              <Tv className="w-4 h-4 mr-2" />
              Séries ({seriesCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={filterType}>
            {filteredMovies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    {...movie}
                    onEdit={handleEditMovie}
                    onDelete={handleDeleteMovie}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-200 mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="mb-2">Nenhum conteúdo encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery
                    ? "Tente ajustar sua busca ou filtros"
                    : "Adicione seu primeiro filme ou série ao catálogo"}
                </p>
                {!searchQuery && (
                  <Button onClick={handleAddNew}>
                    <Plus className="w-5 h-5 mr-2" />
                    Adicionar Conteúdo
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialogs */}
      <MovieDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveMovie}
        editingMovie={editingMovie}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este conteúdo do catálogo? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
