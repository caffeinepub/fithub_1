import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import AIAssistant from "./components/AIAssistant";
import Navigation from "./components/Navigation";
import TrialBanner from "./components/TrialBanner";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import MembershipPage from "./pages/MembershipPage";
import VideosPage from "./pages/VideosPage";

export type Page =
  | { name: "home" }
  | { name: "videos" }
  | { name: "dashboard" }
  | { name: "membership" };

export default function App() {
  const [page, setPage] = useState<Page>({ name: "home" });

  const navigate = (p: Page) => {
    setPage(p);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (page.name) {
      case "home":
        return <HomePage navigate={navigate} />;
      case "videos":
        return <VideosPage navigate={navigate} />;
      case "dashboard":
        return <DashboardPage navigate={navigate} />;
      case "membership":
        return <MembershipPage navigate={navigate} />;
      default:
        return <HomePage navigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation page={page} navigate={navigate} />
      <TrialBanner navigate={navigate} />
      <main>{renderPage()}</main>
      <Toaster richColors position="top-right" />
      <AIAssistant />
    </div>
  );
}
