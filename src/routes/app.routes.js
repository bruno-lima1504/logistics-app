import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Feather } from "@expo/vector-icons";

import PedidosRoute from "../routes/pedidos.routes";
import ConferenciaRoute from "./conferencia.routes";
import Dashboard from "../pages/DashBoard";
import CustomDrawerContent from "../components/DrawerContent";

const Drawer = createDrawerNavigator();

function AppRoutes() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="DashBoard"
        component={Dashboard}
        options={{
          drawerIcon: ({ color, size }) => (
            <Feather name="home" color={"#000"} size={25} />
          ),
          drawerLabel: "DashBoard",
        }}
      />
      <Drawer.Screen
        name="Separação"
        component={PedidosRoute}
        options={{
          drawerIcon: ({ color, size }) => (
            <Feather name="clipboard" color={"#000"} size={25} />
          ),
          drawerLabel: "Separação",
        }}
      />
      <Drawer.Screen
        name="Pedidos com itens a substituir"
        component={PedidosRoute}
        options={{
          drawerIcon: ({ color, size }) => (
            <Feather name="tool" color={"#000"} size={25} />
          ),
          drawerLabel: "Substituir Item",
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
