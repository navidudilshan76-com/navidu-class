import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ExternalLink, GraduationCap, LogOut } from "lucide-react";
import { User } from "@supabase/supabase-js";
import Footer from "@/components/Footer";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const classUrl = "https://sites.google.com/view/navidusoundonline?usp=sharing";

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        fetchProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (!error && data) {
      setProfile(data);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("ඔබ සාර්ථකව ලොගවිත් වුණා");
      navigate("/");
    } catch (error: any) {
      toast.error("ලොග්අවුට් වීමේ දෝෂයක් ඇතිවිය");
    }
  };

  const handleOpenClass = () => {
    window.location.href = classUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex flex-col">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Navidu Class</h1>
              <p className="text-muted-foreground">
                ආයුබෝවන් {profile?.full_name || user?.email}!
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            ලොග්අවුට්
          </Button>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl">පන්ති කාමරයට පිවිසෙන්න</CardTitle>
              <CardDescription>
                ඔබගේ පන්ති අන්තර්ගතය වෙත ප්‍රවේශ වීමට පහත බොත්තම ක්ලික් කරන්න
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleOpenClass} 
                className="w-full h-16 text-lg"
              >
                <ExternalLink className="mr-2 h-5 w-5" />
                පන්ති කාමරයට යන්න
              </Button>
              
              <div className="mt-6 p-4 bg-accent rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>සටහන:</strong> මෙම බොත්තම ඔබව පන්ති අන්තර්ගතය වෙත යොමු කරනු ඇත.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
