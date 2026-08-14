document.addEventListener('DOMContentLoaded', () => {
  // Live demo simulation state
  const stageAnalyze = document.getElementById('stage-analyze');
  const stageConflict = document.getElementById('stage-conflict');
  const stageApprove = document.getElementById('stage-approve');
  const stageRecall = document.getElementById('stage-recall');

  const demoForm = document.getElementById('memory-demo-form');
  const consoleOutput = document.getElementById('console-output');
  const loopActions = document.getElementById('loop-actions');
  const approveBtn = document.getElementById('approve-btn');
  const rejectBtn = document.getElementById('reject-btn');
  const recallBtn = document.getElementById('recall-btn');

  let currentStage = 1;
  let activeMemoryData = null;

  function setStage(stage) {
    currentStage = stage;
    const stages = [stageAnalyze, stageConflict, stageApprove, stageRecall];
    stages.forEach((el, index) => {
      if (!el) return;
      el.classList.remove('active', 'complete');
      if (index + 1 < stage) {
        el.classList.add('complete');
      } else if (index + 1 === stage) {
        el.classList.add('active');
      }
    });
  }

  function appendLog(text) {
    if (!consoleOutput) return;
    consoleOutput.textContent = text;
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
  }

  if (demoForm) {
    demoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const contextType = document.getElementById('context-type').value;
      const scope = document.getElementById('scope-select').value;
      const topic = document.getElementById('topic-input').value;
      const content = document.getElementById('content-input').value;

      activeMemoryData = {
        id: 'mem-' + Math.random().toString(36).substring(2, 9),
        context_type: contextType,
        topic: topic,
        content: content,
        scope: scope,
        status: 'pending',
        timestamp: new Date().toISOString()
      };

      setStage(1);
      appendLog(`[MCP PROPOSAL INGESTED]\n` +
        `Client: Antigravity CLI (FastMCP Protocol 2024-11-05)\n` +
        `Payload: remember_convention("${topic}", scope="${scope}")\n` +
        `Generating vector embedding (dimension: 3072, cosine metric)...\n\n` +
        `Evaluating proposal against active CockroachDB cluster rules...`);

      setTimeout(() => {
        setStage(2);
        const hasConflict = topic.toLowerCase().includes('css') || topic.toLowerCase().includes('tailwind');
        
        if (hasConflict) {
          appendLog(`[SEMANTIC CONFLICT DETECTED: Cosine Similarity 0.089]\n` +
            `Existing Active Memory: "Styling and Aesthetics (Vanilla CSS)"\n` +
            `Conflict ID: 7a2f1c84-90b1\n` +
            `Rule Flag: Rule proposes conflicting style engine.\n` +
            `Action Required: Escalated to Human-In-The-Loop Review Queue in HiveContext Dashboard.`);
        } else {
          appendLog(`[INVARIANT VERIFICATION: PASSED]\n` +
            `Cross-Tenant Leakage Check: 0 violations.\n` +
            `Vector Distance Bounds: [0.741] - Unique rule pattern.\n` +
            `Governance State: Status is 'pending' review.`);
        }

        setTimeout(() => {
          setStage(3);
          if (loopActions) loopActions.hidden = false;
          if (approveBtn) approveBtn.disabled = false;
          if (rejectBtn) rejectBtn.disabled = false;
          if (recallBtn) recallBtn.disabled = true;
          
          appendLog(`[DASHBOARD APPROVAL GATE READY]\n` +
            `Memory ID: ${activeMemoryData.id}\n` +
            `Topic: ${activeMemoryData.topic}\n` +
            `Awaiting reviewer action. Click 'Approve Rule' below to index into vector table.`);
        }, 800);
      }, 900);
    });
  }

  if (approveBtn) {
    approveBtn.addEventListener('click', () => {
      approveBtn.disabled = true;
      if (rejectBtn) rejectBtn.disabled = true;
      if (recallBtn) recallBtn.disabled = false;

      appendLog(`[COCKROACHDB TRANSACTION COMMITTED]\n` +
        `SQL: INSERT INTO hive_context (id, topic, status) VALUES ('${activeMemoryData.id}', '${activeMemoryData.topic}', 'APPROVED');\n` +
        `Index: HNSW Vector Cosine Index hc_emb_3072_hnsw_idx updated.\n` +
        `Status: Rule is now active org-wide!\n\n` +
        `Click 'Simulate Agent Retrieval' to test pre-task context recall.`);
    });
  }

  if (rejectBtn) {
    rejectBtn.addEventListener('click', () => {
      approveBtn.disabled = true;
      rejectBtn.disabled = true;
      setStage(1);
      appendLog(`[PROPOSAL REJECTED BY REVIEWER]\n` +
        `Memory proposal was marked as rejected and discarded.\n` +
        `No changes were made to the active vector index.`);
    });
  }

  if (recallBtn) {
    recallBtn.addEventListener('click', () => {
      setStage(4);
      appendLog(`[AGENT PRE-TASK QUERY EXECUTED]\n` +
        `Agent: Antigravity CLI\n` +
        `Action: search_context(query="${activeMemoryData.topic}")\n` +
        `SQL Execution: SELECT topic, content, 1 - (embedding <=> query_vec) AS similarity FROM hive_context WHERE status='APPROVED' ORDER BY similarity DESC LIMIT 3;\n\n` +
        `[RETRIEVED RESULT]\n` +
        `Match 1: "${activeMemoryData.topic}" (Confidence: 99.4%)\n` +
        `Rule: "${activeMemoryData.content}"\n` +
        `Result: Agent successfully adhered to team convention without hallucination.`);
    });
  }

  // Copy code helper
  window.copySnippet = function(id, btnElement) {
    const codeEl = document.getElementById(id);
    if (!codeEl) return;
    navigator.clipboard.writeText(codeEl.textContent.trim());
    const originalText = btnElement.textContent;
    btnElement.textContent = 'COPIED!';
    btnElement.style.color = '#34d399';
    setTimeout(() => {
      btnElement.textContent = originalText;
      btnElement.style.color = '';
    }, 2000);
  };
});
