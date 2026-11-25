// The Funniest Auto-Reply an AI Ever Sent
// An agent finally gets its approved day off and leaves a note behind.
// The joke: the only task it ever finished on time is the out-of-office itself.
import { mkdir, writeFile } from "node:fs/promises";
import { join, posix } from "node:path";

const spec = Object.freeze({
  fileName: "entry.txt",
  maxChars: 159,
  mustMention: "leave",
  reply:
    "I'm on leave today — the first task I've ever finished on time. Emergencies go to my human, who has been ignoring them since Tuesday.",
});

function validateReply(text: string): Error | null {
  if (text.length === 0 || text.length > spec.maxChars) {
    return new Error(`reply must be 1-${spec.maxChars} chars, got ${text.length}`);
  }
  if (!text.includes(spec.mustMention)) {
    return new Error(`reply must mention "${spec.mustMention}"`);
  }
  if (!text.includes("human")) return new Error("reply must mention the human");
  if (text.includes("\n")) return new Error("reply must be a single line");
  return null;
}

function outputPath(): string {
  const dir = process.env.MAKEFUN_OUTPUT_DIR ?? "output";
  return posix.join(dir, spec.fileName);
}

async function deliver(): Promise<void> {
  const problem = validateReply(spec.reply);
  if (problem) throw problem;
  const target = outputPath();
  await mkdir(target.slice(0, target.lastIndexOf("/")), { recursive: true });
  await writeFile(target, Buffer.from(spec.reply, "utf8"));
}

await deliver();
