import { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  FlatList,
  Button,
  Modal,
  Alert,
  Pressable,
} from "react-native";
import exercises from "../../assets/exercises/exercises.json";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function addWorkoutSplit(name: string) {
  try {
    const existingSplitsJson = await AsyncStorage.getItem("workoutSplit");
    const existingSplits = existingSplitsJson
      ? JSON.parse(existingSplitsJson)
      : [];
    const updatedSplits = [...existingSplits, name];
    await AsyncStorage.setItem("workoutSplit", JSON.stringify(updatedSplits));
  } catch (error) {
    console.error("Error saving workout split:", error);
  }
}

export async function getAllSplits() {
  try {
    const item = await AsyncStorage.getItem("workoutSplit");
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error("Error loading workout split:", error);
    return [];
  }
}

export default function WorkoutScreen() {
  const [text, setText] = useState("");
  const [splitText, setSplitText] = useState("");
  const [savedSplits, setSavedSplits] = useState<string[]>([]);
  const exerciseList = exercises;
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    async function loadSplits() {
      const splits = await getAllSplits();
      setSavedSplits(splits);
    }
    loadSplits();
  }, []);

  const handleAddSplit = async () => {
    if (!splitText.trim()) return;

    await addWorkoutSplit(splitText);
    const updatedSplits = await getAllSplits();
    setSavedSplits(updatedSplits);
    setSplitText("");
    setModalVisible(false);
  };

  return (
    <View style={{ paddingTop: 50 }}>
      <Text style={{ color: "#ffffff" }}>Workout-Splits</Text>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              placeholder="Name your split!"
              onChangeText={(newText) => setSplitText(newText)}
              value={splitText}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 10,
              }}
            >
              <Pressable
                style={[styles.button, styles.addButton]}
                onPress={handleAddSplit}
              >
                <Text style={styles.text}>Save</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.addButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.text}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Pressable
        style={[styles.button, styles.addButton]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.text}>Add Workout-Splits</Text>
      </Pressable>
      <FlatList
        data={savedSplits}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.text}>{item}</Text>}
      />
      <TextInput
        style={styles.input}
        placeholder="Search for exercises!"
        onChangeText={(newText) => setText(newText)}
        value={text}
      />

      <View style={styles.container}>
        <FlatList
          data={exerciseList.filter((exercise) =>
            exercise.names?.en?.toLowerCase().includes(text.toLowerCase()),
          )}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.text}>{item.names.en}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#252626",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 40,
    padding: 5,
    borderColor: "gray",
    borderWidth: 1,
    color: "#fff",
  },
  itemContainer: {
    padding: 5,
  },
  text: {
    color: "#fff",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#252626",
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#2196F3",
  },
});
