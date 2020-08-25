export type ScenarioValue = string | ScenarioObject | ScenarioObject[];
export interface ScenarioObject {
  [index: string]: ScenarioValue;
}
type Point3D = [number, number, number];
type Path = Point3D[];
export const vtsparser = {
  loadFile,
  parse,
  parsePath,
  parsePoint,
  write,
  writePath,
  writePoint,
  isStr: function isStr(v: ScenarioValue): v is string {
    return typeof v === "string";
  },
  isObj: function isObj(v: ScenarioValue): v is ScenarioObject {
    return typeof v === "object" && !Array.isArray(v);
  },
  isArr: function isArr(v: ScenarioValue): v is ScenarioObject[] {
    return Array.isArray(v);
  },
};

let i: number;
let filelns: string[];
function loadFile(file: string) {
  i = 0;
  filelns = file.split(/\r?\n/).map((ln) => ln.trim());
}

function parse(): ScenarioObject {
  if (!Array.isArray(filelns)) throw new Error("file not loaded, bro. load file.");
  const obj: ScenarioObject = {};

  while (i < filelns.length) {
    const match = filelns[i].match(/(?<key>[^ ]+) = ?(?<value>.*)/);
    if (match != null) {
      if (match.groups.key in obj) throw new Error(`Attempted to double write: "${filelns[i]}", line ${i}${1}`);
      obj[match.groups.key] = match.groups.value;
    } else if (filelns[i + 1] === "{") {
      const key = filelns[i];
      i += 2;
      if (!(key in obj)) {
        obj[key] = parse();
      } else if (vtsparser.isStr(obj[key])) {
        throw new Error(`Attempted to promote string to array, that ain't right. "${filelns[i]}", line ${i}${1}`);
      } else if (vtsparser.isObj(obj[key])) {
        (obj[key] as ScenarioObject[]) = [(obj[key] as ScenarioObject)];
        (obj[key] as ScenarioObject[]).push(parse());
      } else if (vtsparser.isArr(obj[key])) {
        (obj[key] as ScenarioObject[]).push(parse());
      }
    } else if (filelns[i] === "}") {
      return obj;
    } else if (filelns[i] === "") {
      // don't care.
    } else {
      throw new Error(`unexpected string "${filelns[i]}", line ${i + 1}`);
    }
    i++;
  }

  return obj;
}

function parsePath(path: string): Path {
  return path
    .split(";")
    .filter((p) => p !== "")
    .map(parsePoint);
}

function parsePoint(point: string): Point3D {
  const pds = point
    .replace(/[()]/g, "")
    .split(",");
  return [parseFloat(pds[0]), parseFloat(pds[1]), parseFloat(pds[2])];
}

function write(scenario: ScenarioObject): string[] {
  const entries = Object.entries(scenario);
  return entries.map((e) => {
    if (vtsparser.isStr(e[1])) {
      return e[0] + " = " + e[1];
    } else if (vtsparser.isArr(e[1])) {
      return e[1].map((ae) => [e[0], "{", write(ae), "}"].flat()).flat();
    } else if (vtsparser.isObj(e[1])) {
      return [e[0], "{", write(e[1]), "}"].flat();
    }
  }).flat();
}

function writePath(path: Path): string {
  return path.map(writePoint).reduce((acc, cur) => acc + cur + ";", "");
}

function writePoint(point: Point3D): string {
  return `(${point[0]}, ${point[1]}, ${point[2]})`;
}
