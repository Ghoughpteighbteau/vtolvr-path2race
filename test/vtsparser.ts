import * as fs from "fs";
import { ScenarioObject, vtsparser } from "../src/vtsparser";
import { Vector } from "../src/vector";
import { assert } from "chai";

const samples = {
  ps_s: [
    "(28704.232177734375, 0.129638671875, 32029.37316894531)",
    "(27814.41943359375, 164.51611328125, 30319.090698242188)",
    "(24730.66796875, 793.2576904296875, 29641.91552734375)",
    "(-1, -2, -3)",
    "(0, 0, 0)",
  ],
  ps_p: [
    new Vector(28_704.232177734375, 0.129638671875, 32_029.37316894531),
    new Vector(27_814.41943359375, 164.51611328125, 30_319.090698242188),
    new Vector(24_730.66796875, 793.2576904296875, 29_641.91552734375),
    new Vector(-1, -2, -3),
    new Vector(0, 0, 0),
  ] as Vector[],
  path_s: "(28343.341796875, 164.515625, 30978.30859375);(27814.41943359375, 164.515625, 30319.0908203125);(26841.10498046875, 336.54345703125, 30165.57080078125);(26106.38818359375, 500.9296875, 30485.767578125);(25068.13916015625, 807.0185546875, 31513.723876953125);(23903.44775390625, 423.44921875, 31602.385498046875);(23330.6484375, 389.75439453125, 30928.3466796875);(24730.66796875, 793.25732421875, 29641.91552734375);(25440.30078125, 451.7275390625, 28824.02490234375);(24242.947265625, 280.962890625, 27757.40380859375);(22927.125, 451.7275390625, 27761.97314453125);(22853.75, 502.458984375, 28607.66650390625);(24135.8271484375, 817.07177734375, 28718.787109375);(25084.38232421875, 475.5419921875, 28459.9453125);(25242.14892578125, 688.845703125, 29725.080078125);(25470.69287109375, 969.13525390625, 32007.03564453125);(24798.2421875, 436.962890625, 32731.46630859375);(24666.0751953125, 303.919921875, 33566.637451171875);(25808.925048828125, 524.38818359375, 34849.52490234375);(25775.981689453125, 865.751953125, 35843.150390625);(25245.099365234375, 1518.46533203125, 36697.21826171875);(23889.1806640625, 986.2939453125, 37228.91357421875);",
  path_p: [
    new Vector(28_343.341796875, 164.515625, 30_978.30859375),
    new Vector(27_814.41943359375, 164.515625, 30_319.0908203125),
    new Vector(26_841.10498046875, 336.54345703125, 30_165.57080078125),
    new Vector(26_106.38818359375, 500.9296875, 30_485.767578125),
    new Vector(25_068.13916015625, 807.0185546875, 31_513.723876953125),
    new Vector(23_903.44775390625, 423.44921875, 31_602.385498046875),
    new Vector(23_330.6484375, 389.75439453125, 30_928.3466796875),
    new Vector(24_730.66796875, 793.25732421875, 29_641.91552734375),
    new Vector(25_440.30078125, 451.7275390625, 28_824.02490234375),
    new Vector(24_242.947265625, 280.962890625, 27_757.40380859375),
    new Vector(22_927.125, 451.7275390625, 27_761.97314453125),
    new Vector(22_853.75, 502.458984375, 28_607.66650390625),
    new Vector(24_135.8271484375, 817.07177734375, 28_718.787109375),
    new Vector(25_084.38232421875, 475.5419921875, 28_459.9453125),
    new Vector(25_242.14892578125, 688.845703125, 29_725.080078125),
    new Vector(25_470.69287109375, 969.13525390625, 32_007.03564453125),
    new Vector(24_798.2421875, 436.962890625, 32_731.46630859375),
    new Vector(24_666.0751953125, 303.919921875, 33_566.637451171875),
    new Vector(25_808.925048828125, 524.38818359375, 34_849.52490234375),
    new Vector(25_775.981689453125, 865.751953125, 35_843.150390625),
    new Vector(25_245.099365234375, 1_518.46533203125, 36_697.21826171875),
    new Vector(23_889.1806640625, 986.2939453125, 37_228.91357421875),
  ] as Vector[],
  tinyvts: fs.readFileSync("./test/tiny.vts", "utf-8") as string,
  fullvts: fs.readFileSync("./test/ASR-E-1-island-sprint.vts", "utf-8") as string,
};

describe("vtsparser", () => {
  it("should export the interfaces I expect", () => {
    assert.containsAllKeys(vtsparser,
      ["loadFile", "parse", "parsePath", "write", "writePath", "isStr", "isObj", "isArr",],
      "Export object has all functions I expect",
    );
  },
  );

  it("should be able to read tiny scenarios", () => {
    vtsparser.loadFile(samples.tinyvts);
    assert.deepEqual(vtsparser.parse(), {
      gameVersion: "1.0.1f1",
      campaignID: "",
      campaignOrderIdx: "-1",
      scenarioName: "ASR-E-1 Island Sprint",
      testarr: [{ fghj: "5" }, { dfgh: "6" }],
      testobj: { asdf: "1", zxcv: "2" },
    });
  });

  it("should be able to read large scenarios without exploding", () => {
    vtsparser.loadFile(samples.fullvts);
    const result = vtsparser.parse();
    assert.lengthOf(Object.entries(result.CustomScenario), 35, "This custom scenario has 35 entries");
    assert.isArray(((result.CustomScenario as ScenarioObject).WAYPOINTS as ScenarioObject).WAYPOINT,
      "This scenario has multiple waypoints, objects promote to arrays",
    );
  });

  it("should be able to parse points", () => {
    samples.ps_s.forEach((s, i) => assert.deepEqual(vtsparser.parsePoint(s), samples.ps_p[i]));
  });

  it("should be able to parse paths", () => {
    assert.deepEqual(vtsparser.parsePath(samples.path_s), samples.path_p);
  });

  it("should be able to write points", () => {
    samples.ps_s.forEach((s, i) =>
      assert.deepEqual(vtsparser.writePoint(samples.ps_p[i]), s)
    );
  });

  it("should be able to write paths", () => {
    assert.deepEqual(vtsparser.writePath(samples.path_p), samples.path_s);
  });

  it("should be able to write tiny scenarios", () => {
    vtsparser.loadFile(samples.tinyvts);
    const result = vtsparser.parse();
    const rewrite = vtsparser.write(result);
    assert.equal(samples.tinyvts, rewrite.reduce((acc,cur)=>acc+cur+"\n",""));
  });

  it("should be able to write big scenarios", () => {
    vtsparser.loadFile(samples.fullvts);
    const result = vtsparser.parse();
    const rewrite = vtsparser.write(result);
    const vtsln = samples.fullvts.split("\n");
    // for(let i = 0; i < vtsln.length && i < rewrite.length; i++)
    //   if(vtsln[i] !== rewrite[i])
    //     console.log(vtsln[i], rewrite[i])
    assert.equal(samples.fullvts, rewrite.reduce((acc,cur)=>acc+cur+"\n",""));
  });
});
