import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

export default function ProductList({ data }) {    
  
  const backgroundColor = data.qtd_leituras === '0' 
  ? "#a39292" :
   data.qtd_leituras === data.qtd_total ?
    "#00FF7F" :
    "#FF8C00"
   ;
  const dynamicStyles = { ...styles.orderCard, backgroundColor };
  
  return (
    <TouchableOpacity style={dynamicStyles} >
      <Text style={styles.orderNum}>Cod. Produto: {data.cod_prod}</Text>
      <Text style={styles.orderDescProd}>Desc. Produto: {data.prod_desc}</Text>
      <Text style={styles.bodyText}>Localização: {data.localizacao}</Text>      

      <Text style={styles.bodyText}>
        Quantidade: {data.qtd_leituras} / {data.qtd_total}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  orderCard: {
    height: 150,
    width: 300,
    elevation: 3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    marginTop: 15,
    borderRadius: 4,
  },
  orderNum: {
    fontSize: 18,
    marginBottom: 5,
    padding: 5,
  },
  orderDescProd: {
    fontSize: 13,
    marginBottom: 5,
    padding: 5,
  },
  bodyText: {
    fontSize: 15,
    margin: 5,
  },
});
