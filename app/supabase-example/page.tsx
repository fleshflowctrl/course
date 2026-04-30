import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

/**
 * Example server page for Supabase + `todos` table (from Supabase starter).
 * Remove or replace when you wire auth/data to real features.
 */
export default async function SupabaseExamplePage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: todos, error } = await supabase.from("todos").select();

  if (error) {
    return (
      <div className="mx-auto max-w-lg p-8 font-sans text-taupe">
        <h1 className="font-heading text-2xl font-semibold">Supabase example</h1>
        <p className="mt-4 text-brown">
          Could not load <code className="rounded bg-beige px-1">todos</code>:{" "}
          {error.message}
        </p>
        <p className="mt-2 text-sm text-brown">
          Create a <code>todos</code> table in Supabase or change this query to a table you
          have.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg p-8 font-sans text-taupe">
      <h1 className="font-heading text-2xl font-semibold">Supabase example</h1>
      <ul className="mt-6 list-disc space-y-2 pl-5">
        {todos?.map((todo: { id: string; name?: string | null }) => (
          <li key={todo.id}>{todo.name ?? "(no name)"}</li>
        ))}
      </ul>
      {!todos?.length ? (
        <p className="mt-4 text-brown">No rows yet in <code>todos</code>.</p>
      ) : null}
    </div>
  );
}
