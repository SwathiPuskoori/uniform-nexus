import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Building2, User, Link } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary">
            The Uniform Store
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Professional medical uniforms for healthcare organizations and individuals. 
            Quality scrubs, lab coats, and medical apparel from trusted brands.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/shop')}
            className="text-lg px-8 py-6"
          >
            Shop Now
          </Button>
        </div>

        {/* Access Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/login')}>
            <CardHeader className="text-center">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>Group Access</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Healthcare organizations with contract codes get special pricing
              </p>
              <Button variant="outline" className="w-full">
                Group Sign-in
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/login')}>
            <CardHeader className="text-center">
              <User className="h-12 w-12 mx-auto mb-4 text-secondary" />
              <CardTitle>Individual Account</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Personal shopping with full catalog access at retail prices
              </p>
              <Button variant="secondary" className="w-full">
                Sign In
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/retail-link')}>
            <CardHeader className="text-center">
              <Link className="h-12 w-12 mx-auto mb-4 text-success" />
              <CardTitle>Link Retail Account</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Connect your online account to previous retail store purchases
              </p>
              <Button variant="success" className="w-full">
                Link Account
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Featured Brands */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">Trusted Brands</h2>
          <div className="flex flex-wrap justify-center gap-6 text-muted-foreground">
            <span className="text-lg">Barco</span>
            <span className="text-lg">Grey's Anatomy</span>
            <span className="text-lg">Carhartt</span>
            <span className="text-lg">Red Kap</span>
            <span className="text-lg">WonderWink</span>
            <span className="text-lg">Cherokee</span>
            <span className="text-lg">Dickies</span>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
