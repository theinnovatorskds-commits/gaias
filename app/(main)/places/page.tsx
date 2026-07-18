import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PlacesPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Places Directory" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Card>
            <CardHeader>
                <CardTitle>Places Directory</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Places directory feature will be implemented here.</p>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
