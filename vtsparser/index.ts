export type ScenarioValue = string | ScenarioObject | Array<ScenarioObject>;
export interface ScenarioObject { [index: string]: ScenarioValue };
type Point3D = [number, number, number];
type Path = Array<Point3D>;
export const vtsparser = {
  loadFile: loadFile,
  parse: parse,
  parsePath: parsePath,
  parsePoint: parsePoint,
  write: write,
  writePath: writePath,
  writePoint: writePoint,
  isStr: function isStr(v: ScenarioValue): v is string{
    return typeof v === 'string';
  },
  isObj: function isObj(v: ScenarioValue): v is ScenarioObject{
    return v instanceof Object && !Array.isArray(v);
  },
  isArr: function isArr(v: ScenarioValue): v is Array<ScenarioObject>{
    return Array.isArray(v);
  },
};

let i:number;
let filelns: Array<string>;
function loadFile(file:string){
  i=0;
  filelns = file.split(/\r?\n/).map(ln=>ln.trim());
}

function parse(): ScenarioObject {
  if(! Array.isArray(filelns)) throw "file not loaded, bro. load file.";
  var obj: ScenarioObject = {};

  while(i < filelns.length){
    var match = filelns[i].match(/(?<key>[^ ]+) = ?(?<value>.*)/);
    if(match != null) {
      if(key in obj) throw "Attempted to double write: \"" + filelns[i] + "\", line " + (i+1);
      obj[match.groups.key] = match.groups.value;
    } else if(filelns[i+1] == '{') {
      var key = filelns[i]
      i+=2;
      if      (!(key in obj)){
        obj[key] = parse();
      }else if(vtsparser.isStr(obj[key])){
        throw "Attempted to promote string to array, that ain't right. \"" + filelns[i] +"\", line " + (i+1);
      }else if(vtsparser.isObj(obj[key])){
        (obj[key] as Array<ScenarioObject>) = [obj[key] as ScenarioObject];
        (obj[key] as Array<ScenarioObject>).push(parse());
      }else if(vtsparser.isArr(obj[key])){
        (obj[key] as Array<ScenarioObject>).push(parse());
      }
    } else if (filelns[i] == '}') {
      return obj;
    } else if (filelns[i] == '') {
      //don't care.
    } else {
      throw "unexpected string \"" + filelns[i] +"\", line " + (i+1);
    }
    i++;
  }

  return obj;
}

function parsePath(path: string): Path{
  return path
    .split(';')
    .filter(p=>p!='')
    .map(parsePoint);
}

function parsePoint(point: string): Point3D{
  let pds=point
  .replace(/[()]/g,'')
  .split(',');
  return [
    parseFloat(pds[0]),
    parseFloat(pds[1]),
    parseFloat(pds[2]),
  ];
}

function write(scenario: ScenarioObject): Array<string>{
  var entries = Object.entries(scenario)
  return entries.map(e=>{
    if      (vtsparser.isStr(e[1])){
      return e[0] + ' = ' + e[1];
    }else if(vtsparser.isArr(e[1])){
      return e[1].map(ae=>[e[0],'{',write(ae),'}'].flat()).flat();
    }else if(vtsparser.isObj(e[1])){
      return [e[0], '{', write(e[1]), '}'].flat();
    }
  }).flat();
  // return entries.map(e =>{
  //   if(e[1] instanceof String)
  //     return `$e[0] = $e[1]`;
  //   else if (e[1] instanceof Object)
  //     return [e[0],"{",writeObject(e[1])];
  // }).flat();
}

function writePath(path: Path): string{
  return path
    .map(writePoint)
    .reduce((acc, cur)=>acc+cur+";","");
}

function writePoint(point: Point3D): string{
  return "(" + point[0] + ", " + point[1] + ", " + point[2] + ")";
}