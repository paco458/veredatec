import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import FAB from './components/FAB';

export default function App() {
  const[count, setCount] = useState(10);
  return (
    <View style={styles.container}>
      <Text style={styles.textHude}> {count} </Text>
      <FAB label='+1'
      onLongPress={() => setCount(0)}//va a inicializar el contador a 0 cuando se mantenga presionado
      onPress={() => setCount(count + 1)}//cuando se presiona el boton, se incrementa el contador
      position='right' //posicion del boton, se puede cambiar a left, top, bottom
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  textHude: {
    fontSize: 120,
    fontWeight: '100',
  },
  
});
