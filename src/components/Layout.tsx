import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, FolderKanban, PlusCircle, User, Trophy, LogOut, Menu, X
} from 'lucide-react';
import { useState } from 'react';
import styles from './Layout.module.css';

export default function Layout() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/plataforma/login');
  };

  const navItems = [
    { to: '/plataforma/dashboard', icon: <LayoutDashboard size={20} />, label: 'Mi Espacio' },
    { to: '/plataforma/projects', icon: <FolderKanban size={20} />, label: 'Mis Proyectos' },
    { to: '/plataforma/projects/new', icon: <PlusCircle size={20} />, label: 'Crear Proyecto' },
    { to: '/plataforma/gamification', icon: <Trophy size={20} />, label: 'Mi Avance' },
    { to: '/plataforma/profile', icon: <User size={20} />, label: 'Mi Perfil' },
  ];

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <img src="/logo-white.png" alt="Instituto de Impacto Social México" className={styles.logoImg} />
          </div>
          <div className={styles.headerRight}>
            {profile && (
              <span className={styles.userName}>
                {profile.full_name} · Nivel {profile.level}
              </span>
            )}
            <button
              className={styles.menuBtn}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menú"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <nav className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ''}`}>
        <ul className={styles.navList}>
          {navItems.map(item => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                }
                onClick={() => setMenuOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
          <li>
            <button className={styles.navLink} onClick={handleSignOut}>
              <LogOut size={20} />
              <span>Cerrar Sesión</span>
            </button>
          </li>
        </ul>
      </nav>

      {menuOpen && <div className={styles.overlay} onClick={() => setMenuOpen(false)} />}

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
