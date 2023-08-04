import React, { useState, useEffect } from "react";
import { ListItem, Icon, Button, Dialog, Text } from "@rneui/themed";
import { View } from "react-native";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { setCustomData, Chapter } from "./storageutil";

export interface Item {
  key: string; // unique key for each entry
  id: number; // this will be based on the sort order of the user
  name: string;
  enableInput: boolean; // to turn on or off the edit for each field
}

const InputComponent: React.FC = () => {
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [currentKey, setCurrentKey] = useState<string | null>(null);
  const [focusedInputKey, setFocusedInputKey] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([
    { key: uuidv4(), id: 1, name: "Add entry", enableInput: false },
    { key: uuidv4(), id: 2, name: "Add entry", enableInput: false },
    { key: uuidv4(), id: 3, name: "Add entry", enableInput: false },
    { key: uuidv4(), id: 4, name: "Add entry", enableInput: false },
  ]);

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
      }));
      setItems(updatedSortedItems);
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
      }));
      setItems(updatedSortedItems);
    }
  };

  // Add a new item to the list
  const addNewItem = async () => {
    const updatedItems = items.map((item) => ({
      ...item,
      enableInput: false,
    }));
    const newItemId = updatedItems.length + 1;

    const newItem: Item = {
      key: uuidv4(),
      id: newItemId,
      name: `Add entry`,
      enableInput: true,
    };
    const newItems = [...updatedItems, newItem];
    setItems(newItems);
    setFocusedInputKey(newItem.key); // Set the focused input key
  };

  // Delete an item from the list once the user confirms
  const deleteItem = () => {
    const index = items.findIndex((item) => item.key === currentKey);
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    const updatedSortedItems = updatedItems.map((item, idx) => ({
      ...item,
      id: idx + 1,
    }));
    setItems(updatedSortedItems);
    setDialogVisible(false);
    setCurrentKey(null);
  };

  // When the user clicks on the delete icon next to an item
  const handleDeleteIcon = async (key: string) => {
    await toggleEnableInput(null);
    setDialogVisible(true);
    setCurrentKey(key);
  };

  // toggle the input of the field on an off
  const toggleEnableInput = async (row: Item | null): Promise<void> => {
    // if we pass an item, flip it off
    if (row) {
      const updatedItems = items.map((item) =>
        item.key === row.key ? { ...item, enableInput: !row.enableInput } : item
      );
      setItems(updatedItems);
    } else {
      const updatedItems = items.map((item) => ({
        ...item,
        enableInput: false,
      }));
      setItems(updatedItems);
    }
  };

  const handleUpdate = async (key: string, newName: string) => {
    const updatedItems = items.map((item) =>
      item.key === key ? { ...item, name: newName } : item
    );
    setItems(updatedItems);
    const data = updatedItems.map((item) => ({
      id: item.id,
      name: item.name,
      review: false,
      date: "not reviewed",
      transliteration: item.name,
      total_verses: null,
      type: null,
    }));
    setCustomData(data);
  };

  return (
    <View style={{ alignItems: "center" }}>
      <Dialog
        isVisible={dialogVisible}
        onBackdropPress={() => {
          setDialogVisible(false), setCurrentKey(null);
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
              setDialogVisible(false);
              setCurrentKey(null);
            }}
          />
        </Dialog.Actions>
      </Dialog>
      {items.map((item, index) => (
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
            <ListItem.Input
              placeholder={item.name}
              inputStyle={{ textAlign: "left" }}
              disabled={!item.enableInput}
              autoCorrect={false}
              autoFocus={focusedInputKey === item.key}
              onPressIn={() => {
                toggleEnableInput(item);
                setFocusedInputKey(item.key);
              }}
              onEndEditing={(e: any) => {
                handleUpdate(item.key, e.nativeEvent.text);
              }}
              onBlur={() => {
                if (item.enableInput) {
                  toggleEnableInput(item);
                }
              }}
              returnKeyType="done"
              maxLength={20}
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
      ))}
      <Button
        title="New entry"
        onPress={() => {
          addNewItem();
        }}
        radius={15}
        style={{ width: 120, paddingVertical: 10 }}
        color={"#8c7851"}
        type="outline"
        buttonStyle={{ borderColor: "#8c7851" }}
        titleStyle={{ fontSize: 16, color: "#8c7851", paddingHorizontal: 5 }}
        icon={<Icon name="add-circle" size={20} color="#8c7851" />}
      />
    </View>
  );
};

export default InputComponent;
