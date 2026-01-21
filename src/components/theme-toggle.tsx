'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useContext } from 'react';
import * as DropdownMenu from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ThemeProviderContext } from '@/components/providers';

export function ThemeToggle() {
  const { setTheme } = useContext(ThemeProviderContext);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="ghost" size="sm">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <DropdownMenu.Item onClick={() => setTheme('light')}>
          Light
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => setTheme('dark')}>
          Dark
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => setTheme('system')}>
          System
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
