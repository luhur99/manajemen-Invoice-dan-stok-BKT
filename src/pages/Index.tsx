import { MadeWithDyad } from "@/components/made-with-elmony";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Selamat Datang di Aplikasi Anda</h1>
        <p className="text-xl text-gray-600">
          Mulai bangun proyek luar biasa Anda di sini!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl w-full">
        <Card className="text-center">
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Lihat ringkasan dan metrik penting.</p>
            <Button asChild>
              <Link to="/dashboard">Pergi ke Dashboard</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle>Permintaan Penjadwalan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Kelola permintaan penjadwalan pelanggan.</p>
            <Button asChild>
              <Link to="/scheduling-requests">Lihat Permintaan</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle>Jadwal</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Lihat semua jadwal yang telah dibuat.</p>
            <Button asChild>
              <Link to="/schedules">Lihat Jadwal</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <MadeWithDyad />
    </div>
  );
};

export default Index;