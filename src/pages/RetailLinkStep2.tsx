import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { RetailCustomer } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function RetailLinkStep2() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [customer, setCustomer] = useState<RetailCustomer | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const customerData = localStorage.getItem('linkingCustomer');
    if (customerData) {
      setCustomer(JSON.parse(customerData));
    } else {
      navigate('/retail-link');
    }
  }, [navigate]);

  const handleCreateAccount = () => {
    if (!email || !password || !confirmPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    // Create linked account
    const linkedUser = {
      id: customer?.accountNumber || '',
      email,
      firstName: customer?.firstName || '',
      lastName: customer?.lastName || '',
      isRetailLinked: true,
      retailAccountId: customer?.accountNumber
    };

    localStorage.setItem('currentUser', JSON.stringify(linkedUser));
    localStorage.removeItem('linkingCustomer');

    toast({
      title: "Account Created Successfully!",
      description: `Your online account is now linked to your retail history`,
    });

    navigate('/shop');
  };

  if (!customer) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Link to My Existing Account - Step 2 - Create Online Access</CardTitle>
              <CardDescription>
                Account found! Now create your online login credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Account Located:</h4>
                <div className="text-sm text-green-700">
                  <p><strong>Name:</strong> {customer.firstName} {customer.lastName}</p>
                  <p><strong>Account Number:</strong> {customer.accountNumber}</p>
                  <p><strong>Phone:</strong> {customer.phone}</p>
                  <p><strong>Previous Orders:</strong> {customer.orders.length}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a secure password"
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input 
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={handleCreateAccount}
                  disabled={!email || !password || !confirmPassword}
                  className="flex-1"
                >
                  Create Linked Account
                </Button>
                <Button variant="outline" onClick={() => navigate('/retail-link')} className="flex-1">
                  Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}