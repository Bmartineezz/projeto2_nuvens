import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Star } from "lucide-react";

interface MovieData {
  id: string;
  title: string;
  type: "movie" | "series";
  genre: string;
  year: string;
  rating: number;
  notes: string;
  imageUrl: string;
}

interface MovieDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (movie: MovieData) => void;
  editingMovie?: MovieData | null;
}

const defaultImages = [
  "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWElMjBtb3ZpZSUyMHRoZWF0ZXJ8ZW58MXx8fHwxNzYyMzEwNzU2fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1615986200762-a1ed9610d3b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0diUyMHNlcmllcyUyMHN0cmVhbWluZ3xlbnwxfHx8fDE3NjIzMTA3NTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1585647347384-2593bc35786b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3Bjb3JuJTIwbW92aWVzfGVufDF8fHx8MTc2MjMxMDc1N3ww&ixlib=rb-4.1.0&q=80&w=1080",
];

export function MovieDialog({
  open,
  onOpenChange,
  onSave,
  editingMovie,
}: MovieDialogProps) {
  const [formData, setFormData] = useState<MovieData>({
    id: "",
    title: "",
    type: "movie",
    genre: "",
    year: new Date().getFullYear().toString(),
    rating: 0,
    notes: "",
    imageUrl: defaultImages[0],
  });
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    if (editingMovie) {
      setFormData(editingMovie);
    } else {
      setFormData({
        id: "",
        title: "",
        type: "movie",
        genre: "",
        year: new Date().getFullYear().toString(),
        rating: 0,
        notes: "",
        imageUrl: defaultImages[Math.floor(Math.random() * defaultImages.length)],
      });
    }
  }, [editingMovie, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: formData.id || Date.now().toString(),
    });
    onOpenChange(false);
  };

  const handleRatingClick = (rating: number) => {
    setFormData({ ...formData, rating });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingMovie ? "Editar" : "Adicionar"} {formData.type === "movie" ? "Filme" : "Série"}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para {editingMovie ? "atualizar" : "adicionar"} ao catálogo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Digite o título"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "movie" | "series") =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="movie">Filme</SelectItem>
                  <SelectItem value="series">Série</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Ano</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                required
                min="1900"
                max={new Date().getFullYear() + 5}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="genre">Gênero</Label>
            <Input
              id="genre"
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              required
              placeholder="Ex: Ação, Drama, Comédia"
            />
          </div>

          <div className="space-y-2">
            <Label>Nota (0-10)</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= (hoveredRating || formData.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-muted-foreground">
                {formData.rating > 0 ? `${formData.rating.toFixed(1)}` : "Sem nota"}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas/Comentários</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Suas impressões sobre este conteúdo..."
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingMovie ? "Salvar Alterações" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
