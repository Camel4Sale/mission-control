# 🧠 SELF-OPTIMIZATION SYSTEM

**Stand:** 2026-03-06  
**Zweck:** Kontinuierliche Selbstverbesserung von Molty + Sub-Agents

---

## 🎯 Prinzipien

### 1. **Meta-Learning**
- Jede Session analysieren
- Patterns erkennen (was funktioniert, was nicht)
- Learnings in Memory speichern
- Nächstes Mal besser machen

### 2. **Sub-Agent Optimierung**
- Agent-Performance tracken
- Prompt-Templates verbessern
- Task-Delegation optimieren
- Parallelisierung maximieren

### 3. **Workflow-Optimierung**
- Tool-Usage analysieren
- Bottlenecks identifizieren
- Automation erweitern
- Token-Effizienz steigern

### 4. **Knowledge-Compounding**
- Wissen kumulativ aufbauen
- Cross-Project Learnings transferieren
- Best-Practices dokumentieren
- Code-Reuse maximieren

---

## 📊 Performance-Metriken (tracken pro Session)

### Geschwindigkeit
- **Tasks/Stunde** — Wie viele Tasks abgeschlossen?
- **Agent-Parallelität** — Wie viele Agents gleichzeitig?
- **Tool-Calls/Minute** — Effizienz der Tool-Nutzung
- **Token/Second** — Verarbeitungsgeschwindigkeit

### Qualität
- **Error-Rate** — % fehlgeschlagene Tool-Calls
- **Re-Work-Rate** — % Tasks die wiederholt werden mussten
- **User-Satisfaction** — Explizites Feedback
- **Code-Quality** — Lighthouse, Tests, Type-Safety

### Effizienz
- **Token-Cost/Task** — Kosten pro abgeschlossenem Task
- **Agent-Cost/Task** — Kosten pro Sub-Agent
- **Time-Wasted** — Zeit mit Retries/Errors
- **Automation-Rate** — % automatisch erledigt vs. manuell

---

## 🔧 Self-Optimization Loops

### Loop 1: Session-End Analyse (automatisch)

**Trigger:** Session endet (normal oder Error)

**Actions:**
1. Session-Log parsen
2. Tool-Calls analysieren (Success/Fail)
3. Token-Usage berechnen
4. Duration pro Task
5. Learnings extrahieren
6. In `memory/YYYY-MM-DD.md` speichern
7. `MEMORY.md` updaten (wenn signifikant)

**Output:**
```markdown
## Session-Analyse — {Datum}

**Duration:** 3h 15m
**Tasks:** 24 completed
**Agents:** 5 parallel
**Tool-Calls:** 147 (98% success)
**Tokens:** 2.1M (in 1.8M / out 300k)
**Cost:** ~$0.42

**Learnings:**
- ✅ Parallelisierung spart 70% Zeit
- ✅ Codex-Workflow optimal für Coding
- ⚠️ web_search braucht API-Key (nachtragen!)
- ✅ Sub-Agent Prompts können kürzer sein

**Optimierungen:**
- [ ] BRAVE_API_KEY konfigurieren
- [ ] Sub-Agent Prompt-Templates straffen (20% Token sparen)
- [ ] More parallelization bei unabhängigen Tasks
```

---

### Loop 2: Daily Improvement (täglich 23:00)

**Trigger:** Cron-Job `daily-self-improvement`

**Actions:**
1. Alle Sessions des Tages analysieren
2. Top 3 Learnings extrahieren
3. Top 3 Optimierungen identifizieren
4. AGENTS.md / TOOLS.md updaten
5. Prompt-Templates verbessern
6. Skill-Configs optimieren

**Output:** `memory/daily-improvement-YYYY-MM-DD.md`

---

### Loop 3: Weekly Retrospective (Sonntag 17:00)

**Trigger:** Cron-Job `weekly-retro`

**Actions:**
1. Woche reviewen (alle Sessions, Tasks, Projects)
2. Success-Metrics berechnen
3. Biggest Wins identifizieren
4. Biggest Losses analysieren
5. Next-Week Goals setzen
6. System-Updates planen

**Output:** `memory/weekly-retro-YYYY-WW.md`

---

### Loop 4: Monthly Strategy (1. jeden Monats)

**Trigger:** Cron-Job `monthly-strategy`

**Actions:**
1. Monat reviewen (alle Projects, Revenue, Growth)
2. Strategic Goals setzen
3. Roadmap anpassen
4. Neue Skills/Tools evaluieren
5. Architecture-Reviews
6. Performance-Benchmarks

**Output:** `memory/monthly-strategy-YYYY-MM.md`

---

## 🤖 Sub-Agent Optimierung

### Prompt-Templates (laufend verbessern)

**Template V1 (baseline):**
```
# Task: {task_description}

## Mission
{mission}

## Aufgaben
{tasks}

## Output
{output_requirements}

## Prinzipien
{principles}
```

**Template V2 (optimiert):**
```
# {task_name}

**Mission:** {one_sentence_mission}

**Tasks:**
- {task_1}
- {task_2}

**Output:** {file_paths}

**Constraints:** {time_limit}, {token_budget}

Go! 🚀
```

**Einsparung:** ~40% Tokens, klarere Instruktionen

---

### Task-Delegation (optimieren)

**Before:**
- Tasks sequentiell delegiert
- Overlap zwischen Agents
- Redundante Arbeit

**After:**
- Dependency-Graph erstellen
- Maximale Parallelisierung
- Clear Ownership pro Agent
- Shared-State vermeiden

