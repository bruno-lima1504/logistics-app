import React, { useState, useContext, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  SafeAreaView,
  StyleSheet,
  Button,
  Platform,
  ActivityIndicator,
  Modal,
} from "react-native";

import { useRoute, useNavigation } from "@react-navigation/native";
import { FlatList } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

import { AuthContext } from "../../contexts/AuthContext";

import ProductList from "../../components/ProductList";

import { ModalPrinter } from "../../components/ModalPrinter";

export default function Separar() {
  const [cardInfo, setCardInfo] = useState([]);
  const [products, setProducts] = useState([]);
  const [leitura, setLeitura] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showFinishButton, setShowFinishButton] = useState(false);
  const [idPedido, setIdPedido] = useState("");
  const [numPedido, setNumPedido] = useState("");
  const [modalPrintVisible, setModalPrintVisible] = useState(false);
  const [isProductLoaded, setIsProductLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const { getProductOrder, saveSeparateProducts } = useContext(AuthContext);

  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    inputRef.current?.focus();
    const interval = setInterval(() => {
      if (inputRef.current && inputRef.current.isFocused() === false) {
        inputRef.current.focus();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function getOrderProducts() {
      try {
        let responseOrders = await getProductOrder(route.params.pedido);
        setCardInfo(responseOrders.itens_card || []);
        setProducts(responseOrders.itens_pedido || []);
        setIsProductLoaded(true);
      } catch (error) {
        console.error("Error fetching product order:", error);
      }
    }
    getOrderProducts();
  }, [route.params.pedido]);

  useEffect(() => {
    if (products.length > 0) {
      setIdPedido(products[0].id_separar_pedidos);
      setNumPedido(products[0].num_pedido);
    }
  }, [products]);

  useEffect(() => {
    if (leitura.length > 0) {
      verifyItem();
    }
  }, [leitura]);

  useEffect(() => {
    if (isProductLoaded) {
      const completScan = products.find(
        (product) => !product.num_serie && !product.lote,
      );
      if (!completScan) {
        console.log("Todos os produtos escaneados.");
        finishSeparete();
      }
    }
  }, [products, isProductLoaded]);

  function finishSeparete() {
    setShowFinishButton(true);
  }

  async function handleFinishSeparate() {
    setIsLoading(true); // Iniciar carregamento
    try {
      await saveSeparateProducts(products);
      setIsLoading(false);
    } catch (error) {
      navigation.navigate("Pedidos", {
        toastType: "error",
        toastText1: "Erro",
        toastText2: "Ocorreu um erro ao finalizar a separação",
      });
    } finally {
      navigation.navigate("Pedido", {
        toastType: "success",
        toastText1: "Pedido separado!",
        toastText2: "Separação finalizada com sucesso",
      });
    }
  }

  const handleInputChange = (text) => {
    let qrValue = text.split(/[;�:]/);
    setInputValue("");
    setLeitura(qrValue);
  };

  function verifyItem() {
    let item;
    const verifiyCode = products.find(
      (product) =>
        product.cod_prod === leitura[0] && product.num_serie === leitura[1],
    );
    if (!verifiyCode) {
      item = products.find(
        (product) =>
          product.cod_prod === leitura[0] &&
          !product.num_serie &&
          !product.lote,
      );
    } else {
      showToast("error", "Leitura Invalida", "Leitura já realizada!");
      return;
    }
    console.log(products);
    if (item) {
      let infosQrcode = item.seqcb.split(";");
      let campoMap = {
        C: "cod_prod",
        L: "lote",
        S: "num_serie",
        O: "origem",
        V: "validade",
        D: "prod_desc",
      };

      // Atualizando os campos do objeto item com base na leitura e no infosQrcode
      for (let i = 0; i < infosQrcode.length; i++) {
        let letra = infosQrcode[i];
        if (campoMap[letra]) {
          item[campoMap[letra]] = leitura[i];
        }
      }

      setProducts([...products]); // Forçar re-renderização

      setCardInfo((prevCardInfo) =>
        prevCardInfo.map((card) =>
          card.cod_prod === item.cod_prod
            ? {
                ...card,
                qtd_leituras: (parseInt(card.qtd_leituras) + 1).toString(),
              }
            : card,
        ),
      );
    } else {
      showToast(
        "error",
        "Leitura Invalida",
        "Item não pertence a esse pedido!",
      );
      return;
    }
  }
  function handlePrinter() {
    setModalPrintVisible(true);
  }

  console.log(products);

  const showToast = (type, txt1, txt2) => {
    Toast.show({
      type: type,
      text1: txt1,
      text2: txt2,
    });
  };
  return (
    <SafeAreaView style={styles.container1}>
      <TextInput
        ref={inputRef}
        value={inputValue}
        style={styles.input}
        onChangeText={(text) => {
          setInputValue(text);
          handleInputChange(text);
        }}
        autoFocus={true}
        keyboardType="default"
        showSoftInputOnFocus={Platform.OS === "android" ? false : undefined} // Desabilitar o teclado no Android
      />
      <FlatList
        data={cardInfo}
        renderItem={({ item }) => <ProductList data={item} />}
        keyExtractor={(item) => item.cod_prod}
        style={styles.flatList}
      />
      {showFinishButton && (
        <View style={styles.buttonContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <>
              <Button
                title="Imprimir Etiqueta"
                onPress={handlePrinter}
                style={styles.printButton}
              />
              <Button
                title="Finalizar Separação"
                onPress={handleFinishSeparate}
                style={styles.saveButton}
              />
            </>
          )}
        </View>
      )}
      <Modal
        transparent={true}
        visible={modalPrintVisible}
        animationType="fade"
      >
        <ModalPrinter
          handleCloseModal={() => {
            setModalPrintVisible(false);
          }}
          numPed={numPedido}
          idPedido={idPedido}
          // options={products}
          // selectedItem={handleChangeProduct}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FB",
    marginTop: 15,
    marginBottom: 10,
  },
  container: {
    flex: 2,
    width: 250,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FB",
    marginTop: 15,
  },
  closeButton: {
    padding: 10,
    backgroundColor: "red", // Cor do botão
    borderRadius: 5,
  },
  buttonText: {
    color: "white", // Cor do texto
  },
  hiddenInput: {
    position: "absolute",
    top: -1000, // Mantém o input fora da tela
    height: 0, // Sem altura visível
    width: 0, // Sem largura visível
    opacity: 0, // Totalmente transparente
  },
  input: {
    height: 10,
    opacity: 0,
  },
  buttonContainer: {},
  printButton: {
    margin: 5,
  },
  flatList: {
    marginBottom: 12,
  },
});
