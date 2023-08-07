import React, { useState, useEffect } from "react";
import { ListItem, Icon, Button, Dialog, Text, Input } from "@rneui/themed";
import { View, ScrollView } from "react-native";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { setCustomData, getCustomData, updateFormat } from "./storageutil";

export interface Item {
  key: string; // unique key for each entry
  id: number; // this will be based on the sort order of the user
  name: string;
  enableInput: boolean; // to turn on or off the edit for each field
  review: boolean;
  date: Date | string;
}

// when we press the done button here we need to close the overlay in edit.tsx
interface InputComponentProps {
  onDone: () => void;
}

const ENTRY_LIMIT = 100; // how many entries can a user add in custom mode
const MAX_LENGTH = 20; // max length of input string for an entry

const InputComponent: React.FC<InputComponentProps> = ({ onDone }) => {
  const [inputDialogVisible, setInputDialogVisible] = useState<boolean>(false);
  const [limitDialogVisible, setLimitDialogVisible] = useState<boolean>(false);
  const [deleteDialogVisible, setDeleteDialogVisible] =
    useState<boolean>(false);
  const [inputDialogValue, setInputDialogValue] = useState<string>("");
  const [currentKey, setCurrentKey] = useState<string | null>(null);
  const [focusedInputKey, setFocusedInputKey] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([
    {
      key: uuidv4(),
      id: 1,
      name: "New entry",
      enableInput: false,
      review: false,
      date: "Not reviewed",
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await updateFormat(2);
        const result = await getCustomData();
        const data = result.map((item) => ({
          key: uuidv4(),
          id: item.id,
          name: item.name,
          enableInput: false,
          date: item.date,
          review: item.review,
        }));
        setItems(data);
      } catch (error) {
        console.error("Error fetching data :(...", error);
      }
    };
    fetchData();
  }, []);

  // move an item up in the sort order
  const moveItemUp = async (index: number) => {
    if (index > 0) {
      const updatedItems = items.map((item) => ({
        ...item,
        enableInput: false,
      }));
      const itemToMove = updatedItems.splice(index, 1)[0];
      updatedItems.splice(index - 1, 0, itemToMove);
      // Update IDs to maintain ascending order
      const updatedSortedItems = updatedItems.map((item, idx) => ({
        ...item,
        id: idx + 1,
        transliteration: item.name,
        total_verses: null,
        type: null,
      }));
      setItems(updatedSortedItems);
      setCustomData(updatedSortedItems);
    }
  };

  // move an item down in the sort order
  const moveItemDown = async (index: number) => {
    const updatedItems = items.map((item) => ({
      ...item,
      enableInput: false,
    }));
    if (index < items.length - 1) {
      const itemToMove = updatedItems.splice(index, 1)[0];
      updatedItems.splice(index + 1, 0, itemToMove);
      // Update IDs to maintain ascending order
      const updatedSortedItems = updatedItems.map((item, idx) => ({
        ...item,
        id: idx + 1,
        transliteration: item.name,
        total_verses: null,
        type: null,
      }));
      setItems(updatedSortedItems);
      setCustomData(updatedSortedItems);
    }
  };

  // Add a new item to the list
  const addNewItem = async () => {
    if (items.length < ENTRY_LIMIT) {
      const updatedItems = items.map((item) => ({
        ...item,
        enableInput: false,
      }));
      const newItemId = updatedItems.length + 1;

      const newItem: Item = {
        key: uuidv4(),
        id: newItemId,
        name: `New entry`,
        enableInput: true,
        review: false,
        date: "Not reviewed",
      };
      const newItems = [...updatedItems, newItem];
      setItems(newItems);
      showInputDialog(newItem);
    } else {
      setLimitDialogVisible(true);
    }
  };

  // Delete an item from the list once the user confirms
  const deleteItem = () => {
    const index = items.findIndex((item) => item.key === currentKey);
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    const updatedSortedItems = updatedItems.map((item, idx) => ({
      ...item,
      id: idx + 1,
      transliteration: item.name,
      total_verses: null,
      type: null,
    }));
    setItems(updatedSortedItems);
    setCustomData(updatedSortedItems);
    setDeleteDialogVisible(false);
    setCurrentKey(null);
  };

  // When the user clicks on the delete icon next to an item
  const handleDeleteIcon = async (key: string) => {
    setDeleteDialogVisible(true);
    setCurrentKey(key);
  };

  const showInputDialog = (item: Item) => {
    setCurrentKey(item.key);
    setInputDialogValue(item.name != "New entry" ? item.name : "");
    setInputDialogVisible(true);
  };

  // handle the input dialog box when a user edits an entry or adds new one
  const handleUpdate = async (key: string | null, newName: string) => {
    if (!key) {
      // this sould never happen
      console.log("oops");
    } else {
      if (newName === "") {
        newName = "New entry";
      }
      const updatedItems = items.map((item) =>
        item.key === key ? { ...item, name: newName } : item
      );
      setItems(updatedItems);
      const data = updatedItems.map((item) => ({
        id: item.id,
        name: item.name,
        review: item.review,
        date: item.date,
        transliteration: item.name,
        total_verses: null,
        type: null,
      }));
      setCustomData(data);
    }
    setInputDialogVisible(false);
    setCurrentKey(null);
  };

  const handleDone = async () => {
    const data = items.map((item) => ({
      id: item.id,
      name: item.name,
      review: item.review,
      date: item.date,
      transliteration: item.name,
      total_verses: null,
      type: null,
    }));
    setCustomData(data);
  };

  const renderInputDialog = () => {
    return (
      <Dialog
        isVisible={inputDialogVisible}
        overlayStyle={{
          borderRadius: 10,
          backgroundColor: "#f9f4ef",
          paddingBottom: 0,
          paddingTop: 10,
          paddingHorizontal: 5,
        }}
      >
        <Input
          placeholder="New entry"
          defaultValue={inputDialogValue}
          autoFocus={true}
          autoCorrect={false}
          returnKeyType="done"
          maxLength={MAX_LENGTH}
          onEndEditing={(e: any) => {
            const value = e.nativeEvent.text;
            handleUpdate(currentKey, value);
          }}
        />
      </Dialog>
    );
  };

  const renderLimitDialog = () => {
    return (
      <Dialog
        isVisible={limitDialogVisible}
        overlayStyle={{ borderRadius: 10 }}
        onBackdropPress={() => setLimitDialogVisible(false)}
      >
        <Dialog.Title title="Too many entries" />
        <Text>{`The maximum number of entries is: ` + ENTRY_LIMIT}</Text>
        <Dialog.Actions>
          <Dialog.Button
            title="OK"
            onPress={() => setLimitDialogVisible(false)}
          />
        </Dialog.Actions>
      </Dialog>
    );
  };

  // Dialog to delete
  const renderDeleteDialog = () => {
    return (
      <Dialog
        isVisible={deleteDialogVisible}
        onBackdropPress={() => {
          setDeleteDialogVisible(false), setCurrentKey(null);
        }}
        overlayStyle={{ borderRadius: 10 }}
      >
        <Dialog.Title title="Please confirm to delete" />
        <Text style={{ paddingVertical: 10 }}>
          If you have a date associated with this in the tracker it will also be
          deleted.
        </Text>

        <Dialog.Actions>
          <Dialog.Button
            title="Delete"
            buttonStyle={{ backgroundColor: "#C34A2C" }}
            titleStyle={{ color: "white", fontWeight: "bold" }}
            onPress={deleteItem}
            containerStyle={{ paddingLeft: 10 }}
          />
          <Dialog.Button
            title="Cancel"
            type="outline"
            buttonStyle={{ borderColor: "#8c7851" }}
            titleStyle={{ color: "#8c7851" }}
            onPress={() => {
              setDeleteDialogVisible(false);
              setCurrentKey(null);
            }}
          />
        </Dialog.Actions>
      </Dialog>
    );
  };

  const renderList = () => {
    return items.map((item, index) => (
      <View
        key={item.key}
        style={{
          flexDirection: "row",
          marginBottom: 5, // Increase spacing between buttons
        }}
      >
        <Icon
          name="delete"
          size={20}
          color={"#8c7851"}
          onPress={() => handleDeleteIcon(item.key)}
          style={{ paddingRight: 10, paddingTop: 10 }}
        />
        <ListItem
          containerStyle={{
            padding: 5,
            width: 200,
            height: 30,
            borderRadius: 10,
            backgroundColor: "white",
            marginVertical: 5,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <ListItem.Title>{item.name}</ListItem.Title>
          <Icon
            name="edit"
            size={20}
            color={"#8c7851"}
            onPress={() => showInputDialog(item)}
          />
        </ListItem>
        {index > 0 ? (
          <Icon
            name="expand-less"
            size={40}
            color={"#8c7851"}
            onPress={() => moveItemUp(index)}
          />
        ) : (
          <View style={{ width: 40, height: 40 }} /> // Empty place holder because we don't need top arrow
        )}
        {index < items.length - 1 ? (
          <Icon
            size={40}
            color={"#8c7851"}
            name="expand-more"
            onPress={() => moveItemDown(index)}
          />
        ) : (
          <View style={{ width: 40, height: 40 }} /> // Empty place holder because we don't need bottom arrow
        )}
      </View>
    ));
  };

  return (
    <View style={{ alignItems: "center" }}>
      {renderInputDialog()}
      {renderLimitDialog()}
      {renderDeleteDialog()}
      <ScrollView style={{ maxHeight: 400 }}>
        {renderList()}
        <Button
          title="New entry"
          onPress={() => {
            addNewItem();
          }}
          radius={15}
          style={{ width: 120, paddingVertical: 10, alignSelf: "center" }}
          color={"#8c7851"}
          type="outline"
          buttonStyle={{ borderColor: "#8c7851" }}
          titleStyle={{ fontSize: 16, color: "#8c7851", paddingHorizontal: 5 }}
          icon={<Icon name="add-circle" size={20} color="#8c7851" />}
        />
      </ScrollView>
      <Button
        style={{
          paddingVertical: 10,
          alignSelf: "center",
        }}
        buttonStyle={{ width: 75 }}
        color={"#8c7851"}
        radius={"sm"}
        onPress={() => {
          handleDone();
          onDone(); // Call the onDone function from props
        }}
      >
        Done
      </Button>
    </View>
  );
};

export default InputComponent;
