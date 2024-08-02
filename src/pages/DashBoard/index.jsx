import React, { useContext } from "react";
import { View, Text, Button } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import "../../styles/global.css";

export default function Dashboard() {
  const { signOut } = useContext(AuthContext);

  return (
    <View>
      <View>
        <Text className="text-red-500">TESTE</Text>
      </View>
      <Button title="Sair do App" onPress={signOut} />
    </View>
  );
}
