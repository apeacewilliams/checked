import { useState } from 'react';

import { MenuIcon, XIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/authentication';

export function Header() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const { logout } = useAuth();

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <header className="bg-foreground w-full">
      <div className="flex items-center justify-between px-6 py-3">
        <span className="text-xl text-background font-bold">Checked</span>
        <button className="lg:hidden text-background" onClick={toggleMenu}>
          {menuOpen ? <XIcon /> : <MenuIcon />}
        </button>
      </div>

      {menuOpen && (
        <nav className="lg:hidden bg-foreground px-6 py-4 flex flex-col gap-3">
          <Input placeholder="Search" />
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </nav>
      )}
    </header>
  );
}