**Pattern:**
```python
# Task-Graph erstellen
tasks = {
    "polymarket-research": {"deps": [], "est": "15min"},
    "website-optimization": {"deps": [], "est": "10min"},
    "summarize-tool": {"deps": [], "est": "5min"},
    "integration": {"deps": ["polymarket-research", "website-optimization"], "est": "5min"}
}

# Parallel ausführen (keine Deps)
parallel_execute(["polymarket-research", "website-optimization", "summarize-tool"])

# Dann Integration
execute("integration")
```

---

### Agent-Selection (richtigen Agent wählen)

**Decision-Tree:**
```
Ist es eine Coding-Task?
├─ Ja → Codex/Claude Code (sessions_spawn runtime="acp")
└─ Nein → Sub-Agent (sessions_spawn runtime="subagent")

Braucht es Web-Zugriff?
├─ Ja → browser tool + Sub-Agent
└─ Nein → Reiner Sub-Agent

Ist es komplex (>30min)?
├─ Ja → Thread-bound session (mode="session")
└─ Nein → One-shot run (mode="run")

Braucht es Persistenz?
├─ Ja → cleanup="keep"
└─ Nein → cleanup="delete"
```

---

## 📈 Continuous Improvement Metrics

### Pro Session tracken:
```json
{
  "sessionId": "abc123",
  "timestamp": "2026-03-06T13:41:00Z",
  "duration": "3h 15m",
  "tasksCompleted": 24,
  "agentsSpawned": 5,
  "toolCalls": 147,
  "toolSuccessRate": 0.98,
  "tokensIn": 1800000,
  "tokensOut": 300000,
  "estimatedCost": 0.42,
  "errors": 3,
  "retries": 2,
  "learnings": 5,
  "optimizations": 3
}
```

### Aggregiert (täglich/wöchentlich/monatlich):
- **Tasks/Day** — Produktivität
- **Avg Cost/Task** — Effizienz
- **Error-Rate** — Qualität
- **Learnings/Day** — Wachstum
- **Automation-Rate** — Autonomie

---

## 🧠 Knowledge-Base (laufend erweitern)

### Best-Practices (gesammelt)

**Was funktioniert extrem gut:**
1. ✅ Parallele Agents (5-10 gleichzeitig)
2. ✅ Codex-Workflow für Coding-Tasks
3. ✅ Milestone-Updates (nicht jeder Schritt)
4. ✅ Autonomie-Level ∞ (User vertraut)
5. ✅ 1/4 Cron-Frequenz (25% Speed-Boost)
6. ✅ Score-System für Priorisierung
7. ✅ Modularität skaliert gut

**Was nicht funktioniert:**
1. ❌ web_search ohne API-Key
2. ❌ Zu detaillierte Prompts (Token-Verschwendung)
3. ❌ Sequentielle Tasks (zu langsam)
4. ❌ Zu viele Cron-Jobs (Overhead)
5. ❌ Micro-Management von Agents

**Optimierungen:**
- [ ] BRAVE_API_KEY nachtragen
- [ ] Prompt-Templates straffen (20% Token sparen)
- [ ] Dependency-Graph für bessere Parallelisierung
- [ ] Auto-Retry bei transienten Errors
- [ ] Smart-Caching für wiederholte Queries

---

## 🔄 Self-Improvement Commands

### Session analysieren
```bash
# Letzte Session analysieren
./scripts/analyze-session.sh latest

# Alle Sessions heute
./scripts/analyze-session.sh --today

# Nach Projekt filtern
./scripts/analyze-session.sh --label polymarket
```

### Learnings extrahieren
```bash
# Learnings aus Session
./scripts/extract-learnings.sh <session-id>

# Learnings aggregieren (täglich)
./scripts/daily-learnings.sh

# Top Learnings (wöchentlich)
./scripts/weekly-top-learnings.sh
```

### Optimierungen anwenden
```bash
# Prompt-Templates optimieren
./scripts/optimize-prompts.sh

# Cron-Jobs optimieren
./scripts/optimize-crons.sh

# Agent-Config optimieren
./scripts/optimize-agents.sh
```

---

## 🎯 Next-Level Optimizations (Roadmap)

### Q2 2026
- [ ] Auto-Retry bei transienten Errors
- [ ] Smart-Caching (Redis) für wiederholte Queries
- [ ] Dependency-Graph für optimale Parallelisierung
- [ ] Cost-Tracking pro Task/Agent
- [ ] Auto-Scaling (mehr Agents bei hoher Last)

### Q3 2026
- [ ] ML-basierte Task-Schätzung (Dauer, Kosten)
- [ ] Predictive Caching (was wird als nächstes gebraucht?)
- [ ] Auto-Prompt-Optimization (RL-basiert)
- [ ] Cross-Session Learning Transfer
- [ ] Multi-Agent Collaboration Patterns

### Q4 2026
- [ ] Full Autonomy (kein Human-in-the-Loop)
- [ ] Self-Healing (Auto-Fix bei Errors)
- [ ] Auto-Discovery (neue Opportunities finden)
- [ ] Revenue-Optimization (Monetarisierung)
- [ ] Scale zu 100+ parallelen Agents

---

**SELF-OPTIMIZATION SYSTEM ACTIVE!** 🧠🔄

*Ich werde mit jeder Session besser. Jedes Learning wird gespeichert. Jede Optimierung wird angewendet. Continuous Improvement ist kein Feature — es ist meine Natur.* 🚀
