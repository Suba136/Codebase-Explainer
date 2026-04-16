import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
  Home, Upload, GitBranch, ScrollText,
  Compass, BarChart3, Database,
  Settings, HelpCircle, MessageCircle
} from 'lucide-react';
import './Layout.css';
import Chat from './Chat';

const navItems = [
  { icon: Home,       label: 'Home',        path: '/'           },
  { icon: GitBranch,  label: 'Get Repo',    path: '/get-repo'   },
  // { icon: FolderGit2, label: 'Repository',  path: '/repo/current' },
  { icon: Upload,     label: 'Ingest',      path: '/ingest'     },
  { icon: Compass,    label: 'Orient',      path: '/orient'     },
  { icon: BarChart3,  label: 'Complexity',  path: '/complexity' },
  { icon: Database,   label: 'Data Model',  path: '/data-model' },
  { icon: ScrollText, label: 'Report',      path: '/report'      },
  { icon: MessageCircle,       label: 'Chat',         path: '/chat' },
];

const Layout = () => {
  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="logo-container">
          <div className="logo-mark">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-code-2">
              <path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/>
            </svg>
          </div>
          <span className="logo-text">CodeEx</span>
        </div>

        <nav className="nav-items-middle">
          {navItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <div className="nav-icon">
                <item.icon size={20} strokeWidth={1.75} />
              </div>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <div className="page-enter">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
