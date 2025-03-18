
import React from 'react';
import { FileSpreadsheet } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t py-6 md:py-0">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">XLS Panel</span>
        </div>
        
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} XLS Panel. All rights reserved.
        </p>
        
        <nav className="flex items-center gap-4">
          <a 
            href="#" 
            className="text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            Privacy Policy
          </a>
          <a 
            href="#" 
            className="text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            Terms of Service
          </a>
        </nav>
      </div>
    </footer>
  );
}
