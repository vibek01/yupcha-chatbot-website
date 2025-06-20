// src/App.jsx (updated)
import { A, useLocation } from '@solidjs/router';
import ThemeToggle from './components/ThemeToggle';
import { useTheme } from './ThemeContext';


export default function AppLayout(props) {
  const loc = useLocation();
  const { theme } = useTheme();

  return (
    <div class="app-layout" data-theme={theme()}>
      <nav class="glass">
        <div class="nav-links">
          <A href="/chat" class={loc.pathname.startsWith('/chat') ? 'active' : ''}>
            Chat
          </A>
          <A href="/posts" class={loc.pathname === '/posts' ? 'active' : ''}>
            Posts
          </A>
        </div>
        <ThemeToggle />
      </nav>
      <div class="container">
        {props.children}
      </div>
    </div>
  );
}