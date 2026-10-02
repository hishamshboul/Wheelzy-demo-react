
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx'
import CarCasesPage from './pages/CarCasesPage.jsx';
import CreateCarCasePage from './pages/CreateCarCasePage.jsx';
import CarCaseDetailsPage from './pages/CarCaseDetailsPage.jsx';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />

        <Route
          path="car-cases"
          element={<CarCasesPage/>}
        />

        <Route
          path="car-cases/create"
          element={<CreateCarCasePage/>}
        />

        <Route
          path="car-cases/:id"
          element={<CarCaseDetailsPage/>}
        />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App
