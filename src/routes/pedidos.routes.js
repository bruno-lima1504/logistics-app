import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Pedidos from "../pages/Separação";
import Separar from "../pages/Separar";

const Stack = createNativeStackNavigator();

function PedidosRoute() {
  return (
    <Stack.Navigator>      
      <Stack.Screen   
        name="Pedidos" 
        component={Pedidos} 
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

export default PedidosRoute;