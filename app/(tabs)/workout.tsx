import { useState } from 'react';
import { Text, View, StyleSheet, TextInput } from 'react-native';
import exercises from '../../assets/exercises/exercises.json'; // Corrected import path
import { FlatList, ScrollView } from 'react-native-gesture-handler';

export default function WorkoutScreen() {
  const [text, setText] = useState('');
  const exerciseList = exercises;

  return (
    <ScrollView style={{ padding: 10 }}>
      <TextInput
        style={styles.input}
        placeholder="Search for exercises!"
        onChangeText={(newText) => setText(newText)}
        defaultValue={text}
      />
      <View style={styles.container}>
        <FlatList
          data={exerciseList.filter((exercise) =>
            exercise.names?.en?.toLowerCase().includes(text.toLowerCase())
          )}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.text}>{item.names.en}</Text>
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#252626',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    padding: 5,
    borderColor: 'gray',
    borderWidth: 1,
    color: '#fff',
  },
  itemContainer: {
    padding: 5,
  },
  text: {
    color: '#fff',
  },
});