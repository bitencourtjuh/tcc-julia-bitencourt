import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { FileQuestion, Home } from "lucide-react";
import { useNavigate } from "react-router";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl border-border">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="h-32 w-32 rounded-full bg-gradient-to-br from-[#e0f2f1] to-[#e0e7ff] flex items-center justify-center">
                <FileQuestion className="h-16 w-16 text-[#0d9488]" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">404 - Página não encontrada</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Desculpe, a página que você está procurando não existe ou foi movida.
            </p>
            
            <Button 
              className="bg-[#0d9488] hover:bg-[#0f766e]"
              onClick={() => navigate("/")}
            >
              <Home className="mr-2 h-4 w-4" />
              Voltar ao Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
