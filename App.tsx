// App.tsx
import React, { useState } from "react";
import { Tab, TabView } from "@rneui/themed";
import { StatusBar, SafeAreaView, View, Platform } from "react-native";

import About from "./components/About";
import Edit from "./components/Edit";
import Tracker from "./components/Tracker";
import { appStyles, colors, iconSizes } from "./assets/styles";

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
    <View style={{ flex: 1 }}>
      <SafeAreaView style={appStyles.safeAreaView}>
        <StatusBar barStyle="light-content" />
        <TabView
          value={index}
          onChange={setIndex}
          disableTransition={true}
          disableSwipe
        >
          <TabView.Item style={appStyles.tabView}>
            <About />
          </TabView.Item>
          <TabView.Item style={appStyles.tabView}>
            <Edit refreshData={refreshData} />
          </TabView.Item>
          <TabView.Item style={appStyles.tabView}>
            <Tracker refreshData={refreshData} />
          </TabView.Item>
        </TabView>
      </SafeAreaView>
      <Tab
        value={index}
        onChange={handleTabChange}
        disableIndicator
        style={[
          appStyles.shadow,
          appStyles.tabArea,
          { paddingBottom: Platform.OS === "ios" ? 20 : 0 },
        ]}
      >
        <Tab.Item
          title="Info"
          titleStyle={
            index === 0 ? appStyles.textPressed : appStyles.textNotPressed
          }
          icon={{
            name: "info",
            color: index === 0 ? colors.tabPressed : colors.light,
            size: iconSizes.tabIconSize,
          }}
        />
        <Tab.Item
          title="Chapters"
          titleStyle={
            index === 1 ? appStyles.textPressed : appStyles.textNotPressed
          }
          icon={{
            name: "list",
            color: index === 1 ? colors.tabPressed : colors.light,
            size: iconSizes.tabIconSize,
          }}
        />
        <Tab.Item
          title="Tracker"
          titleStyle={
            index === 2 ? appStyles.textPressed : appStyles.textNotPressed
          }
          icon={{
            name: "traffic",
            color: index === 2 ? colors.tabPressed : colors.light,
            size: iconSizes.tabIconSize,
          }}
        />
      </Tab>
    </View>
  );
};

export default App;
