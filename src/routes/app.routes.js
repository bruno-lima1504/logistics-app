import React from "react";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Feather } from "@expo/vector-icons";

import PedidosRoute from "../routes/pedidos.routes";
import ConferenciaRoute from "./conferencia.routes";
import Dashboard from "../pages/DashBoard";

const Drawer = createDrawerNavigator();

function AppRoutes() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="inicio"
        component={Dashboard}
        options={{
          drawerIcon: ({ color, size }) => (
            <Feather name="home" color={"#000"} size={25} />
          ),
          drawerLabel: "Inicio",
        }}
      />
      <Drawer.Screen
        name="Pedido"
        component={PedidosRoute}
        options={{
          drawerIcon: ({ color, size }) => (
            <Feather name="clipboard" color={"#000"} size={25} />
          ),
          drawerLabel: "Pedido",
        }}
      />
      <Drawer.Screen
        name="Conferencia"
        component={ConferenciaRoute}
        options={{
          drawerIcon: ({ color, size }) => (
            <Feather name="check-circle" color={"#000"} size={25} />
          ),
          drawerLabel: "Conferencia",
        }}
      />
    </Drawer.Navigator>
  );
}

export default AppRoutes;
