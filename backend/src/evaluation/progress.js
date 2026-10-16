// In-memory progress of running evaluations, keyed by an id that the frontend
// generates and sends with the evaluation request. The frontend polls
// GET /api/evaluate/progress/:id while the evaluation request is running.
// Entries are removed one hour after the evaluation has finished.

const progress = new Map();
const KEEP_FINISHED_MS = 60 * 60 * 1000;

export function startProgress(id) {
  if (!id) return;
  progress.set(id, {
    status: "running",
    done: 0,
    total: null,
    repetition: null,
    numRepetitions: null,
    bpmnModel: null,
    errors: 0,
    error: null,
    startedAt: new Date().toISOString(),
    finishedAt: null,
  });
}

export function updateProgress(id, { done, total, repetition, numRepetitions, bpmnModel, error }) {
  const state = id && progress.get(id);
  if (!state) return;
  Object.assign(state, { done, total, repetition, numRepetitions });
  if (bpmnModel) state.bpmnModel = bpmnModel;
  if (error) state.errors += 1;
}

export function finishProgress(id, errorMessage = null) {
  const state = id && progress.get(id);
  if (!state) return;
  state.status = errorMessage ? "error" : "finished";
  state.error = errorMessage;
  state.finishedAt = new Date().toISOString();
  setTimeout(() => progress.delete(id), KEEP_FINISHED_MS).unref();
}

export function getProgress(id) {
  return progress.get(id) ?? null;
}
