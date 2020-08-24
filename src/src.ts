import { vtsparser } from './vtsparser';
import { Vector as V } from './vector';
let v = new V(1,2,3);
console.log(v.add(5));

const invts_elem = document.getElementById("invts") as HTMLInputElement;
invts_elem.addEventListener('change', () => {
  invts_elem.files[0].text()
    .then(text => {
      vtsparser.loadFile(text);
      return vtsparser.parse();
    })
    .then(console.log);
});
