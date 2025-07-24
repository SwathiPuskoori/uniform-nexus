import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
  isGroupUser?: boolean;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ 
  product, 
  isGroupUser = false, 
  onViewDetails, 
  onAddToCart 
}: ProductCardProps) {
  const price = isGroupUser ? product.contractPrice : product.retailPrice;

  return (
    <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
      <CardContent className="p-4">
        {/* Product Image */}
        <div className="aspect-square mb-4 bg-muted rounded-lg overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            onClick={() => onViewDetails(product)}
          />
        </div>

        {/* Brand Badge */}
        <Badge variant="outline" className="mb-2">
          {product.brand}
        </Badge>

        {/* Product Info */}
        <div onClick={() => onViewDetails(product)}>
          <h3 className="font-semibold text-sm mb-1 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground mb-2">
            Code: {product.code}
          </p>
        </div>

        {/* Price */}
        <div className="mb-3">
          <span className="text-lg font-bold text-success">
            Your Price ${price.toFixed(2)}
          </span>
          {isGroupUser && (
            <div className="text-xs text-muted-foreground line-through">
              Retail: ${product.retailPrice.toFixed(2)}
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button 
          variant="cart" 
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          disabled={!product.inStock}
        >
          {product.inStock ? 'Add To Cart' : 'Out of Stock'}
        </Button>

        {/* Logo Eligible Badge */}
        {product.logoEligible && isGroupUser && (
          <Badge variant="secondary" className="mt-2 text-xs">
            Logo Available
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}