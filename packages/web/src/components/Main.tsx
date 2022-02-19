import { ExplorationMode } from "@bb/core/dist/BranchAndBound";
import { useContextSelector } from "@fluentui/react-context-selector";
import React, { useCallback, useRef, useState } from "react";
import { Legend } from "./Legend";
import { NodeInfo } from "./NodeInfo";
import { Playground } from "./Playground";
import { PlaygroundContext } from "./PlaygroundProvider";
import { SolutionsExplorer } from "./SolutionsExplorer";
import { Stack } from "./Stack";
import { solveRaw } from "./utils";

export const example2 = `max z = x1 + 2x2 + 4x3 + 7x4

2x1 + 5x2 + 2x3 + 7x4 <= 10

x1 <= 1
x2 <= 1
x3 <= 1
x4 <= 1

x1 >= 0
x2 >= 0
x3 >= 0
x4 >= 0`;

export const example3 = `max z = x1 + 2x2 + 4x3 + 7x4

2x1 + 5x2 + 2x3 + 7x4 <= 10
4x1 + 1x2 + 5x3 + 8x4 <= 9

x1 <= 1
x2 <= 1
x3 <= 1
x4 <= 1

x1 >= 0
x2 >= 0
x3 >= 0
x4 >= 0`;

export const example4 = `max z = x1 + 5x2

5x1 +12x2 <= 40
- x1 +2x2 <= 3

x1 >= 0
x2 >= 0`;

export const example5 = `max z = x1 + 2x2 + 4x3 + 7x4

2x1 + 5x2 + 2x3 + 7x4 <= 21
4x1 + 1x2 + 5x3 + 8x4 <= 61
2x1 + 3x2 + 8x3 + 1x4 <= 11

x1 <= 5
x2 <= 5
x3 <= 5
x4 <= 5

x1 >= 0
x2 >= 0
x3 >= 0
x4 >= 0`;

export const Main: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const rawProb = useRef(example5);
  const root = useContextSelector(PlaygroundContext, (x) => x.root);
  const selectedNode = useContextSelector(PlaygroundContext, (x) => x.selectedNode);
  const setSolution = useContextSelector(PlaygroundContext, (x) => x.setSolution);
  const [explorationMode, setExplorationMode] = useState<ExplorationMode>("dfs");
  const handleSolve = useCallback(() => {
    setError(null);
    solveRaw(rawProb.current, explorationMode).then(setSolution).catch(setError);
  }, [setSolution, explorationMode]);

  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        overflow: "auto hidden",
        minWidth: 700,
      }}
    >
      <Stack
        style={{
          padding: 16,
          overflow: "auto hidden",
          width: "100%",
        }}
        spacing={1}
      >
        <div>
          <strong>Branch and bound</strong>
          <div></div>
        </div>
        <Stack style={{ flexDirection: "row", overflow: "hidden", flex: 1 }} spacing={1}>
          <div style={{ overflow: "auto" }}>
            <Stack spacing={1}>
              <Stack spacing={1} style={{ border: "1px solid #eee", padding: 16 }}>
                <div>
                  <strong>Problem</strong>
                </div>
                <div>
                  <textarea style={{ width: 300, height: 200 }} onChange={(e) => (rawProb.current = e.target.value)} defaultValue={rawProb.current}></textarea>
                </div>
                <Stack spacing={0.5} style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                  <select value={explorationMode} onChange={(e) => setExplorationMode(e.target.value as "bfs" | "dfs")}>
                    <option value="dfs">dfs</option>
                    <option value="bfs">bfs</option>
                    <option value="best-first">best-first</option>
                  </select>
                  <button onClick={handleSolve}>Solve</button>
                </Stack>
                {error && <div style={{ color: "red" }}>{String(error)}</div>}
              </Stack>
              <div style={{ border: "1px solid #eee", padding: 16 }}>
                <Stack spacing={1}>
                  <strong>Legend</strong>
                  {Object.entries(Legend).map(([k, v]) => (
                    <Stack key={k} style={{ flexDirection: "row", alignItems: "center" }} spacing={0.5}>
                      <div style={{ width: 20, height: 20, backgroundColor: v }} />
                      <span>{k}</span>
                    </Stack>
                  ))}
                </Stack>
              </div>
              <div style={{ border: "1px solid #eee", padding: 16 }}>
                <SolutionsExplorer />
              </div>
              {selectedNode && (
                <div style={{ border: "1px solid #eee", padding: 16 }}>
                  <NodeInfo node={selectedNode} />
                </div>
              )}
              <div style={{ border: "1px solid #eee", padding: 16 }}>
                <div>Combinatorial Optimization Project 2021</div>
                <div>Computer Science Department</div>
                <div>University of Truin</div>
                <div>
                  <a href="https://github.com/evolveyourmind">Credits</a> · <a href="https://github.com/evolveyourmind/bb">GitHub</a>
                </div>
              </div>
            </Stack>
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              border: "1px solid #eee",
              width: "100%",
            }}
          >
            {root && <Playground root={root} />}
          </div>
        </Stack>
      </Stack>
    </div>
  );
};
