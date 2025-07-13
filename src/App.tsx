import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AppProvider } from "./store/AppContext.tsx";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import TestResults from "./components/TestResults";
import Articles from "./pages/Articles";
import DayView from "./pages/DayView";
import Grammar from "./pages/Grammar";
import Home from "./pages/Home";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";
import Speaking from "./pages/Speaking";
import StudyPlan from "./pages/StudyPlan";
import StudyPlanComplete from "./pages/StudyPlanComplete";
import Tests from "./pages/Tests";
import Vocabulary from "./pages/Vocabulary";

function App() {
  return (
    <AppProvider>
      <Router basename="/learn_german_react">
        <Layout>
          <Routes>
            {/* Home */}
            <Route path="/" element={<Home />} />

            {/* Study Plan Routes */}
            <Route path="/study-plan" element={<StudyPlan />} />
            <Route path="/study-plan/day/:day" element={<DayView />} />
            <Route
              path="/study-plan/complete"
              element={
                <ProtectedRoute sessionKey="study_plan_session">
                  <StudyPlanComplete />
                </ProtectedRoute>
              }
            />

            {/* Vocabulary Routes */}
            <Route path="/vocabulary" element={<Vocabulary />} />
            <Route path="/vocabulary/browse" element={<Vocabulary />} />
            <Route path="/vocabulary/practice/:mode" element={<Vocabulary />} />
            <Route
              path="/vocabulary/practice/:mode/results"
              element={
                <ProtectedRoute sessionKey="vocabulary_session">
                  <Vocabulary />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vocabulary/category/:category"
              element={<Vocabulary />}
            />
            <Route
              path="/vocabulary/category/:category/practice/:mode"
              element={<Vocabulary />}
            />
            <Route
              path="/vocabulary/category/:category/practice/:mode/results"
              element={
                <ProtectedRoute sessionKey="vocabulary_session">
                  <Vocabulary />
                </ProtectedRoute>
              }
            />

            {/* Articles Routes */}
            <Route path="/articles" element={<Articles />} />
            <Route path="/articles/practice" element={<Articles />} />
            <Route
              path="/articles/practice/results"
              element={
                <ProtectedRoute sessionKey="articles_session">
                  <Articles />
                </ProtectedRoute>
              }
            />
            <Route path="/articles/learning" element={<Articles />} />
            <Route path="/articles/category/:category" element={<Articles />} />
            <Route
              path="/articles/category/:category/practice"
              element={<Articles />}
            />
            <Route
              path="/articles/category/:category/practice/results"
              element={
                <ProtectedRoute sessionKey="articles_session">
                  <Articles />
                </ProtectedRoute>
              }
            />
            <Route
              path="/articles/category/:category/learning"
              element={<Articles />}
            />

            {/* Grammar Routes */}
            <Route path="/grammar" element={<Grammar />} />
            <Route path="/grammar/lessons" element={<Grammar />} />
            <Route path="/grammar/lessons/:day" element={<Grammar />} />
            <Route
              path="/grammar/lessons/:day/complete"
              element={
                <ProtectedRoute sessionKey="grammar_session">
                  <Grammar />
                </ProtectedRoute>
              }
            />
            <Route path="/grammar/practice" element={<Grammar />} />
            <Route path="/grammar/practice/:mode" element={<Grammar />} />
            <Route
              path="/grammar/practice/:mode/results"
              element={
                <ProtectedRoute sessionKey="grammar_session">
                  <Grammar />
                </ProtectedRoute>
              }
            />
            <Route path="/grammar/flashcards" element={<Grammar />} />
            <Route
              path="/grammar/flashcards/results"
              element={
                <ProtectedRoute sessionKey="grammar_session">
                  <Grammar />
                </ProtectedRoute>
              }
            />
            <Route path="/grammar/quiz" element={<Grammar />} />
            <Route
              path="/grammar/quiz/results"
              element={
                <ProtectedRoute sessionKey="grammar_session">
                  <Grammar />
                </ProtectedRoute>
              }
            />

            {/* Speaking Routes */}
            <Route path="/speaking" element={<Speaking />} />
            <Route path="/speaking/practice" element={<Speaking />} />
            <Route path="/speaking/practice/:exercise" element={<Speaking />} />
            <Route
              path="/speaking/practice/:exercise/results"
              element={
                <ProtectedRoute sessionKey="speaking_session">
                  <Speaking />
                </ProtectedRoute>
              }
            />
            <Route path="/speaking/recording" element={<Speaking />} />
            <Route path="/speaking/recording/playback" element={<Speaking />} />

            {/* Tests Routes */}
            <Route path="/tests" element={<Tests />} />
            <Route
              path="/tests/results"
              element={
                <ProtectedRoute sessionKey="test_session">
                  <TestResults />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tests/results/:sessionId"
              element={
                <ProtectedRoute sessionKey="test_session">
                  <TestResults />
                </ProtectedRoute>
              }
            />
            <Route path="/tests/:testType" element={<Tests />} />
            <Route
              path="/tests/:testType/results"
              element={
                <ProtectedRoute sessionKey="test_session">
                  <TestResults />
                </ProtectedRoute>
              }
            />

            {/* Progress Routes */}
            <Route path="/progress" element={<Progress />} />
            <Route path="/progress/detailed" element={<Progress />} />
            <Route path="/progress/weekly" element={<Progress />} />
            <Route path="/progress/monthly" element={<Progress />} />

            {/* Settings */}
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/profile" element={<Settings />} />
            <Route path="/settings/preferences" element={<Settings />} />
            <Route path="/settings/data" element={<Settings />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;
