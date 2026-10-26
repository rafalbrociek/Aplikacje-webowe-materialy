import { Route, Routes } from 'react-router';
import RootLayout from './layouts/RootLayout';
import AboutPage from './pages/AboutPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import PersonDetailsPage from './pages/PersonDetailsPage';
import PersonsPage from './pages/PersonsPage';
import './App.css';

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />

        <Route path="persons">
          <Route index element={<PersonsPage />} />
          <Route path=":id" element={<PersonDetailsPage />} />
        </Route>

        <Route path="about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
