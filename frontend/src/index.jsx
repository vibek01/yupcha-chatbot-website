// src/index.jsx (updated)
import { render } from 'solid-js/web';
import { Router, Route } from '@solidjs/router';
import AppLayout from './App';
import ChatPage from './routes/ChatPage';
import PostsPage from './routes/PostsPage';
import { ThemeProvider } from './ThemeContext';
import './index.css';


render(
  () => (
    <ThemeProvider>
      <Router root={AppLayout}>
        <Route path="/" component={ChatPage} />
        <Route path="/chat" component={ChatPage} />
        <Route path="/posts" component={PostsPage} />
      </Router>
    </ThemeProvider>
  ),
  document.getElementById('root')
);