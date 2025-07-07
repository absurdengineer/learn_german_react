import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import { AppProvider } from './context/AppContext.jsx';
import Grammar from './pages/Grammar.jsx';
import Home from './pages/Home.jsx';
import Progress from './pages/Progress.jsx';
import Settings from './pages/Settings.jsx';
import Speaking from './pages/Speaking.jsx';
import StudyPlan from './pages/StudyPlan.jsx';
import Tests from './pages/Tests.jsx';
import Vocabulary from './pages/Vocabulary.jsx';
import Writing from './pages/Writing.jsx';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
    </ThemeProvider>
  );
}

export default App;
