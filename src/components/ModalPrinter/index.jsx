import React, { useContext, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Button,
} from "react-native";
import Toast from "react-native-toast-message";

import { AuthContext } from "../../contexts/AuthContext";

//pega o tamanho da tela do usuário
const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

export function ModalPrinter({ handleCloseModal, numPed, idPedido }) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  const { printTag } = useContext(AuthContext);

  function onPressItem(item) {
    selectedItem(item);
    handleCloseModal();
  }

  function handlePrintTag() {
    const printStatus = printTag(numPed, inputValue, idPedido);
    handleCloseModal();
    console.log(printStatus);
    if (printStatus === "200") {
      showToast("success", "Etiqueta Impressa", "Finalizar conferência!");
    } else {
      showToast("success", "Etiqueta Impressa", "Finalizar conferência!");
    }
  }

  const showToast = (type, txt1, txt2) => {
    Toast.show({
      type: type,
      text1: txt1,
      text2: txt2,
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleCloseModal}>
      <View style={styles.content}>
        <Text style={styles.item}>Quantidade de Etiquetas</Text>
        <TextInput
          ref={inputRef}
          value={inputValue}
          onChangeText={setInputValue}
          style={styles.input}
          keyboardType="numeric"
        />
        <Button
          title="Imprimir"
          style={styles.printButton}
          onPress={handlePrintTag}
        ></Button>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: WIDTH - 20,
    height: HEIGHT / 3,
    backgroundColor: "#bfbaba",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    margin: 18,
    fontSize: 20,
    fontWeight: "bold",
    color: "#101026",
  },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    BorderColor: "#000",
    width: 250,
    height: 50,
    marginBottom: 10,
  },
});
