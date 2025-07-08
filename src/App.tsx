import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import { AppProvider } from './context/AppContext.jsx';
import Layout from './presentation/components/Layout';
import Articles from './presentation/pages/Articles';
import Grammar from './presentation/pages/Grammar';
import Home from './presentation/pages/Home';
import Progress from './presentation/pages/Progress';
import Settings from './presentation/pages/Settings';
import Speaking from './presentation/pages/Speaking';
import StudyPlan from './presentation/pages/StudyPlan';
import DayView from './presentation/pages/DayView';
import SessionResults from './presentation/components/SessionResults';
import TestSession from './presentation/components/TestSession';
import StudyPlanComplete from './presentation/pages/StudyPlanComplete';
import Tests from './presentation/pages/Tests';
import Vocabulary from './presentation/pages/Vocabulary';
import Writing from './presentation/pages/Writing';

function App() {
  return (
    <AppProvider>
      <Router basename="/learn_german_react">
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/study-plan" element={<StudyPlan />} />
            <Route path="/study-plan/day/:day" element={<DayView />} />
            <Route path="/study-plan/complete" element={<StudyPlanComplete />} />
            <Route path="/vocabulary" element={<Vocabulary />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/grammar" element={<Grammar />} />
            <Route path="/speaking" element={<Speaking />} />
            <Route path="/writing" element={<Writing />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/tests" element={<Tests />} />
            <Route path="/tests/session" element={<TestSession />} />
            <Route path="/tests/results" element={<SessionResults />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
        <PWAInstallPrompt />
      </Router>
    </AppProvider>
  );
}

export default App;
