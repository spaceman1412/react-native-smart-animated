import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  SafeAreaView,
  Pressable,
  ScrollView,
  Image,
} from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";

import { NodeWrapper, Node, LayoutWrapper, CustomStyleFunc } from "../index";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          paddingTop: 24,
        }}
      >
        <TodoItem />
        <View style={{ height: 10 }} />
        <TodoItem />
        <View style={{ height: 10 }} />

        <TodoItem />
        <View style={{ height: 10 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const TodoItem = () => {
  const transformY = useSharedValue(0);
  const [startNode, setStartNode] = useState<Node[]>([]);
  const [endNode, setEndNode] = useState<Node[]>([]);
  const [nodeArr, setNodeArr] = useState<any[]>([]);

  const isEnabled = useSharedValue(false);

  const onPress = () => {
    if (isEnabled.value === false) {
      height.value = withTiming(250);
      isEnabled.value = true;
      transformY.value = withTiming(17);
    } else if (isEnabled.value === true) {
      height.value = withTiming(150);
      isEnabled.value = false;

      transformY.value = withTiming(0);
    }
  };

  useEffect(() => {
    if (startNode.length === endNode.length) {
      startNode.forEach((element, index) => {
        if (element.shareId === endNode[index].shareId) {
          setNodeArr((prev) => [
            ...prev,
            {
              startNode: element,
              endNode: endNode[index],
              shareId: element.shareId,
            },
          ]);
        }
      });
    }
  }, [startNode, endNode]);

  const height = useSharedValue(150);

  const customStyle: CustomStyleFunc = (value) => {
    "worklet";
    return {
      transform: [{ translateX: withTiming(value.transform.translateX) }],
      backgroundColor: withTiming(value.backgroundColor),
    };
  };

  return (
    <AnimatedPressable
      style={{
        width: "80%",
        height: height,
        backgroundColor: "white",
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 50,
      }}
      onPress={onPress}
    >
      <LayoutWrapper
        nodeArr={nodeArr}
        isEnabled={isEnabled}
        startNodeContainer={<ClosedContent setStartNode={setStartNode} />}
        endNodeContainer={<OpenContent setEndNode={setEndNode} />}
        customStyle={customStyle}
      />
    </AnimatedPressable>
  );
};

const OpenContent = ({ setEndNode }: any) => {
  return (
    <Animated.View style={{ flex: 1 }}>
      <View style={{ width: "100%", alignItems: "flex-end" }}>
        <Text>Xoa</Text>
      </View>

      <View style={{ height: 20 }} />
      <NodeWrapper
        onNode={(node) => {
          setEndNode((prev) => [...prev, node]);
        }}
        shareId={"text"}
      >
        <Text
          style={{ fontSize: 24, fontWeight: "bold", color: "red" }}
          onLayout={(e) => {}}
        >
          Task 1
        </Text>
      </NodeWrapper>
      <View style={{ height: 20 }} />

      <NodeWrapper
        onNode={(node) => {
          setEndNode((prev) => [...prev, node]);
        }}
        shareId={"text2"}
      >
        <Image
          source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
          style={{
            width: 100,
            height: 100,
            resizeMode: "stretch",

            transform: [{ translateX: 30 }],
          }}
        />
      </NodeWrapper>
      <Button title="Xong" />
    </Animated.View>
  );
};

const ClosedContent = ({ setStartNode }) => {
  return (
    <Animated.View style={[{ flexDirection: "row", flex: 1 }]}>
      <View
        style={{
          width: 20,
          height: 20,
          backgroundColor: "gray",
          borderRadius: 5,
        }}
      />
      <View style={{ marginStart: 16 }}>
        {/* //TODO: Create a wrapper component for the user more convenient */}

        <NodeWrapper
          onNode={(node) => {
            setStartNode((prev) => [...prev, node]);
          }}
          shareId={"text"}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: "black",
            }}
          >
            Task 1
          </Text>
        </NodeWrapper>

        <NodeWrapper
          onNode={(node) => {
            setStartNode((prev) => [...prev, node]);
          }}
          shareId={"text2"}
        >
          <Image
            source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
            style={{
              width: 100,
              height: 50,
              resizeMode: "stretch",
              transform: [{ translateX: 45 }],
            }}
          />
        </NodeWrapper>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "yellow",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    color: "white",
  },
});
