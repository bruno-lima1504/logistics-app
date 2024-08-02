import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Separacao from "../pages/Separacao";
import Separar from "../pages/Separar";

const Stack = createNativeStackNavigator();

function SeparacaoRoute() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Separacao"
        component={Separacao}
        // key={route.params.pedido}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Separar"
        component={Separar}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default SeparacaoRoute;
