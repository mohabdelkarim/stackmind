export function buildGreeting(name: string): string {
  const cleaned = name.trim() || "world";
  return `Hello, ${cleaned}. Stack conventions live in AGENTS.md.`;
}
