import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Group } from '@/types';

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [groupCode, setGroupCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/shop');
    }
  }, [user, navigate]);

  // Load groups from Supabase
  useEffect(() => {
    const loadGroups = async () => {
      try {
        const { data, error } = await supabase
          .from('groups')
          .select('*');
        
        if (error) throw error;
        
        const formattedGroups: Group[] = data.map(group => ({
          id: group.id,
          name: group.name,
          code: group.code,
          logoCustomization: group.logo_customization,
          description: '',
          isActive: true
        }));
        
        setGroups(formattedGroups);
      } catch (error: any) {
        console.error('Error loading groups:', error);
      }
    };

    loadGroups();
  }, []);

  const handleGroupLogin = () => {
    const group = groups.find(g => g.code.toLowerCase() === groupCode.toLowerCase());
    if (group) {
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

  const cleanupAuthState = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
  };

  const handleIndividualLogin = async () => {
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      navigate('/shop');
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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
                    <Button onClick={handleIndividualLogin} className="w-full" disabled={loading}>
                      {loading ? "Signing In..." : "Sign In"}
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => navigate('/shop')}>
                      Continue as Guest
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
                      {groups.map(group => (
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