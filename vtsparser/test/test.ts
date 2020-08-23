import * as fs from 'fs';
import { vtsparser } from '../index';
import type { ScenarioObject, ScenarioValue } from '../index';
import { assert } from 'chai';

describe('test1', () => {
  it('should test one', () => {
    console.log(vtsparser);
    assert.containsAllKeys(vtsparser,
      ['loadFile','parse', 'parsePath', 'write', 'writePath', 'isStr', 'isObj', 'isArr'],
      "Export object has all functions I expect")
  });
});
// var file=fs.readFileSync('tiny.vts','utf8');
// var file=fs.readFileSync('ASR-E-1-island-sprint.vts','utf8');
// console.log(file);


// let rewrite = writeObject(scenario)
// for(let i = 0; i<filelns.length && i<rewrite.length; i++){
//   if(filelns[i] != rewrite[i]) console.log(i, filelns[i],rewrite[i]);
// }