import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import "./App.css";
import Login from './pages/Login.jsx';
import Register from './pages/Signup.jsx';
import { ThemeProvider, ThemeContext, lightTheme, darkTheme } from './ThemeContext.jsx';
import '@ant-design/v5-patch-for-react-19';
import AppHeader from './pages/AppHeader.jsx';
import UserPage from './pages/UserPage.jsx';
import WorkoutsPage from './pages/WorkoutsPage.jsx';
import WorkoutLog from './pages/WorkoutLog.jsx';
import WorkoutDetail from './pages/WorkoutDetail.jsx';
import HomePage from './pages/HomePage.jsx';

function AppContent() {
  const { theme } = React.useContext(ThemeContext);
  const currentTheme = theme === "light" ? lightTheme : darkTheme;

  return (

    <ConfigProvider theme={currentTheme}>
      <Router>
        <Routes>
          <Route path ="/" element={<HomePage/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/workouts" element={<WorkoutsPage />} />
          <Route path="/user/:username" element={<UserPage />} />
          <Route path="/articles" element={<WorkoutLog/>}/>
          <Route path="/articles/:id" element={<WorkoutDetail/>}/>
        </Routes>
      </Router>
      
    </ConfigProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;