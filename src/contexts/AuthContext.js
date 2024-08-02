import React, { useState, createContext, ReactNode, useEffect } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { api } from "../services/api";

export const AuthContext = createContext({});

//criando esse elemento passamos todo nosso projeto para dentro desse context ao chamarmos o children dentro do contexto
export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    userId: "",
    name: "",
    email: "",
    sellerId: "",
    userIdGroup: "",
  });

  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [credentialsMsg, setCredentialsMsg] = useState(true);
  const [productsToScan, setProductsToScan] = useState([]);

  //verifica se existe algum dado na variavel passada e grava um  boolean na variavel declarada.
  const isAuthenticated = !!user.name;

  useEffect(() => {
    async function getUser() {
      //pegar os dados salvos do user
      const userInfo = await AsyncStorage.getItem("@pizzaria");
      let hasUser = JSON.parse(userInfo || "{}");
      if (Object.keys(hasUser).length > 0) {
        // api.defaults.headers.common["Authorization"] =
        //   `Bearer ${hasUser.token}`;
        setUser({
          userId: hasUser.userId,
          name: hasUser.name,
          email: hasUser.email,
          sellerId: hasUser.sellerId,
          userIdGroup: hasUser.userIdGroup,
        });
      }
      setLoading(false);
    }
    getUser();
  }, []);

  async function signIn({ usuario, password }) {
    setLoadingAuth(true);
    try {
      const response = await api.post("/loginapi", {
        usuario: usuario,
        senha: password,
      });

      const { userId, user, name, email, sellerId, userIdGroup } =
        response.data;

      if (response.data === "") {
        setCredentialsMsg(false);
        setLoadingAuth(false);
        return;
      }

      const data = {
        ...response.data,
      };

      setCredentialsMsg(true);

      await AsyncStorage.setItem("@pizzaria", JSON.stringify(data));

      setUser({
        userId,
        user,
        name,
        email,
        sellerId,
        userIdGroup,
      });

      setLoadingAuth(false);
    } catch (err) {
      console.log("erro ao acessar -> " + err);
      setLoadingAuth(false);
    }
  }

  async function signOut() {
    await AsyncStorage.clear().then(() => {
      setUser({
        userId: "",
        user: "",
        name: "",
        email: "",
        sellerId: "",
        userIdGroup: "",
      });
    });
  }

  async function getOrders() {
    try {
      const response = await api.get("/separacao");
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async function getProductOrder(pedido) {
    try {
      const response = await api.post("/separapedidos/separacao", {
        pedido: pedido,
      });
      let responseData = response.data;
      return responseData;
    } catch (error) {
      console.log(error);
    }
  }

  async function saveSeparateProducts(products) {
    try {
      const response = await api.post("/savesepareteproducts", {
        products: products,
        user: user,
      });

      // Pegue o status da resposta
      const status = response.status;

      if (status === 200) {
        console.log("Separação finalizada com sucesso");
        console.log(response.data); // Mensagem da resposta
      } else {
        console.log("Ocorreu algum problema, status:", status);
        console.log(response.data); // Mensagem da resposta
      }
    } catch (error) {
      if (error.response) {
        // Erro de resposta do servidor
        console.log("Erro:", error.response.status);
        console.log(error.response.data); // Mensagem da resposta
      } else {
        // Erro de configuração da solicitação ou outro erro
        console.log("Erro:", error.message);
      }
    }
  }

  async function getOrdersToCheckOut() {
    try {
      const response = await api.get("/conferepedidos");
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async function getProductsToCheckOut(pedido) {
    try {
      const response = await api.post("/produtosaconferir", {
        pedido: pedido,
      });
      let responseData = response.data;
      return responseData;
    } catch (error) {
      console.log(error);
    }
  }

  async function saveCheckOutProducts(products, location) {
    let checkedProducts = [];

    products.map((product) => {
      console.log();
      let item = {
        id_produtos_separar_pedido: product.id_produtos_separar_pedido,
        conferido: product.conferido,
        num_pedido: product.num_pedido,
        cod_prod: product.cod_prod,
        item: product.item,
      };
      checkedProducts.push(item);
    });

    try {
      const response = await api.post("/savecheckoutproducts", {
        pedidos: checkedProducts,
        user: user,
        local: location,
      });
      // Pegue o status da resposta
      const status = response.status;

      if (status === 200) {
        console.log("Separação finalizada com sucesso");
        console.log(response.data); // Mensagem da resposta
      } else {
        console.log("Ocorreu algum problema, status:", status);
        console.log(response.data); // Mensagem da resposta
      }
    } catch (error) {
      if (error.response) {
        // Erro de resposta do servidor
        console.log("Erro:", error.response.status);
        console.log(error.response.data); // Mensagem da resposta
      } else {
        // Erro de configuração da solicitação ou outro erro
        console.log("Erro:", error.message);
      }
    }
  }

  async function printTag(numPed, qtd, idPedido) {
    const print = {
      pedido: `${idPedido}:${numPed}`,
      name: user.name,
      quantidade: qtd,
    };
    console.log(print);

    try {
      const response = await api.post("/etiqueta", {
        print,
      });
      console.log(response);
      return response.status;
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        signIn,
        loadingAuth,
        credentialsMsg,
        loading,
        signOut,
        getOrders,
        getProductOrder,
        productsToScan,
        saveSeparateProducts,
        getOrdersToCheckOut,
        getProductsToCheckOut,
        saveCheckOutProducts,
        printTag,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
