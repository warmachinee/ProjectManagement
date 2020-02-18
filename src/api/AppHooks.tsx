import { useState, useLayoutEffect, useRef, useEffect } from "react";
import * as AppType from "apptype";

interface useFetchProps {
  initial: any | null;
  url: string;
  deps: any[];
  method: string;
  headers: Object;
  body: Object;
}

export const useMeasure = (ref: AppType.Ref, deps: any[]) => {
  const [rect, setRect] = useState<object | any>({});

  useLayoutEffect(() => {
    setRect(ref.current.getBoundingClientRect());
  }, deps);

  return rect;
};

export const useFetch = (props: useFetchProps) => {
  const {
    initial = null,
    url,
    deps = [],
    method = "GET",
    headers = {},
    body = {}
  } = props;
  const isCurrent = useRef(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [state, setState] = useState<any>(initial);

  async function handleFetch() {
    isCurrent.current = true;
    let options: any = {
      method,
      async: true,
      crossDomain: true
    };
    if (method === "POST") {
      options = {
        method,
        async: true,
        crossDomain: true,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          ...headers
        },
        body: JSON.stringify(body)
      };
    }
    await fetch(url, options)
      .then(res => res.json())
      .then(json => {
        if (isCurrent.current) {
          setState(json);
          setLoading(false);
        }
      });
  }

  useEffect(() => {
    return () => {
      isCurrent.current = false;
    };
  }, []);

  useEffect(() => {
    handleFetch();
  }, [url, ...deps]);

  return { state, setState, loading };
};

export const useForm = (initial: any) => {
  const [state, setState] = useState<{
    [key: string]: string;
  }>({ ...initial });

  return [
    state,
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setState({ ...state, [e.target.name]: e.target.value });
    },
    setState
  ];
};

export const useRenderCheck = (ComponentName: string, deps: any[]) => {
  useEffect(() => {
    console.log(`${ComponentName} rendered`);
    return () => {
      console.log(`${ComponentName} unmounted`);
    };
  }, [...deps]);
};

export const useConfirmDeleteItem = () => {
  const [state, setState] = useState<{ confirmState: boolean; item: any }>({
    confirmState: false,
    item: null
  });

  function onDeleteItem(props: { action: "delete" | "cancel"; item: any }) {
    switch (props.action) {
      case "delete":
        setState({ confirmState: true, item: props.item });
        break;
      case "cancel":
        setState({ confirmState: false, item: null });
        break;
      default:
        break;
    }
  }

  return [state, onDeleteItem, setState];
};

export function booleanReducer(
  state: AppType.BooleanReducerState,
  action: AppType.BooleanReducerActions
): AppType.BooleanReducerState {
  const objKey: any = "key" in action ? action.key : "";
  switch (action.type) {
    case "true":
      return { ...state, [objKey]: true };
    case "false":
      return { ...state, [objKey]: false };
    case "toggle":
      return { ...state, [objKey]: !state[objKey] };
    case "falseAll":
      let newObj = state;
      for (const key in newObj) {
        newObj[key] = false;
      }
      return { ...newObj };
    default:
      return { ...state };
  }
}
