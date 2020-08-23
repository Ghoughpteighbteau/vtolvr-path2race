export = {};

var filelns = file.split(/\r?\n/).map(ln=>ln.trim());

type ScenarioValue = string | ScenarioObject | Array<ScenarioObject>;
interface ScenarioObject {
  [index: string]: ScenarioValue
}
function isStr(v: ScenarioValue): v is string{
  return typeof v === 'string';
}
function isObj(v: ScenarioValue): v is ScenarioObject{
  return v instanceof Object && !Array.isArray(v);
}
function isArr(v: ScenarioValue): v is Array<ScenarioObject>{
  return Array.isArray(v);
}

var i=0;
function parseObject(): ScenarioObject {
  var obj: ScenarioObject = {};

  while(i < filelns.length){
    var match = filelns[i].match(/(?<key>[^ ]+) = ?(?<value>.*)/);
    if(match != null) {
      if(key in obj) throw "Attempted to double write: \"" + filelns[i] + "\", line " + (i+1);
      obj[match.groups.key] = match.groups.value;
    } else if(filelns[i+1] == '{') {
      var key = filelns[i]
      i+=2;
      if(!(key in obj))
        obj[key] = parseObject();
      else if(isStr(obj[key]))
        throw "Attempted to promote string to array, that ain't right. \"" + filelns[i] +"\", line " + (i+1);
      else if(isObj(obj[key])){
        (obj[key] as Array<ScenarioObject>) = [obj[key] as ScenarioObject];
        (obj[key] as Array<ScenarioObject>).push(parseObject());
      }else if(isArr(obj[key])){
        (obj[key] as Array<ScenarioObject>).push(parseObject());
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

var scenario: ScenarioObject = parseObject();

console.log(scenario);

function parsePath(path: ScenarioObject){
  if(! (path.points instanceof String)) return {}
  return path.points
    .split(';')
    .filter(p=>p!='')
    .map(p=>p.replace(/[()]/g,'')
      .split(',')
      .map((pd:any)=> parseFloat(pd.trim()))
    );
}
// if(isObj(scenario['CustomScenario']['PATHS']['PATH']))
// console.log(parsePath(scenario['CustomScenario']['PATHS']['PATH']));

function writeObject(scenario: ScenarioObject): Array<string>{
  var entries = Object.entries(scenario)
  return entries.map(e=>{
    if(isStr(e[1])){
      return e[0] + ' = ' + e[1];
    }else if(isArr(e[1])){
      return e[1].map(ae=>[e[0],'{',writeObject(ae),'}'].flat()).flat();
    }else if(isObj(e[1])){
      return [e[0], '{', writeObject(e[1]), '}'].flat();
    }
  }).flat();
  // return entries.map(e =>{
  //   if(e[1] instanceof String)
  //     return `$e[0] = $e[1]`;
  //   else if (e[1] instanceof Object)
  //     return [e[0],"{",writeObject(e[1])];
  // }).flat();
}
let rewrite = writeObject(scenario)
console.log(rewrite);
for(let i = 0; i<filelns.length && i<rewrite.length; i++){
  if(filelns[i] != rewrite[i]) console.log(i, filelns[i],rewrite[i]);
}