import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/Header';
import { mockGroups } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [groupCode, setGroupCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGroupLogin = () => {
    const group = mockGroups.find(g => g.code.toLowerCase() === groupCode.toLowerCase());
    if (group) {
      // Store group info in localStorage for demo
      localStorage.setItem('currentGroup', JSON.stringify(group));
      toast({
        title: "Group Access Granted",
        description: `Welcome to ${group.name} catalog`,
      });
      navigate('/shop');
    } else {
      toast({
        title: "Invalid Group Code", 
        description: "Please check your contract code and try again.",
        variant: "destructive"
      });
    }
  };

  const handleIndividualLogin = () => {
    if (email && password) {
      // Mock login success
      const user = {
        id: '1',
        email,
        firstName: 'John',
        lastName: 'Doe',
        isRetailLinked: false
      };
      localStorage.setItem('currentUser', JSON.stringify(user));
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      navigate('/shop');
    } else {
      toast({
        title: "Login Failed",
        description: "Please enter valid credentials.",
        variant: "destructive"
      });
    }
  };

  const handleRetailLinking = () => {
    navigate('/retail-link');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Welcome to The Uniform Store</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              If you have already established on-line access to our WebStore, select the 'Sign in' option to review your purchase and order history. You can even re-print a receipt if you like. If you are new to the WebStore, but have made purchases in our retail store and have a receipt, you can create an on-line ID that is linked to your existing account.
            </p>
          </div>

          <Tabs defaultValue="individual" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="individual">Individual Login</TabsTrigger>
              <TabsTrigger value="group">Group Sign-in</TabsTrigger>
              <TabsTrigger value="retail">Retail Account Link</TabsTrigger>
            </TabsList>

            {/* Individual Login */}
            <TabsContent value="individual">
              <Card>
                <CardHeader>
                  <CardTitle>Sign In to Your Account</CardTitle>
                  <CardDescription>
                    Access your personal account and order history
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button onClick={handleIndividualLogin} className="w-full">
                      Sign In
                    </Button>
                    <Button variant="outline" className="w-full">
                      Create New Account
                    </Button>
                    <Button variant="link" className="w-full">
                      Forgot Password?
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Group Login */}
            <TabsContent value="group">
              <Card>
                <CardHeader>
                  <CardTitle>Group Sign-in</CardTitle>
                  <CardDescription>
                    Enter your organization's contract code to access special pricing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="groupCode">Contract Code</Label>
                    <Input 
                      id="groupCode"
                      value={groupCode}
                      onChange={(e) => setGroupCode(e.target.value)}
                      placeholder="e.g., OHH for Ohio Health"
                      className="uppercase"
                    />
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Available Contract Codes:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {mockGroups.map(group => (
                        <li key={group.id}>
                          <strong>{group.code}</strong> - {group.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button onClick={handleGroupLogin} className="w-full">
                    Access Group Catalog
                  </Button>
                  <p className="text-sm text-muted-foreground text-center">
                    Note: You'll need to create/login to a personal account at checkout to complete your order
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Retail Account Linking */}
            <TabsContent value="retail">
              <Card>
                <CardHeader>
                  <CardTitle>Link to My Existing Account</CardTitle>
                  <CardDescription>
                    Connect your online account to previous retail store purchases
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      If you already have an account with our company, you can create an on-line account that is linked to your existing account. Linking to your existing account is ideal because it provides access to your previous transactions.
                    </p>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <p className="text-sm text-amber-800">
                      For your protection, existing accounts with certain privileges can only be linked by contacting us directly.
                    </p>
                  </div>
                  <Button onClick={handleRetailLinking} className="w-full">
                    Link to My Existing Account
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}