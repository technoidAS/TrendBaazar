import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';

export function Layout() {
  return (
    <div className="app-layout flex flex-col min-h-screen">
      {/* Top sticky navbar */}
      <Navbar />

      {/* Main page content area */}
      <main className="flex-grow flex flex-col anim-fade-in" style={{ minHeight: 'calc(100vh - var(--header-height) - 300px)' }}>
        <Outlet />
      </main>

      {/* Persistent footer */}
      <Footer />
    </div>
  );
}

export default Layout;
