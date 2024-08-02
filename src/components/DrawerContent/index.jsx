import React, { useContext } from "react";
import { View, Text, Button, Image } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { Feather } from "@expo/vector-icons";
import { AuthContext } from "../../contexts/AuthContext";

function CustomDrawerContent(props) {
  const { signOut } = useContext(AuthContext);

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View className="flex justify-center items-center w-full py-4">
        <Image source={require("../../../assets/HannaLogoBlue-small.png")} />
      </View>
      <DrawerItemList {...props} />
      <View className="mt-auto">
        <DrawerItem
          label="Logout"
          icon={({ color, size }) => (
            <Feather name="log-out" color={"#FF0000"} size={size} />
          )}
          onPress={signOut}
        />
      </View>
    </DrawerContentScrollView>
  );
}

export default CustomDrawerContent;
