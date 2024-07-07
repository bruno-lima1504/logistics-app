import React, { useContext, useEffect, useState, useRef } from "react";
import { View, TextInput, FlatList, SafeAreaView, StyleSheet, Platform } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { AuthContext } from "../../contexts/AuthContext";
import OrderList from "../../components/OrderList";

export default function Conferir() {
  const [leitura, setLeitura] = useState([]);
  const [inputValue, setInputValue] = useState(''); 
  const [orders, setOrders] = useState([]);
  const { getOrdersToCheckOut } = useContext(AuthContext);
  const inputRef = useRef(null); 
  const navigation = useNavigation();
  const route = useRoute();

  const showToast = (type, txt1, txt2) => {
    Toast.show({
      type: type,
      text1: txt1,
      text2: txt2
    });
  };

  useEffect(() => {    
    inputRef.current?.focus();    

    const interval = setInterval(() => {
      if (inputRef.current && !inputRef.current.isFocused()) {
        inputRef.current.focus();
      }
    }, 1000);

    return () => clearInterval(interval); 
  }, []);

  useEffect(() => {
    async function getOrdersList(){
      let responseOrders = await getOrdersToCheckOut();
      setOrders(responseOrders.pedidos || []);
    }
    getOrdersList();
  },[]);

  useEffect(() => {
    if (route.params?.toastType) {
      showToast(route.params.toastType, route.params.toastText1, route.params.toastText2);

      // Clear the parameters after showing the toast
      navigation.setParams({
        toastType: undefined,
        toastText1: undefined,
        toastText2: undefined
      });
    }

    async function getOrdersList(){
      let responseOrders = await getOrdersToCheckOut();
      setOrders(responseOrders.pedidos || []);
    }
    getOrdersList();
  }, [route.params]);

  const handleInputChange = (text) => {     
    let qrValue = text.split(/[;�:]/); 
    setInputValue('');
    setLeitura(qrValue);
    console.log(leitura);
  };

  useEffect(() => {
    if (leitura.length > 0) {
      verifyItem();
    }
  }, [leitura]);

  const verifyItem = () => {    
    let nPedido = leitura[0];
    console.log(nPedido);               
    navigation.navigate("Conferir", {
      pedido: nPedido,
    });
  };    

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        ref={inputRef}
        value={inputValue}
        style={styles.hiddenInput}
        onChangeText={text => {
          setInputValue(text);
          handleInputChange(text);
        }}
        autoFocus={true}
        keyboardType="default"
        showSoftInputOnFocus={Platform.OS === 'android' ? false : undefined} // Disable the keyboard on Android
      />
      
      <FlatList
        data={orders}
        keyExtractor={(item) => String(item.id_separar_pedidos)}
        renderItem={({ item }) => <OrderList data={item} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FB",
    marginTop: 15,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '80%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  hiddenInput: {
    position: 'absolute',
    top: -1000, // Mantém o input fora da tela
    height: 0, // Sem altura visível
    width: 0, // Sem largura visível
    opacity: 0, // Totalmente transparente
  },
});
