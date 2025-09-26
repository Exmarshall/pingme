// import { PropsWithChildren, useEffect, useState } from "react";
// import { ActivityIndicator, View } from "react-native";
// import { StreamChat } from "stream-chat";
// import { Chat, OverlayProvider } from "stream-chat-expo";

// const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY || "");

// export default function ChatProvider({ children }: PropsWithChildren) {
//     const [isReady, setIsReady] = useState(false)
//     useEffect(() => {
//         const connect = async () => {
//             await client.connectUser(
//                 {
//                     id: "jlahey",
//                     name: "Jim Lahey",
//                     image: "https://i.imgur.com/fR9Jz14.png",
//                 },
//                 client.devToken('jlahey'),
//             );
//             setIsReady(true)

//             // const channel = client.channel("messaging", "the_park", {
//             //     name: "The Park",
//             // });
//             // await channel.watch();
//         }
//         connect()
// return ()=>{
//     client.disconnectUser()
//     setIsReady(false)
// }

//     },[])

//     if (!isReady) {
//        return (
//          <View
//            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
//          >
//            <ActivityIndicator size="large" color="#0000ff" />
//          </View>
//        );
//     }

//     return (
//         <OverlayProvider>
//             <Chat client={client}>{children}</Chat>
//         </OverlayProvider>

//     )
// } 



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
  const {profile} = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!profile){
      return
    }
    let mounted = true;

    const connect = async () => {
      try {
        await client.connectUser(
          {
            id: profile.id,
            name: profile.full_name,
            image: supabase.storage.from("avatars").getPublicUrl(profile.avatar_url).data.publicUrl,
          },
          client.devToken(profile.id)
        );

        if (mounted) {
          setIsReady(true);
        }
      } catch (err) {
        console.error("Stream connectUser failed:", err);
      }
    };

    connect();

    return () => {
      if(isReady){
         client.disconnectUser(); // cleanup
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
