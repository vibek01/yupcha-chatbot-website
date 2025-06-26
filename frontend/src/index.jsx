// File: src/index.jsx

import { render } from 'solid-js/web';
import { Router, Route } from '@solidjs/router';
import AppLayout from './App';
import PostsPage from './routes/PostsPage';  // now the TweetGenerator page
import { ThemeProvider } from './ThemeContext';
import './index.css';

render(
  () => (
    <ThemeProvider>
      <Router root={AppLayout}>
        <Route path="/tweets"  component={PostsPage} />
        <Route path="/"  component={PostsPage} />
      </Router>
    </ThemeProvider>
  ),
  document.getElementById('root')
);
