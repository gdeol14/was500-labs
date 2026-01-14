import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NPCList from './pages/NPCList';
import NPCDetail from './pages/NPCDetail';
import NPCForm from './pages/NPCForm';
import QuestList from './pages/QuestList';
import QuestDetail from './pages/QuestDetail';
import QuestForm from './pages/QuestForm';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/npcs" element={<NPCList />} />
              <Route path="/npcs/:id" element={<NPCDetail />} />
              <Route path="/npcs/create" element={<ProtectedRoute><NPCForm /></ProtectedRoute>} />
              <Route path="/npcs/edit/:id" element={<ProtectedRoute><NPCForm /></ProtectedRoute>} />
              <Route path="/quests" element={<QuestList />} />
              <Route path="/quests/:id" element={<QuestDetail />} />
              <Route path="/quests/create" element={<ProtectedRoute><QuestForm /></ProtectedRoute>} />
              <Route path="/quests/edit/:id" element={<ProtectedRoute><QuestForm /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;