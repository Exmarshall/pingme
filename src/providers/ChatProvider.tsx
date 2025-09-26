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
        // Only connect if no user is already connected
        if (!client.userID) {
          const avatarUrl = profile.avatar_url
            ? supabase.storage.from("avatars").getPublicUrl(profile.avatar_url)
                .data.publicUrl
            : "https://i.imgur.com/fR9Jz14.png"; // default avatar

          const name = profile.full_name || "Unknown";

          await client.connectUser(
            {
              id: profile.id,
              name,
              image: avatarUrl,
            },
            client.devToken(profile.id)
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
