import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Construction } from "lucide-react";

interface ComingSoonCardProps {
    title: string;
    message: string;
}

const ComingSoonCard = ({title, message}: ComingSoonCardProps) => (
  <Card className="w-full max-w-md mx-auto my-12 bg-card text-card-foreground shadow-lg rounded-lg border border-border p-4 flex flex-col items-center justify-center">
    <CardHeader className="flex flex-col items-center">
      <Construction className="w-12 h-12 text-accent mb-2" />
      <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground text-center text-base sm:text-lg">
        This page is under construction.<br />
        {message}
      </p>
    </CardContent>
  </Card>
);

export default ComingSoonCard;