// This page is no longer the primary content for the root route.
// The root route "/" now renders DashboardOverviewPage within MainLayout.
// This file can be used as a fallback or removed if not needed.

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">Memuat Aplikasi...</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">Jika Anda melihat ini terlalu lama, mungkin ada masalah konfigurasi atau Anda perlu login.</p>
      </div>
    </div>
  );
};

export default Index;