import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import { AppProvider } from './context/AppContext.jsx';
import Settings from './pages/Settings.jsx';
import Vocabulary from './pages/Vocabulary';
import Writing from './pages/Writing.jsx';
import Grammar from './presentation/pages/Grammar';
import Home from './presentation/pages/Home';
import Progress from './presentation/pages/Progress';
import Speaking from './presentation/pages/Speaking';
import StudyPlan from './presentation/pages/StudyPlan';
import Tests from './presentation/pages/Tests';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/study-plan" element={<StudyPlan />} />
            <Route path="/vocabulary" element={<Vocabulary />} />
            <Route path="/grammar" element={<Grammar />} />
            <Route path="/speaking" element={<Speaking />} />
            <Route path="/writing" element={<Writing />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/tests" element={<Tests />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;
