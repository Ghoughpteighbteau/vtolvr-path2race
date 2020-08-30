import { vtsparser } from "./vtsparser";
import { Vector as V } from "./vector";
const v = new V(1, 2, 3);
/* tslint:disable: no-console */
console.log(v.add(5));

const invtsElem = (document.getElementById("invts") as HTMLInputElement);
invtsElem.addEventListener("change", () => {
  invtsElem.files[0].text().then((text) => {
    vtsparser.loadFile(text);
    return vtsparser.parse();
  }).then(console.log);
});
