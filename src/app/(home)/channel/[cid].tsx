import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Channel as ChannelType } from 'stream-chat';
import { Channel, MessageInput, MessageList, useChatContext } from "stream-chat-expo";

export default function ChannelScreen(){
    const [channel,setChannel]=useState<ChannelType | null>(null)
    const {cid}=useLocalSearchParams<{cid:string}>()

    const {client} = useChatContext()

    useEffect(()=>{
        const fetchChannel = async () => {
            const channels = await client.queryChannels({cid})
            setChannel(channels[0])
            console.log(channels)
        }
        fetchChannel()
    },[cid])

    if(!channel){
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
    return (
        <Channel channel={channel}>
            <MessageList />
            <SafeAreaView edges={['bottom']}>
                <MessageInput />
            </SafeAreaView>
            
        </Channel>
    )

}