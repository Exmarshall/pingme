import { PropsWithChildren, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { StreamChat } from "stream-chat";
import { Chat, OverlayProvider } from "stream-chat-expo";
import { useAuth } from "./AuthProvider";
import { supabase } from "../lib/supabase";

const client = StreamChat.getInstance(
  process.env.EXPO_PUBLIC_STREAM_API_KEY || ""
);

export default function ChatProvider({ children }: PropsWithChildren) {
  const { profile } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!profile?.id) return;

    let mounted = true;

    const connect = async () => {
      try {
        console.log("Connecting user:", profile.id);

        const avatarUrl =
          supabase.storage.from("avatars").getPublicUrl(profile.avatar_url)
            .data.publicUrl;

        const token = client.devToken(profile.id);
        console.log("Generated token:", token);

        // Prevent duplicate connection
        if (client.userID !== profile.id) {
          await client.connectUser(
            {
              id: profile.id,
              name: profile.full_name || "Anonymous User",
              image: avatarUrl,
            },
            token
          );
        }

        if (mounted) setIsReady(true);
      } catch (err) {
        console.error("Stream connectUser failed:", err);
      }
    };

    connect();

    return () => {
      mounted = false;
      if (client.userID) {
        client.disconnectUser();
      }
      setIsReady(false);
    };
  }, [profile?.id]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <OverlayProvider>
      <Chat client={client}>{children}</Chat>
    </OverlayProvider>
  );
}
