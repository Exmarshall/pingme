import {
    StreamCall,
    StreamVideo,
    StreamVideoClient,
    User,
} from "@stream-io/video-react-native-sdk";
import { Text } from "react-native";



const apiKey = process.env.EXPO_PUBLIC_STREAM_API_KEY;
const userId = " 8e7ca470-696f-46e6-b0da-a9871d8d8a59";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOGU3Y2E0NzAtNjk2Zi00NmU2LWIwZGEtYTk4NzFkOGQ4YTU5In0=.devtoken";
const callId = "my-call-id";
const user: User = { id: userId };


const client = new StreamVideoClient({ apiKey, user, token });
const call = client.call("default", callId);
call.join({ create: true });

export default function CallScreen(){
    return(
        <Text>Call Screen</Text>
    )
}