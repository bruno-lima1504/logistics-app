import React, { useContext } from "react";
import { View, Text, Button } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import "../../styles/global.css";

export default function Dashboard() {
  const {} = useContext(AuthContext);

  return (
    <View>
      <View>
        <Text className="text-red-500">TESTE</Text>
      </View>
    </View>
  );
}
