import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ToastProvider } from "./components/ui/Toast";
import { CreateListingPage } from "./pages/CreateListingPage";
import { HomePage } from "./pages/HomePage";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { SearchPage } from "./pages/SearchPage";

export function App() {
  return (
    <ToastProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/listing/:id" element={<ProductDetailPage />} />
          <Route path="/sell" element={<CreateListingPage />} />
          <Route path="/messages" element={<PlaceholderPage type="messages" />} />
          <Route path="/profile" element={<PlaceholderPage type="profile" />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Layout>
    </ToastProvider>
  );
}
