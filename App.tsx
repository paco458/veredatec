import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens/home";
import Login from "./screens/Login";

export default function App() {
  const Stack = createNativeStackNavigator();
  function HomeScreen() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            title: "Login", // Title for the Login screen
            headerTintColor: "#fff", // Color of the header tex
            headerTitleAlign: "center", // Center the title
            headerStyle: {
              backgroundColor: "#f4511e", // Background color of the header
            },
          }}
        />
        <Stack.Screen
          name="home"
          component={Home}
          options={{
            title: "Login", // Title for the Login screen
            headerTintColor: "#fff", // Color of the header tex
            headerTitleAlign: "center", // Center the title
            headerStyle: {
              backgroundColor: "#f4511e", // Background color of the header
            },
          }}
        />
      </Stack.Navigator>
    );
  }
  return (
    <NavigationContainer>
      <HomeScreen />
    </NavigationContainer>
  );
}
