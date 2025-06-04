import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function Login() {
  return (
    <View style={styles.padre}>
      <View>
        <Image
          source={require("../assets/favicon.png")}
          style={styles.profile}
        />
      </View>
      <View style={styles.tarjeta}>
        <View style={styles.cajaTexto}>
          <TextInput
            placeholder="correo@gmail.com"
            style={{ paddingHorizontal: 15 }}
          />
        </View>
        <View style={styles.cajaTexto}>
          <TextInput
            placeholder="contraseña"
            secureTextEntry={true}
            style={{ paddingHorizontal: 15 }}
          />
        </View>
        <View style={styles.PadreBoton}>
          <TouchableOpacity style={styles.cajaBoton}>
            <Text style={styles.textoBoton}>Ingresar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  padre: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  profile: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  tarjeta: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    width: "90%",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      //asegurar que la sombra se vea bien
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cajaTexto: {
    paddingVertical: 20,
    backgroundColor: "#cccccc40",
    borderRadius: 30,
    marginVertical: 10,
  },
  PadreBoton: {
    alignItems: "center",
  },
  cajaBoton: {
    backgroundColor: "#525FE1",
    borderRadius: 30,
    paddingVertical: 20,
    width: 150,
    marginTop: 20,
  },
  textoBoton: {
    textAlign: "center",
    color: "white",
  },
});
