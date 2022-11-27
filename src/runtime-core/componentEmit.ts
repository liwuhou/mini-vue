import { camelize, formatEmitName } from "../shared/index";
import { Component } from "./types/index";

export function emit (instance: Component, event: string, ...args:any[]) {
    console.log("emit", event);

    const { props } = instance;

    // 1、格式化event的命名
    // 2、查找当前props中是否有该方法（规范：onEventName）
    // 先处理为格式一: add -> Add  首字母大写
    let handler = props[formatEmitName(event)];
    // 不满足格式一再转换成格式二：add-fn -> addFn 短横转驼峰
    if(!handler) {
        handler = props[formatEmitName(camelize(event))];
    }
    handler && handler(...args)
}
