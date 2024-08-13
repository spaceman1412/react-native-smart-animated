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
  ViewProps,
  StyleProp,
  ViewStyle,
} from "react-native";
import Animated, {
  AnimatedStyle,
  MeasuredDimensions,
  SharedTransition,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { TestNodeWrapper, Node, LayoutWrapper } from "../index";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView
        style={{}}
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

        <TodoItem />
        <View style={{ height: 10 }} />

        <TodoItem />
        <View style={{ height: 10 }} />

        <TodoItem />
      </ScrollView>
      {/* </View> */}
    </SafeAreaView>
  );
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type CustomStyleFunc = (value: {
  transform: {
    translateX: any;
    translateY: any;
    matrix: any;
    perspective: any;
    rotate: any;
    rotateX: any;
    rotateY: any;
    rotateZ: any;
    scaleX: any;
    scaleY: any;
    skewX: any;
    skewY: any;
    scale: any;
  };
  width: any;
  height: any;
  backgroundColor: any;
  fontSize: any;
  color: any;
}) => StyleProp<ViewStyle>;

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

    //TODO: Write a type function to suggest a value can modified to user
    // Value type animation and return in view props
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
      <TestNodeWrapper
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
        {/* <Image
          source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
          style={{ width: 100, height: 100, resizeMode: "stretch" }}
        /> */}
        {/* <View
          style={{
            width: 50,
            height: 100,
            backgroundColor: "pink",
            transform: [{ rotateX: "10deg" }, { translateX: 30 }],
          }}
        /> */}
      </TestNodeWrapper>
      <View style={{ height: 20 }} />

      <TestNodeWrapper
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

            transform: [
              // { rotateX: "10deg" },
              // { rotateZ: "0deg" },
              { translateX: 30 },
            ],
          }}
        />
      </TestNodeWrapper>
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

        <TestNodeWrapper
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

          {/* <Image
            source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
            style={{ width: 100, height: 50, resizeMode: "stretch" }}
          /> */}

          {/* <View
            style={[
              {
                width: 50,
                height: 50,
                backgroundColor: "black",
                transform: [{ translateX: 45 }, { rotateX: "100deg" }],
              },
            ]}
            // style={{
            //   width: 50,
            //   height: 50,
            //   backgroundColor: "red",
            // }}
          /> */}
        </TestNodeWrapper>

        <TestNodeWrapper
          onNode={(node) => {
            setStartNode((prev) => [...prev, node]);
          }}
          shareId={"text2"}
        >
          {/* <Text style={{ color: "green", marginTop: 16 }}>Uu tien cao</Text> */}
          <Image
            source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
            style={{
              width: 100,
              height: 50,
              resizeMode: "stretch",
              transform: [{ translateX: 45 }],
            }}
          />
        </TestNodeWrapper>
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
