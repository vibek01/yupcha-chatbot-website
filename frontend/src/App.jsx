// src/App.jsx
import { A, useLocation } from '@solidjs/router';
import ThemeToggle from './components/ThemeToggle';
import { useTheme } from './ThemeContext';

export default function AppLayout(props) {
  const loc = useLocation();
  const { theme } = useTheme();

  return (
    <div class="app-layout">
      <nav class="glass">
        <div class="nav-links">
          <A href="/tweets" class={loc.pathname.startsWith('/tweets') ? 'active' : ''}>
            Tweets
          </A>
        </div>
        <ThemeToggle />
      </nav>
      <div class="container">{props.children}</div>
    </div>
  );
}
