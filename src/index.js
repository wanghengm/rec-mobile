import "./style/index.css";
import "./style/other.less";

import { sum } from "./math.js";
// import _ from "lodash";
// import "moment/locale/zh-cn";
console.log("index");
// console.log(_.each);
console.log(sum(1, 4));

function aa() {
  console.log("hhh");
}

// //引入动态数据 - 懒加载
// setTimeout(() => {
//   import("./dynamic-data.js").then((res) => {
//     console.log(res.default.message);
//   });
// }, 2000);

//增加开启热更新的逻辑代码
if (module.hot) {
  module.hot.accept(["./math"], () => {
    const sumRes = sum(10, 10);
    console.log("sumRes", sumRes);
  });
}

export default { a: 1 };
