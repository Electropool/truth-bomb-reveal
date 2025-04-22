
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import BackgroundGradient from '@/components/BackgroundGradient';
import { toast } from '@/components/ui/sonner';
import { KeyRound, LogOut } from 'lucide-react';

interface AdminCredentials {
  username: string;
  password: string;
}

// For demonstration - these would normally be stored securely on a server
const ADMIN_CREDENTIALS: AdminCredentials = {
  username: 'ADMIN007',
  password: 'DEADpool005@'
};

const Admin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsLoggedIn(true);
      setError('');
      toast.success('Successfully logged in as admin');
    } else {
      setError('Invalid username or password');
      toast.error('Login failed. Please check your credentials.');
    }
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };
  
  const handleBackToHome = () => {
    navigate('/');
  };
  
  return (
    <div className="min-h-screen font-rounded text-white">
      <BackgroundGradient />
      
      <div className="container max-w-lg mx-auto py-12 px-4">
        <Button 
          variant="ghost" 
          className="mb-6 text-purple-300 hover:bg-purple-900/30"
          onClick={handleBackToHome}
        >
          ← Back to Home
        </Button>
        
        {!isLoggedIn ? (
          <Card className="w-full bg-gray-900/70 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-gradient-glow">
                <KeyRound className="h-6 w-6 inline-block mr-2" />
                Admin Login
              </CardTitle>
              <CardDescription className="text-center text-purple-300">
                This area is restricted to authorized personnel only.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-md text-red-300 text-sm text-center">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium text-purple-200">
                    Username
                  </label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-gray-800 border-purple-500/30"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-purple-200">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-800 border-purple-500/30"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500"
                >
                  Login
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-purple-500/20 pt-4 text-xs text-purple-400">
              Admin access for EnderHOST staff only
            </CardFooter>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gradient-glow">Admin Dashboard</h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-purple-300 hover:bg-purple-900/30"
              >
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gray-900/70 border-purple-500/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-purple-200">Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-purple-300">Total Sessions:</span>
                      <span className="font-medium text-white">124</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Last 24 Hours:</span>
                      <span className="font-medium text-white">32</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Last 7 Days:</span>
                      <span className="font-medium text-white">89</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Active Premium:</span>
                      <span className="font-medium text-white">14</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900/70 border-purple-500/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-purple-200">Premium Codes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Input 
                        placeholder="Enter new premium code" 
                        className="bg-gray-800 border-purple-500/30"
                      />
                      <Button 
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-500"
                      >
                        Add
                      </Button>
                    </div>
                    
                    <div className="h-32 overflow-y-auto bg-gray-800/50 rounded-md p-2 border border-purple-500/20">
                      <div className="text-sm text-purple-400 p-2">
                        No premium codes added yet.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900/70 border-purple-500/30 backdrop-blur-sm md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg text-purple-200">Announcements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-col gap-2">
                      <Input 
                        placeholder="Announcement title" 
                        className="bg-gray-800 border-purple-500/30"
                      />
                      <textarea 
                        placeholder="Announcement content" 
                        className="bg-gray-800 border-purple-500/30 rounded-md p-2 min-h-[100px] resize-none focus:outline-none focus:ring-1 focus:ring-purple-500"
                      ></textarea>
                      <Button 
                        className="self-end bg-purple-600 hover:bg-purple-500"
                      >
                        Publish
                      </Button>
                    </div>
                    
                    <div className="h-32 overflow-y-auto bg-gray-800/50 rounded-md p-2 border border-purple-500/20">
                      <div className="text-sm text-purple-400 p-2">
                        No announcements published yet.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
