import { useEffect } from "react";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";
import { supabase } from "../../lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleDeepLink = async (event: Linking.EventType) => {
      const { url } = event;

      // Exchange the code from Supabase URL for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(url);

      if (error) {
        console.error("Auth error:", error.message);
      } else {
        console.log("Auth success:", data.session);
        router.replace("/"); // send user to homepage after login
      }
    };

    // Listen for redirect when app is already open
    const subscription = Linking.addEventListener("url", handleDeepLink);

    // Handle app opened from cold start
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url } as any);
    });

    return () => subscription.remove();
  }, []);

  return null;
}
