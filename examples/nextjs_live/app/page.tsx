import { buildGreeting } from "@/lib/greeting";
import { env } from "@/lib/env";

export default function HomePage() {
  const message = buildGreeting("stackmind");

  return (
    <main>
      <p style={{ letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.8rem" }}>
        {env.NEXT_PUBLIC_APP_NAME}
      </p>
      <h1 style={{ fontSize: "2.4rem", margin: "0.4rem 0 1rem" }}>Live Next.js sample</h1>
      <p>{message}</p>
      <p>
        This app follows the stackmind Next.js kit: Server Components by default, Zod env
        validation in <code>lib/env.ts</code>, logic in <code>lib/</code>.
      </p>
    </main>
  );
}
