// App.tsx
import React, { useState } from "react";
import { Tab, TabView } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { SafeAreaProvider } from "react-native-safe-area-context";

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
    <SafeAreaProvider style={{ backgroundColor: "#f9f4ef" }}>
      <SafeAreaView style={{ flex: 1 }}>
        <Tab
          value={index}
          onChange={handleTabChange}
          disableIndicator
          style={{ backgroundColor: "#8c7851" }}
        >
          <Tab.Item
            title="Info"
            titleStyle={{ fontSize: 12, color: "#f9f4ef", fontWeight: "bold" }}
            icon={{ name: "info", color: "#f9f4ef" }}
            containerStyle={(active) => ({
              backgroundColor: active ? "#a39373" : undefined,
            })}
          />
          <Tab.Item
            title="Edit"
            titleStyle={{ fontSize: 12, color: "#f9f4ef", fontWeight: "bold" }}
            icon={{ name: "edit", color: "#f9f4ef" }}
            containerStyle={(active) => ({
              backgroundColor: active ? "#a39373" : undefined,
            })}
          />
          <Tab.Item
            title="Tracker"
            titleStyle={{ fontSize: 12, color: "#f9f4ef", fontWeight: "bold" }}
            icon={{ name: "traffic", color: "#f9f4ef" }}
            containerStyle={(active) => ({
              backgroundColor: active ? "#a39373" : undefined,
            })}
          />
        </Tab>

        <TabView
          value={index}
          onChange={setIndex}
          disableTransition={true}
          disableSwipe
        >
          <TabView.Item style={{ flex: 1, paddingVertical: 10 }}>
            <About />
          </TabView.Item>
          <TabView.Item style={{ flex: 1, paddingVertical: 10 }}>
            <Edit refreshData={refreshData} />
          </TabView.Item>
          <TabView.Item style={{ flex: 1, paddingVertical: 10 }}>
            <Tracker refreshData={refreshData} />
          </TabView.Item>
        </TabView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;
