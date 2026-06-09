import { MessageCircle, UserCircle } from "lucide-react";
import { Breadcrumbs } from "../components/Breadcrumbs";

interface PlaceholderPageProps {
  type: "messages" | "profile";
}

export function PlaceholderPage({ type }: PlaceholderPageProps) {
  const isMessages = type === "messages";
  const Icon = isMessages ? MessageCircle : UserCircle;
  const title = isMessages ? "Messages" : "Profile";
  const copy = isMessages
    ? "Buyer and seller conversations stay separated from browsing to preserve marketplace focus."
    : "Profile, seller reputation, saved items, and account preferences would live here.";

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: title }]} />
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-blue-50 text-blue-700">
          <Icon className="h-8 w-8" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-3xl font-black text-slate-950">{title}</h1>
        <p className="mx-auto mt-3 max-w-xl text-slate-600">{copy}</p>
      </section>
    </div>
  );
}
