import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";

import Index from "./pages/Index";
import { NIP19Page } from "./pages/NIP19Page";
import { LandingPage } from "./pages/LandingPage";
import { Dashboard } from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { MediKeyProvider, useMediKey } from "./contexts/MediKeyContext";

function AppContent() {
  const { state } = useMediKey();

  // If user is logged in, show dashboard; otherwise show landing page
  if (state.currentUser) {
    return <Dashboard />;
  }

  return <LandingPage />;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={
          <MediKeyProvider>
            <AppContent />
          </MediKeyProvider>
        } />
        {/* NIP-19 route for npub1, note1, naddr1, nevent1, nprofile1 */}
        <Route path="/:nip19" element={<NIP19Page />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
export default AppRouter;