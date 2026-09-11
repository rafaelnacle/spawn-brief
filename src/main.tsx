import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import NewsPage from "./pages/NewsPage";
import DealsPage from "./pages/DealsPage";
import GamesPage from "./pages/GamesPage";
import GamePage from "./pages/GamePage";
import ReleasesPage from "./pages/ReleasesPage";
import SearchPage from "./pages/SearchPage";
import AboutPage from "./pages/AboutPage";
import NotFoundPage from "./pages/NotFoundPage";
import "./styles.css";
import { LocaleProvider } from "./i18n/LocaleContext";
import { ContentPreferencesProvider } from "./features/content/ContentPreferences";
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <LocaleProvider>
        <ContentPreferencesProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="news" element={<NewsPage />} />
                <Route path="deals" element={<DealsPage />} />
                <Route path="games" element={<GamesPage />} />
                <Route path="games/:slug" element={<GamePage />} />
                <Route path="releases" element={<ReleasesPage />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ContentPreferencesProvider>
      </LocaleProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
