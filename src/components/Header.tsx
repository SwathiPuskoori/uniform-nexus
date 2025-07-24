import { Search, ShoppingCart, User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  cartItemCount?: number;
  onCartClick?: () => void;
}

export function Header({ cartItemCount = 0, onCartClick }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="bg-background border-b border-border">
      {/* Top bar with phone */}
      <div className="bg-muted py-2">
        <div className="container mx-auto px-4 flex justify-end items-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>(614) 793-0469</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <div className="text-2xl font-bold text-primary">
              The Uniform Store
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search products..." 
                className="pl-10"
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/login')}
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Sign In
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={onCartClick}
              className="relative flex items-center gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              Cart
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4 border-t border-border pt-4">
          <ul className="flex flex-wrap gap-6 text-sm">
            <li>
              <Button variant="link" onClick={() => navigate('/')} className="p-0 h-auto">
                Home
              </Button>
            </li>
            <li>
              <Button variant="link" onClick={() => navigate('/shop')} className="p-0 h-auto">
                Shop
              </Button>
            </li>
            <li>
              <Button variant="link" className="p-0 h-auto">
                New Arrivals
              </Button>
            </li>
            <li>
              <Button variant="link" className="p-0 h-auto">
                Jackets & Tees
              </Button>
            </li>
            <li>
              <Button variant="link" className="p-0 h-auto">
                Professional Wear
              </Button>
            </li>
            <li>
              <Button variant="link" className="p-0 h-auto">
                Lab Coats
              </Button>
            </li>
            <li>
              <Button variant="link" className="p-0 h-auto">
                Events
              </Button>
            </li>
            <li>
              <Button variant="link" className="p-0 h-auto">
                FAQs
              </Button>
            </li>
            <li>
              <Button variant="link" className="p-0 h-auto">
                Contact Us
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}