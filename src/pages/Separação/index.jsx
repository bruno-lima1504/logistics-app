import React, { useContext, useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, SafeAreaView, StyleSheet } from "react-native";
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { AuthContext } from "../../contexts/AuthContext";

import OrderList from "../../components/OrderList";

export default function Pedidos() {
  const [orders, setOrders] = useState([]);  
  const { getOrders, singOut } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();

  const showToast = (type, txt1, txt2) => {
    Toast.show({
      type: type,
      text1: txt1,
      text2: txt2
    });
  };
  
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
  
      async function getOrdersList() {
        if (isActive) {
          setLoading(true); // Define o carregamento como verdadeiro quando a página é focada
          try {
            let responseOrders = await getOrders();        
            setOrders(responseOrders.pedidos || []);      
          } catch (error) {
            console.error('Error fetching orders:', error);
          } finally {
            if (isActive) {
              setLoading(false); // Define o carregamento como falso após a chamada
            }
          }
        }
      }
  
      getOrdersList();
  
      return () => {
        isActive = false; // Cleanup function to prevent state updates if component is unmounted
      };
    }, [])
  );
  // useEffect(() => {
  //   async function getOrdersList(){
  //     if (loading) { // Verifica se está carregando        
  //       let responseOrders = await getOrders();        
  //       setOrders(responseOrders.pedidos || []);      
  //       setLoading(false); // Define o carregamento como falso após a chamada
  //     }
  //   }
  //   getOrdersList();
  // }, [loading]);

  useEffect(() => {
    if (route.params?.toastType) {
      showToast(route.params.toastType, route.params.toastText1, route.params.toastText2);

      // Limpar os parâmetros após exibir o toast
      navigation.setParams({
        toastType: undefined,
        toastText1: undefined,
        toastText2: undefined
      });
    }

    async function getOrdersList(){
      let responseOrders = await getOrders();
      setOrders(responseOrders.pedidos || []);
    }
    getOrdersList();
  }, [route.params]);
  console.log(orders)

  return (
    <SafeAreaView style={styles.container}>      
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
});
