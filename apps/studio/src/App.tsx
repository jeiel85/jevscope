import { useMemo, useState } from "react";

const initialState = JSON.stringify(
  { hp: 32, maxHp: 100, enemyCount: 4, ammo: 2, healingItems: 1 },
  null,
  2,
);

const questions = {
  nextAction: {
    type: "choice",
    instructions: "Choose the most appropriate immediate combat action.",
    criteria: {
      attack: "Engage the enemy.",
      retreat: "Create distance.",
      heal: "Use healing if justified.",
      wait: "Delay commitment.",
    },
  },
  danger: {
    type: "score",
    instructions: "Rate current danger.",
    criteria: ["Safe", "Manageable", "Dangerous", "Critical"],
  },
  shouldUseSpecial: {
    type: "noul",
    instructions: "Should the special ability be used now?",
  },
} as const;

export function App() {
  const [stateText, setStateText] = useState(initialState);
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState("");
  const [running, setRunning] = useState(false);

  const stateValid = useMemo(() => {
    try {
      JSON.parse(stateText);
      return true;
    } catch {
      return false;
    }
  }, [stateText]);

  async function run() {
    setError("");
    setRunning(true);
    try {
      const response = await fetch("http://localhost:4317/api/evaluate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          state: JSON.parse(stateText),
          questions,
          model: "jev-latest",
        }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body?.error?.message ?? "Request failed");
      setResult(body);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setRunning(false);
    }
  }

  return (
    <main>
      <header>
        <div>
          <strong>JevScope</strong>
          <span className="muted"> Decision Workbench</span>
        </div>
        <button disabled={!stateValid || running} onClick={run}>
          {running ? "Running…" : "Run ▶"}
        </button>
      </header>

      <section className="grid">
        <article>
          <h2>STATE</h2>
          <textarea
            aria-label="State JSON"
            value={stateText}
            onChange={(e) => setStateText(e.target.value)}
          />
          {!stateValid && <p className="error">Invalid JSON</p>}
        </article>

        <article>
          <h2>QUESTIONS</h2>
          {Object.entries(questions).map(([name, q]) => (
            <div className="question" key={name}>
              <strong>{name}</strong>
              <span>{q.type}</span>
              <p>{q.instructions}</p>
            </div>
          ))}
        </article>

        <article>
          <h2>RESULT</h2>
          {error && <p className="error">{error}</p>}
          {!error && !result && <p className="muted">Run an evaluation to inspect Jev output.</p>}
          {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
        </article>
      </section>

      <footer>
        Starter scaffold only — implement visual probability inspector from docs/05-ux-design.md
      </footer>
    </main>
  );
}
