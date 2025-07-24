import { useState, useEffect } from 'react';
import { Grid, List, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { FilterSidebar, FilterState } from '@/components/FilterSidebar';
import { ProductCard } from '@/components/ProductCard';
import { ProductModal } from '@/components/ProductModal';
import { LogoCustomizationModal } from '@/components/LogoCustomizationModal';
import { AuthModal } from '@/components/AuthModal';
import { Product, Group, CartItem } from '@/types';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export default function Shop() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [logoModalProduct, setLogoModalProduct] = useState<Product | null>(null);
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load products from Supabase
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*');
        
        if (error) throw error;
        
        const formattedProducts: Product[] = data.map(product => ({
          id: product.id,
          name: product.name,
          code: product.code,
          brand: product.brand,
          department: product.department,
          retailPrice: product.retail_price,
          contractPrice: product.contract_price,
          colors: product.colors as any[],
          sizes: product.sizes as string[],
          logoEligible: product.logo_eligible,
          image: product.image_url || '',
          imageUrl: product.image_url || '',
          description: '',
          inStock: product.in_stock
        }));
        
        setProducts(formattedProducts);
        setFilteredProducts(formattedProducts);
      } catch (error: any) {
        toast({
          title: "Error loading products",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [toast]);

  // Load group data and cart count
  useEffect(() => {
    const groupData = localStorage.getItem('currentGroup');
    if (groupData) {
      setCurrentGroup(JSON.parse(groupData));
    }

    if (user) {
      loadCartCount();
    }
  }, [user]);

  const loadCartCount = async () => {
    if (!user) return;
    
    try {
      const { count, error } = await supabase
        .from('cart_items')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      
      if (error) throw error;
      setCartItemCount(count || 0);
    } catch (error: any) {
      console.error('Error loading cart count:', error);
    }
  };

  const handleFilterChange = (filters: FilterState) => {
    let filtered = products.filter(product => {
      // Keyword search
      if (filters.keyword && !product.name.toLowerCase().includes(filters.keyword.toLowerCase()) &&
          !product.code.toLowerCase().includes(filters.keyword.toLowerCase())) {
        return false;
      }

      // Price range
      const price = currentGroup ? product.contractPrice : product.retailPrice;
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
        return false;
      }

      // Brands
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
        return false;
      }

      // Departments
      if (filters.departments.length > 0 && !filters.departments.includes(product.department)) {
        return false;
      }

      // Colors
      if (filters.colors.length > 0 && !product.colors.some(color => filters.colors.includes(color.name))) {
        return false;
      }

      return true;
    });

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product: Product) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Check if this product is logo eligible for group users
    if (currentGroup?.logoCustomization && product.logoEligible) {
      setLogoModalProduct(product);
    } else {
      addToCartDirect(product);
    }
  };

  const addToCartDirect = async (product: Product, color?: string, size?: string, quantity?: number, logoCustomization: boolean = false) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      const price = currentGroup ? product.contractPrice : product.retailPrice;
      
      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id: product.id,
          color: color || product.colors[0]?.name || 'Default',
          size: size || product.sizes[0] || 'Default',
          quantity: quantity || 1,
          logo_customization: logoCustomization,
          price
        });

      if (error) throw error;

      await loadCartCount();
      
      toast({
        title: "Added to Cart",
        description: `${product.name} added to your cart`,
      });
    } catch (error: any) {
      toast({
        title: "Error adding to cart",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleLogoSelection = (hasLogo: boolean) => {
    if (logoModalProduct) {
      addToCartDirect(logoModalProduct, undefined, undefined, undefined, hasLogo);
      setLogoModalProduct(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={cartItemCount} />
      
      <div className="container mx-auto px-4 py-6">
        {/* Group Context */}
        {currentGroup && (
          <div className="mb-6">
            <Badge variant="secondary" className="text-lg py-2 px-4">
              Group: {currentGroup.name} ({currentGroup.code})
            </Badge>
          </div>
        )}

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          {showFilters && (
            <aside className="hidden lg:block">
              <FilterSidebar onFilterChange={handleFilterChange} />
            </aside>
          )}

          {/* Main Content */}
          <main className="flex-1">
            {/* Header Controls */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <span className="text-muted-foreground">
                  {filteredProducts.length} products found
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isGroupUser={!!currentGroup}
                  onViewDetails={setSelectedProduct}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No products found matching your criteria
                </p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isGroupUser={!!currentGroup}
          groupName={currentGroup?.name}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(product, color, size, quantity) => addToCartDirect(product, color, size, quantity)}
        />
      )}

      {/* Logo Customization Modal */}
      {logoModalProduct && currentGroup && (
        <LogoCustomizationModal
          groupName={currentGroup.name}
          productName={logoModalProduct.name}
          onSelect={handleLogoSelection}
          onClose={() => setLogoModalProduct(null)}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          loadCartCount();
        }}
      />
    </div>
  );
}