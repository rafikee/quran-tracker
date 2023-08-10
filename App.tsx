// App.tsx
import React, { useState } from "react";
import { Tab, TabView } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar, View, Text } from "react-native";

import About from "./components/About";
import Edit from "./components/Edit";
import Tracker from "./components/Tracker";

const App: React.FC = () => {
  const [index, setIndex] = useState(2);
  const [refreshData, setRefreshData] = useState(false);

  const handleTabChange = (newIndex: number) => {
    if (newIndex > 0) {
      setRefreshData((prevValue) => !prevValue);
    }
    setIndex(newIndex); // Update the selected tab index
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <TabView
        value={index}
        onChange={setIndex}
        disableTransition={true}
        disableSwipe
      >
        <TabView.Item style={{ backgroundColor: "#f9f4ef" }}>
          <About />
        </TabView.Item>
        <TabView.Item style={{ flex: 1, backgroundColor: "#f9f4ef" }}>
          <Edit refreshData={refreshData} />
        </TabView.Item>
        <TabView.Item style={{ flex: 1, backgroundColor: "#f9f4ef" }}>
          <Tracker refreshData={refreshData} />
        </TabView.Item>
      </TabView>

      <Tab
        value={index}
        onChange={handleTabChange}
        disableIndicator
        style={{
          paddingBottom: 20,
          backgroundColor: "#8c7851",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.5,
          shadowRadius: 8,
          elevation: 5,
          borderTopWidth: 0.5,
        }}
      >
        <Tab.Item
          title="Info"
          titleStyle={{
            fontSize: 12,
            color: index === 0 ? "black" : "#f9f4ef",
            fontWeight: "bold",
          }}
          icon={{
            name: "info",
            color: index === 0 ? "black" : "#f9f4ef",
            size: 30,
          }}
        />
        <Tab.Item
          title="Chapters"
          titleStyle={{
            fontSize: 12,
            color: index === 1 ? "black" : "#f9f4ef",
            fontWeight: "bold",
          }}
          icon={{
            name: "list",
            color: index === 1 ? "black" : "#f9f4ef",
            size: 30,
          }}
        />
        <Tab.Item
          title="Tracker"
          titleStyle={{
            fontSize: 12,
            color: index === 2 ? "black" : "#f9f4ef",
            fontWeight: "bold",
          }}
          icon={{
            name: "traffic",
            color: index === 2 ? "black" : "#f9f4ef",
            size: 30,
          }}
        />
      </Tab>
    </SafeAreaProvider>
  );
};

export default App;
