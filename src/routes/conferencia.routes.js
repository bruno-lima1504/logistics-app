import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Conferencia from "../pages/Conferencia";
import Conferir from "../pages/Conferir";

const Stack = createNativeStackNavigator();

export default function ConferenciaRoute() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Conferencias"
        component={Conferencia}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Conferir"
        component={Conferir}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
