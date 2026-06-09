import {
  Camera,
  CheckCircle2,
  HelpCircle,
  ImagePlus,
  Tag,
  Upload,
} from "lucide-react";
import { type ChangeEvent, type DragEvent, useMemo, useState } from "react";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Button } from "../components/ui/Button";
import { useToast } from "../components/ui/Toast";
import { categories, conditions, popularBrands } from "../data/marketplace";
import type { ListingCondition, ListingDraft } from "../types";
import { formatPrice } from "../utils/marketplace";

const steps = ["Add Photos", "Item Details", "Pricing", "Review & Publish"];

const initialDraft: ListingDraft = {
  photos: [],
  title: "",
  brand: "",
  category: "",
  condition: "",
  description: "",
  price: "",
  location: "Quezon City",
};

const conditionHelp: Record<ListingCondition, string> = {
  New: "Unused, unopened, and complete with original packaging.",
  "Like new": "Barely used with no visible wear.",
  Good: "Works well with minor cosmetic wear.",
  Fair: "Functional but has visible wear or missing accessories.",
};

function photoFallbacks(count: number) {
  const fallbacks = [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80",
  ];

  return fallbacks.slice(0, count);
}

export function CreateListingPage() {
  const [draft, setDraft] = useState<ListingDraft>(initialDraft);
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { notify } = useToast();

  const previewPhotos = draft.photos.length > 0 ? draft.photos : photoFallbacks(1);
  const previewPrice = Number(draft.price || 0);

  const completion = useMemo(() => {
    const fields = [
      draft.photos.length > 0,
      draft.title,
      draft.brand,
      draft.category,
      draft.condition,
      draft.description,
      draft.price,
      draft.location,
    ];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  }, [draft]);

  function updateDraft(patch: Partial<ListingDraft>) {
    setDraft((current) => ({ ...current, ...patch }));
    setErrors((current) => {
      const next = { ...current };
      Object.keys(patch).forEach((key) => delete next[key]);
      return next;
    });
  }

  function addFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList).filter((file) => file.type.startsWith("image/"));
    if (files.length === 0) {
      notify("Upload image files only.", "info");
      return;
    }

    const urls = files.slice(0, 6 - draft.photos.length).map((file) => URL.createObjectURL(file));
    updateDraft({ photos: [...draft.photos, ...urls] });
    notify(`${urls.length} photo${urls.length === 1 ? "" : "s"} added.`);
  }

  function validateStep(step: number) {
    const nextErrors: Record<string, string> = {};

    if (step === 0 && draft.photos.length === 0) {
      nextErrors.photos = "Add at least one photo so buyers can evaluate the item.";
    }
    if (step === 1) {
      if (!draft.title.trim()) nextErrors.title = "Enter a clear listing title.";
      if (!draft.brand.trim()) nextErrors.brand = "Select or type a brand.";
      if (!draft.category.trim()) nextErrors.category = "Choose a category.";
      if (!draft.condition) nextErrors.condition = "Choose an item condition.";
      if (draft.description.trim().length < 20) {
        nextErrors.description = "Add at least 20 characters describing the item.";
      }
    }
    if (step === 2) {
      if (!draft.price || Number(draft.price) <= 0) {
        nextErrors.price = "Enter a valid price above zero.";
      }
      if (!draft.location.trim()) nextErrors.location = "Enter pickup or seller location.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function nextStep() {
    if (!validateStep(currentStep)) {
      notify("Please fix the highlighted fields.", "info");
      return;
    }
    setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  }

  function publish() {
    const valid = [0, 1, 2].every((step) => validateStep(step));
    if (!valid) {
      notify("Listing needs a few corrections before publishing.", "info");
      return;
    }

    notify("Listing published successfully.");
    setCurrentStep(0);
    setDraft(initialDraft);
  }

  function handlePhotoInput(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) addFiles(event.target.files);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    addFiles(event.dataTransfer.files);
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Sell" }, { label: "Create listing" }]} />

      <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
          Step-by-step listing flow
        </p>
        <h1 className="mt-1 text-3xl font-black text-slate-950">Create a marketplace listing</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Progressive disclosure keeps the task focused while the live preview updates in real
          time.
        </p>

        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-bold text-slate-700">Completion</span>
            <span className="font-black text-blue-800">{completion}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-700 transition-all"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>

        <ol className="mt-6 grid gap-3 sm:grid-cols-4" aria-label="Listing steps">
          {steps.map((step, index) => (
            <li key={step}>
              <button
                type="button"
                onClick={() => {
                  if (index <= currentStep || validateStep(currentStep)) setCurrentStep(index);
                }}
                className={[
                  "flex min-h-14 w-full items-center gap-3 rounded-2xl border p-3 text-left text-sm font-bold transition",
                  currentStep === index
                    ? "border-blue-700 bg-blue-50 text-blue-800"
                    : index < currentStep
                      ? "border-green-200 bg-green-50 text-green-800"
                      : "border-slate-200 bg-white text-slate-600",
                ].join(" ")}
                aria-current={currentStep === index ? "step" : undefined}
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-white">
                  {index < currentStep ? (
                    <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    index + 1
                  )}
                </span>
                {step}
              </button>
            </li>
          ))}
        </ol>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          {currentStep === 0 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-black text-slate-950">Add Photos</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Buyers scan images first. Add up to six clear photos.
                </p>
              </div>
              <label
                onDragOver={(event) => event.preventDefault()}
                onDrop={handleDrop}
                className="flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-blue-300 bg-blue-50 p-6 text-center transition hover:bg-blue-100"
              >
                <Upload className="h-10 w-10 text-blue-700" aria-hidden="true" />
                <span className="mt-3 text-lg font-black text-slate-950">
                  Drag photos here or choose files
                </span>
                <span className="mt-1 text-sm text-slate-600">PNG, JPG, or WEBP</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoInput}
                  className="sr-only"
                  aria-label="Upload listing photos"
                />
              </label>
              {errors.photos && <p className="text-sm font-semibold text-red-700">{errors.photos}</p>}
              {draft.photos.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {draft.photos.map((photo, index) => (
                    <div key={photo} className="relative aspect-square overflow-hidden rounded-2xl">
                      <img src={photo} alt={`Uploaded item ${index + 1}`} className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() =>
                          updateDraft({
                            photos: draft.photos.filter((current) => current !== photo),
                          })
                        }
                        className="absolute right-2 top-2 min-h-11 min-w-11 rounded-full bg-white/90 text-sm font-black text-red-700 shadow"
                        aria-label={`Remove photo ${index + 1}`}
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-black text-slate-950">Item Details</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Structured information helps buyers compare listings quickly.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1 text-sm font-bold text-slate-700 sm:col-span-2">
                  Title
                  <input
                    value={draft.title}
                    onChange={(event) => updateDraft({ title: event.target.value })}
                    className="min-h-11 w-full rounded-xl border border-slate-300 px-3 text-slate-950"
                    placeholder="Example: Sony A6400 mirrorless camera kit"
                  />
                  {errors.title && <span className="block text-red-700">{errors.title}</span>}
                </label>
                <label className="space-y-1 text-sm font-bold text-slate-700">
                  Brand
                  <input
                    value={draft.brand}
                    onChange={(event) => updateDraft({ brand: event.target.value })}
                    list="brand-suggestions"
                    className="min-h-11 w-full rounded-xl border border-slate-300 px-3 text-slate-950"
                    placeholder="Start typing a brand"
                  />
                  <datalist id="brand-suggestions">
                    {popularBrands.map((brand) => (
                      <option key={brand} value={brand} />
                    ))}
                  </datalist>
                  {errors.brand && <span className="block text-red-700">{errors.brand}</span>}
                </label>
                <label className="space-y-1 text-sm font-bold text-slate-700">
                  Category
                  <input
                    value={draft.category}
                    onChange={(event) => updateDraft({ category: event.target.value })}
                    list="category-suggestions"
                    className="min-h-11 w-full rounded-xl border border-slate-300 px-3 text-slate-950"
                    placeholder="Start typing a category"
                  />
                  <datalist id="category-suggestions">
                    {categories.map((category) => (
                      <option key={category.id} value={category.name} />
                    ))}
                  </datalist>
                  {errors.category && <span className="block text-red-700">{errors.category}</span>}
                </label>
              </div>

              <fieldset className="space-y-3">
                <legend className="text-sm font-bold text-slate-700">Condition</legend>
                <div className="grid gap-3 sm:grid-cols-4">
                  {conditions.map((condition) => (
                    <label
                      key={condition}
                      title={conditionHelp[condition]}
                      className={[
                        "relative flex min-h-16 cursor-pointer items-center justify-between gap-2 rounded-2xl border p-3 text-sm font-bold transition",
                        draft.condition === condition
                          ? "border-blue-700 bg-blue-50 text-blue-800"
                          : "border-slate-200 text-slate-700 hover:border-blue-300",
                      ].join(" ")}
                    >
                      <input
                        type="radio"
                        name="condition"
                        checked={draft.condition === condition}
                        onChange={() => updateDraft({ condition })}
                        className="h-4 w-4 accent-blue-700"
                      />
                      {condition}
                      <HelpCircle className="h-4 w-4 text-slate-500" aria-hidden="true" />
                    </label>
                  ))}
                </div>
                {errors.condition && <p className="text-sm font-semibold text-red-700">{errors.condition}</p>}
              </fieldset>

              <label className="space-y-1 text-sm font-bold text-slate-700">
                Description
                <textarea
                  value={draft.description}
                  onChange={(event) => updateDraft({ description: event.target.value })}
                  rows={6}
                  className="w-full rounded-xl border border-slate-300 p-3 text-slate-950"
                  placeholder="Describe included accessories, usage, defects, pickup notes, and reason for selling."
                />
                {errors.description && (
                  <span className="block text-red-700">{errors.description}</span>
                )}
              </label>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-black text-slate-950">Pricing</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Clear pricing prevents negotiation friction and user errors.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1 text-sm font-bold text-slate-700">
                  Price
                  <input
                    type="number"
                    value={draft.price}
                    onChange={(event) => updateDraft({ price: event.target.value })}
                    className="min-h-11 w-full rounded-xl border border-slate-300 px-3 text-slate-950"
                    placeholder="0"
                    min="1"
                  />
                  {errors.price && <span className="block text-red-700">{errors.price}</span>}
                </label>
                <label className="space-y-1 text-sm font-bold text-slate-700">
                  Location
                  <input
                    value={draft.location}
                    onChange={(event) => updateDraft({ location: event.target.value })}
                    className="min-h-11 w-full rounded-xl border border-slate-300 px-3 text-slate-950"
                    placeholder="City or neighborhood"
                  />
                  {errors.location && <span className="block text-red-700">{errors.location}</span>}
                </label>
              </div>
              <div className="rounded-3xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
                <Tag className="mr-2 inline h-4 w-4" aria-hidden="true" />
                Suggested price band is mocked for this prototype. In production, this would use
                recent comparable transactions.
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-black text-slate-950">Review & Publish</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Confirm the listing details before it becomes visible to buyers.
                </p>
              </div>
              <div className="grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm">
                {[
                  ["Photos", `${draft.photos.length} uploaded`],
                  ["Title", draft.title || "Missing"],
                  ["Brand", draft.brand || "Missing"],
                  ["Category", draft.category || "Missing"],
                  ["Condition", draft.condition || "Missing"],
                  ["Price", previewPrice > 0 ? formatPrice(previewPrice) : "Missing"],
                  ["Location", draft.location || "Missing"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-4">
                    <span className="font-bold text-slate-600">{label}</span>
                    <span className="text-right font-semibold text-slate-950">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-between">
            <Button
              variant="secondary"
              onClick={() => setCurrentStep((step) => Math.max(step - 1, 0))}
              disabled={currentStep === 0}
            >
              Back
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button onClick={nextStep}>Continue</Button>
            ) : (
              <Button onClick={publish}>Publish listing</Button>
            )}
          </div>
        </section>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-950">Live preview</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                Updates instantly
              </span>
            </div>
            <div className="overflow-hidden rounded-3xl border border-slate-200">
              <div className="aspect-square bg-slate-100">
                {previewPhotos.length > 0 ? (
                  <img
                    src={previewPhotos[0]}
                    alt="Listing preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-slate-400">
                    <Camera className="h-12 w-12" aria-hidden="true" />
                  </div>
                )}
              </div>
              <div className="space-y-3 p-4">
                <h3 className="line-clamp-2 text-lg font-black text-slate-950">
                  {draft.title || "Your listing title"}
                </h3>
                <p className="text-2xl font-black text-slate-950">
                  {previewPrice > 0 ? formatPrice(previewPrice) : "Set price"}
                </p>
                <div className="flex flex-wrap gap-2 text-xs font-bold">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                    {draft.condition || "Condition"}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                    {draft.category || "Category"}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{draft.location || "Location"}</p>
              </div>
            </div>
            <div className="mt-4 flex items-start gap-3 rounded-2xl bg-blue-50 p-3 text-sm text-blue-900">
              <ImagePlus className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" />
              <p>
                The preview keeps status visible while validation prevents incomplete publishing.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
