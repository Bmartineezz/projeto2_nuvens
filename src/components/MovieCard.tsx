import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Star, Edit2, Trash2, Calendar } from "lucide-react";

interface MovieCardProps {
  id: string;
  title: string;
  type: "movie" | "series";
  genre: string;
  year: string;
  rating: number;
  notes: string;
  imageUrl: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function MovieCard({
  id,
  title,
  type,
  genre,
  year,
  rating,
  notes,
  imageUrl,
  onEdit,
  onDelete,
}: MovieCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-64 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <Badge variant={type === "movie" ? "default" : "secondary"}>
            {type === "movie" ? "Filme" : "Série"}
          </Badge>
        </div>
      </div>
      
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2">{title}</h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{rating.toFixed(1)}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{year}</span>
            <span className="text-sm">•</span>
            <span className="text-sm">{genre}</span>
          </div>
          {notes && (
            <p className="text-sm text-muted-foreground line-clamp-2">{notes}</p>
          )}
        </div>
      </CardContent>

      <CardFooter className="gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onEdit(id)}
        >
          <Edit2 className="w-4 h-4 mr-2" />
          Editar
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="flex-1"
          onClick={() => onDelete(id)}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Excluir
        </Button>
      </CardFooter>
    </Card>
  );
}
