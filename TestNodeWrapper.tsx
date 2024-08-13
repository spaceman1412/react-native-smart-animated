import React, { cloneElement, ReactElement, useEffect, useRef } from "react";
import { Children } from "react";

type TestNodeProps = {
  onNode: (node: Node) => void;
  children: React.ReactNode;
  shareId: string;
};

export type Node = {
  element: React.ReactNode;
  ref: React.RefObject<any>;
  shareId: string;
};

export const TestNodeWrapper = ({
  onNode,
  children,
  shareId,
}: TestNodeProps) => {
  const element = Children.only(children);
  const ref = useRef<any>();

  if (!React.isValidElement(element)) {
    return;
  }

  useEffect(() => {
    if (ref) {
      const node = { element: element, ref: ref, shareId: shareId };
      if (ref.current !== null) {
        onNode(node);
      }
    }
  }, [ref]);

  const ChildrenHiddenWithRef = cloneElement(element, {
    key: shareId,
    // @ts-ignore

    ref: ref,
    style: [{ opacity: 0 }, element.props.style],
  });
  return <>{ChildrenHiddenWithRef}</>;
};
