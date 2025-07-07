import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';
import Layout from './presentation/components/Layout';
import Articles from './presentation/pages/Articles';
import Grammar from './presentation/pages/Grammar';
import Home from './presentation/pages/Home';
import Progress from './presentation/pages/Progress';
import Settings from './presentation/pages/Settings';
import Speaking from './presentation/pages/Speaking';
import StudyPlan from './presentation/pages/StudyPlan';
import Tests from './presentation/pages/Tests';
import Vocabulary from './presentation/pages/Vocabulary';
import Writing from './presentation/pages/Writing';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/study-plan" element={<StudyPlan />} />
            <Route path="/vocabulary" element={<Vocabulary />} />
            <Route path="/articles" element={<Articles />} />
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
