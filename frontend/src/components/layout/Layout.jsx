import { Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

const Layout = ({ NavbarComponent }) => {
  return (
    <div className="flex flex-col min-h-screen font-sans text-foreground">
      {/* Navbar Shell */}
      {NavbarComponent && (
        <div className="z-50">
          <NavbarComponent />
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full pt-[80px] relative">
        <AnimatePresence mode="wait">
            <Outlet />
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Layout;