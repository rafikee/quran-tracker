// App.tsx
import React, { useState } from "react";
import { Tab, TabView } from "@rneui/themed";
import { StatusBar, SafeAreaView, View, Platform } from "react-native";

// Import components from other files
import About from "./components/About";
import Edit from "./components/Edit";
import Tracker from "./components/Tracker";
import { appStyles, colors, iconSizes } from "./assets/styles";

const App: React.FC = () => {
  // the index determines which tab we are showing
  const [index, setIndex] = useState(2);
  // when this changes, we will refresh the data in the Tracker/Edit components
  // it gets passed to those componenets as a prop
  const [refreshData, setRefreshData] = useState(false);

  // Toggle the refreshData to force a refresh
  // And update the selected tab index
  const handleTabChange = (newIndex: number) => {
    if (newIndex > 0) {
      setRefreshData((prevValue) => !prevValue);
    }
    setIndex(newIndex); // Update the selected tab index
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Put the main content in the SafeAreaView */}
      <SafeAreaView style={appStyles.safeAreaView}>
        {/* Since the background is dark we want the bar to be light */}
        <StatusBar barStyle="light-content" />
        {/* Here is the main content */}
        <TabView
          value={index}
          onChange={setIndex}
          disableTransition={true}
          disableSwipe
        >
          {/* Info Page */}
          <TabView.Item style={appStyles.tabView}>
            <About />
          </TabView.Item>
          {/* Edit Page */}
          <TabView.Item style={appStyles.tabView}>
            <Edit refreshData={refreshData} />
          </TabView.Item>
          {/* Tracker Page */}
          <TabView.Item style={appStyles.tabView}>
            <Tracker refreshData={refreshData} />
          </TabView.Item>
        </TabView>
      </SafeAreaView>
      {/* Put the tabs at the bottom outside the safearea */}
      {/* For ios we'll add some padding at bottom */}
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
