import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";

export default function TabsNavigation() {
    return (
        <Tabs>
            <Tabs.Screen
                name="contact"
                options={{
                    title: "Contacts",
                    tabBarIcon: ({ size, color }) => (
                        <FontAwesome5 name="user-alt" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="calls"
                options={{
                    title: "Calls",
                    tabBarIcon: ({ size, color }) => (
                        <MaterialIcons name="call" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="index"
                options={{
                    title: "Chats",
                    tabBarIcon: ({ size, color }) => (
                        <Ionicons name="chatbubbles" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: "Settings",
                    tabBarIcon: ({ size, color }) => (
                        <Ionicons name="settings" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
