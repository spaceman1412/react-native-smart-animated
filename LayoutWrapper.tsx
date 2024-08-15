import React, {
  cloneElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  findNodeHandle,
  StyleProp,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";
import Animated, {
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Node } from "./NodeWrapper";

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

type NodeTransform = {
  transform?: any;
  backgroundColor?: string;
  color?: string;
  fontSize?: number;
};

const getTransformWithKey = (transformMatrix, key) => {
  let value = null;

  if (transformMatrix) {
    transformMatrix?.forEach((element) => {
      if (element[key]) {
        value = element[key];
      }
    });

    return value;
  } else return null;
};

type OneNodeProps = {
  startNode: Node;
  endNode: Node;
  passRef: React.RefObject<any>;
  isEnabled: SharedValue<boolean>;
  customStyle?: CustomStyleFunc;
};

const OneNode: React.FC<OneNodeProps> = ({
  startNode,
  endNode,
  passRef,
  isEnabled,
  customStyle,
}) => {
  const [startNodeLayout, setStartNodeLayout] = useState<any>();

  const [endNodeLayout, setEndNodeLayout] = useState<any>();

  const [startNodeTransform, setStartNodeTransform] = useState<NodeTransform>();
  const [endNodeTransform, setEndNodeTransform] = useState<NodeTransform>();

  const translateXStartNode = getTransformWithKey(
    startNodeTransform?.transform,
    "translateX"
  );
  const translateYStartNode = getTransformWithKey(
    startNodeTransform?.transform,
    "translateY"
  );

  const translateXEndNode = getTransformWithKey(
    endNodeTransform?.transform,
    "translateX"
  );
  const translateYEndNode = getTransformWithKey(
    endNodeTransform?.transform,
    "translateY"
  );

  const color = (() => {
    if (
      startNodeTransform?.backgroundColor &&
      endNodeTransform?.backgroundColor
    ) {
      return interpolateColor(
        isEnabled.value ? 1 : 0,
        [0, 1],
        [startNodeTransform.backgroundColor, endNodeTransform.backgroundColor]
      );
    } else return null;
  })();

  const nodeDefaultStyle = (() => {
    let startValue = {};
    let endValue = {};
    if (startNodeTransform?.transform) {
      startNodeTransform?.transform.forEach((startNode) => {
        const keyStart = Object.keys(startNode)[0];
        if (keyStart !== "translateX" && keyStart !== "translateY") {
          startValue = {
            ...startValue,
            [keyStart]: startNode[keyStart],
          };
        }
      });
    }

    if (endNodeTransform?.transform) {
      endNodeTransform?.transform?.forEach((endNode) => {
        const keyEnd = Object.keys(endNode)[0];
        if (keyEnd !== "translateX" && keyEnd !== "translateY") {
          endValue = {
            ...endValue,
            [keyEnd]: endNode[keyEnd],
          };
        }
      });
    }

    return {
      start: startValue,
      end: endValue,
    };
  })();

  // Animated base on position of startNode and endNode
  const animatedStyle = useAnimatedStyle(() => {
    const translateY =
      isEnabled?.value && endNodeLayout
        ? endNodeLayout.y - startNodeLayout.y + (translateYEndNode ?? 0)
        : translateYStartNode ?? 0;

    const translateX =
      isEnabled?.value && endNodeLayout
        ? endNodeLayout.x - startNodeLayout.x + (translateXEndNode ?? 0)
        : translateXStartNode ?? 0;

    const width =
      isEnabled?.value && endNodeLayout
        ? endNodeLayout.width
        : startNodeLayout?.width;

    const height =
      isEnabled?.value && endNodeLayout
        ? endNodeLayout.height
        : startNodeLayout?.height;

    const nodeDefault = isEnabled?.value
      ? nodeDefaultStyle.end
      : nodeDefaultStyle.start;

    let value: any = {
      transform: { translateX, translateY },
      width,
      height,
    };

    if (color) {
      value = {
        ...value,
        backgroundColor: color,
      };
    }

    if (startNodeTransform?.fontSize && endNodeTransform?.fontSize) {
      value = {
        ...value,
        fontSize: isEnabled?.value
          ? endNodeTransform.fontSize
          : startNodeTransform.fontSize,
      };
    }

    if (startNodeTransform?.color && endNodeTransform?.color) {
      value = {
        ...value,
        color: isEnabled?.value
          ? endNodeTransform.color
          : startNodeTransform.color,
      };
    }

    let transform = {};

    if (startNodeTransform?.transform && endNodeTransform?.transform) {
      startNodeTransform?.transform.forEach((startNode) => {
        endNodeTransform?.transform.forEach((endNode) => {
          const keyStart = Object.keys(startNode)[0];
          const keyEnd = Object.keys(endNode)[0];

          if (
            keyStart === keyEnd &&
            keyStart !== "translateX" &&
            keyStart !== "translateY"
          ) {
            transform = {
              ...transform,
              [keyStart]: isEnabled?.value
                ? endNode[keyEnd]
                : startNode[keyStart],
            };
          }
        });
      });
    }

    value = {
      ...value,
      transform: { ...value.transform, ...transform },
    };

    const valueStyle = customStyle ? customStyle(value) : [];

    const tempStyle = Object.entries(valueStyle);

    const filtered = tempStyle.filter(([key, value]) => key !== "transform");

    const spreadStyle = Object.fromEntries(filtered);

    const transformCustomStyle = (() => {
      //TODO: Add remain the original
      if (valueStyle.transform && valueStyle.transform.length > 0) {
        let keys: any[] = [];
        valueStyle.transform.forEach((element) => {
          keys = [...keys, Object.keys(element)[0]];
        });

        if (!keys.includes("translateX")) {
          valueStyle.transform.push({ translateX: withTiming(translateX) });
        }
        if (!keys.includes("translateY")) {
          valueStyle.transform.push({ translateY: withTiming(translateY) });
        }

        return valueStyle.transform;
      } else
        return [
          { translateX: withTiming(translateX) },
          { translateY: withTiming(translateY) },
        ];
    })();

    const transformKey = (() => {
      let value = {};
      if (startNodeTransform?.transform && endNodeTransform?.transform) {
        startNodeTransform?.transform.forEach((startNode) => {
          endNodeTransform?.transform.forEach((endNode) => {
            const keyStart = Object.keys(startNode)[0];
            const keyEnd = Object.keys(endNode)[0];

            if (
              keyStart === keyEnd &&
              keyStart !== "translateX" &&
              keyStart !== "translateY"
            ) {
              value = {
                ...value,
                [keyStart]: isEnabled?.value
                  ? withTiming(endNode[keyEnd])
                  : withTiming(startNode[keyStart]),
              };
            }
          });
        });
      }

      return value;
    })();

    let transformTempt = {};

    let transformCustomInObject = {};

    if (transformCustomStyle.length > 0) {
      transformCustomStyle.forEach((element) => {
        const key = Object.keys(element)[0];
        transformCustomInObject = {
          ...transformCustomInObject,
          [key]: element[key],
        };
      });
    }

    transformTempt = {
      ...nodeDefault,
      ...transformKey,
      ...transformCustomInObject,
    };

    let transformFinal = (() => {
      let final: any[] = [];
      if (Object.keys(transformTempt).length > 0) {
        for (const [key, value] of Object.entries(transformTempt)) {
          final.push({
            [key]: value,
          });
        }
      }
      return final;
    })();

    const transformStyle = (() => {
      let value = {};
      if (color) {
        value = {
          ...value,
          backgroundColor: withTiming(color),
        };
      }

      if (startNodeTransform?.fontSize && endNodeTransform?.fontSize) {
        value = {
          ...value,
          fontSize: isEnabled?.value
            ? withTiming(endNodeTransform.fontSize)
            : withTiming(startNodeTransform.fontSize),
        };
      }
      if (startNodeTransform?.color && endNodeTransform?.color) {
        value = {
          ...value,
          color: isEnabled?.value
            ? withTiming(endNodeTransform.color)
            : withTiming(startNodeTransform.color),
        };
      }

      return value;
    })();

    return {
      transform: transformFinal,
      width:
        isEnabled?.value && endNodeLayout
          ? withTiming(endNodeLayout.width)
          : withTiming(startNodeLayout?.width),
      height:
        isEnabled?.value && endNodeLayout
          ? withTiming(endNodeLayout.height)
          : withTiming(startNodeLayout?.height),
      ...transformStyle,
      ...spreadStyle,
    };
  });

  useEffect(() => {
    if (passRef) {
      // Measure layout of startNode and endNode
      if (startNode) {
        setTimeout(() => {
          startNode.ref?.current?.measureLayout(
            findNodeHandle(passRef.current),
            (x, y, width, height) => {
              setStartNodeLayout({ x, y, width, height });
            },
            () => {
              console.log("measureLayout error");
            }
          );
        }, 0);
      }

      if (endNode) {
        setTimeout(() => {
          endNode.ref?.current?.measureLayout(
            findNodeHandle(passRef.current),
            (x, y, width, height) => {
              setEndNodeLayout({ x, y, width, height });
            },
            () => {
              console.log("measureLayout error");
            }
          );
        }, 0);
      }
    }

    if (startNode) {
      const handleProps = (props: any, type: "start" | "end") => {
        // Style handler

        const updateTransform = (key: string, value: any) => {
          type === "start"
            ? setStartNodeTransform((prevState) => ({
                ...prevState,
                [key]: value,
              }))
            : setEndNodeTransform((prevState) => ({
                ...prevState,
                [key]: value,
              }));
        };

        for (const key in props) {
          if (key === "style") {
            if (props.style.length > 0) {
              let style: ViewStyle & TextStyle = {};

              for (let i = 0; i < props.style.length; i++) {
                // Handle  style
                const propsStyle = props.style[i];
                style = { ...style, ...propsStyle };
              }

              if (style?.backgroundColor) {
                updateTransform(
                  "backgroundColor",
                  style?.backgroundColor?.toString()
                );
              }
              if (style.transform) {
                updateTransform("transform", style.transform);
              }

              if (style.fontSize) {
                updateTransform("fontSize", style.fontSize);
              }

              if (style.color) {
                updateTransform("color", style.color?.toString());
              }
            } else {
              // Handle single style
              if (props.style.backgroundColor) {
                updateTransform("backgroundColor", props.style.backgroundColor);
              }
              if (props.style.transform) {
                updateTransform("transform", props.style.transform);
              }
              if (props.style.fontSize) {
                updateTransform("fontSize", props.style.fontSize);
              }

              if (props.style.color) {
                updateTransform("color", props.style.color);
              }
            }
          }
        }
      };
      //@ts-ignore
      handleProps(startNode?.element?.props, "start");
      //@ts-ignore

      handleProps(endNode?.element?.props, "end");
    }
  }, [startNode, passRef, endNode]);

  const TestNodeR = React.forwardRef(
    (props: ViewProps, ref: React.LegacyRef<View>) => {
      const startNodeWithRef =
        startNode &&
        //@ts-ignore

        cloneElement(startNode.element, {
          ref: ref,
          //@ts-ignore
          style: [startNode?.element?.props.style, props.style],
        });

      return startNodeWithRef;
    }
  );

  const TestNodeAnimated = Animated.createAnimatedComponent(TestNodeR);

  return (
    startNodeLayout && (
      <TestNodeAnimated
        style={[
          {
            position: "absolute",
            top: startNodeLayout.y,
            left: startNodeLayout.x,
            overflow: "hidden",
          },
          animatedStyle,
        ]}
      />
    )
  );
};

export interface LayoutWrapperProps {
  isEnabled: SharedValue<boolean>;
  startNodeContainer: React.ReactNode;
  endNodeContainer: React.ReactNode;
  nodeArr: {
    startNode: Node;
    endNode: Node;
    shareId: string;
  }[];
  customStyle?: CustomStyleFunc;
}

export const LayoutWrapper = ({
  isEnabled,
  startNodeContainer,
  endNodeContainer,
  nodeArr,
  customStyle,
}: LayoutWrapperProps) => {
  const ref = useRef<View>(null);

  const animatedStyleStartNode = useAnimatedStyle(() => ({
    opacity: isEnabled.value ? withTiming(0) : withTiming(1),
  }));

  const animatedStyleEndNode = useAnimatedStyle(() => ({
    opacity: isEnabled.value ? withTiming(1) : withTiming(0),
  }));

  const StartNodeComponent = useCallback(
    () => (
      <Animated.View
        style={[
          { flex: 1 },
          animatedStyleStartNode,
          {
            position: "absolute",
            width: "100%",
          },
        ]}
      >
        {startNodeContainer}
      </Animated.View>
    ),
    []
  );

  const EndNodeComponent = useCallback(
    () => (
      <Animated.View
        style={[
          { flex: 1 },
          animatedStyleEndNode,
          { position: "absolute", width: "100%" },
        ]}
      >
        {endNodeContainer}
      </Animated.View>
    ),
    []
  );

  return (
    <View ref={ref} style={{ flex: 1 }}>
      <StartNodeComponent />
      <EndNodeComponent />

      {nodeArr.map((value) =>
        value.startNode && value.endNode ? (
          <OneNode
            key={value.shareId}
            startNode={value.startNode}
            endNode={value.endNode}
            passRef={ref}
            isEnabled={isEnabled}
            customStyle={customStyle}
          />
        ) : null
      )}
    </View>
  );
};
