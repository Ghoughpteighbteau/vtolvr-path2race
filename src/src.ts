import * as vtsparser from './vtsparser';

const invts_elem = document.getElementById("invts") as HTMLInputElement;
invts_elem.addEventListener('change', () => {
  invts_elem.files[0].text()
    .then(console.log);
});