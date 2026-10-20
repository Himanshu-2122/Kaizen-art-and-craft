/* ⚠️ DEV ONLY — protected by import.meta.env.DEV */
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { SectionHeading } from "@/components/common/SectionHeading";
import { PageHeader } from "@/components/common/PageHeader";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { PriceTag } from "@/components/common/PriceTag";
import { RatingStars } from "@/components/common/RatingStars";
import { DiscountBadge } from "@/components/common/DiscountBadge";
import { QuantityStepper } from "@/components/common/QuantityStepper";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { ProductCardSkeleton } from "@/components/common/ProductCardSkeleton";
import { Loader } from "@/components/common/Loader";
import {
  Button,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  Skeleton,
} from "@/components/ui";

export default function DevDesignSystem() {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  const colors = {
    background: isDark ? "hsl(20 15% 10%)" : "hsl(40 20% 98%)",
    foreground: isDark ? "hsl(40 15% 98%)" : "hsl(24 25% 12%)",
    card: isDark ? "hsl(20 15% 12%)" : "hsl(0 0% 100%)",
    primary: isDark ? "hsl(15 55% 48%)" : "hsl(15 55% 44%)",
    primaryForeground: isDark ? "hsl(20 15% 10%)" : "hsl(40 20% 98%)",
    secondary: isDark ? "hsl(45 65% 52%)" : "hsl(45 65% 55%)",
    secondaryForeground: isDark ? "hsl(20 15% 10%)" : "hsl(24 25% 12%)",
    muted: isDark ? "hsl(30 10% 18%)" : "hsl(35 10% 87%)",
    mutedForeground: isDark ? "hsl(24 10% 55%)" : "hsl(24 12% 40%)",
    border: isDark ? "hsl(30 10% 16%)" : "hsl(30 14% 86%)",
    input: isDark ? "hsl(30 10% 16%)" : "hsl(30 14% 86%)",
    ring: isDark ? "hsl(15 55% 44%)" : "hsl(15 55% 44%)",
    accent: isDark ? "hsl(15 55% 48%)" : "hsl(15 55% 44%)",
    accentForeground: isDark ? "hsl(20 15% 10%)" : "hsl(40 20% 98%)",
    success: isDark ? "hsl(135 50% 35%)" : "hsl(135 50% 32%)",
    successForeground: isDark ? "hsl(0 0% 100%)" : "hsl(0 0% 100%)",
    destructive: isDark ? "hsl(3 75% 42%)" : "hsl(3 75% 42%)",
    destructiveForeground: isDark ? "hsl(0 0% 100%)" : "hsl(0 0% 100%)",
  };

  const typography = {
    fontFamily: isDark ? "Inter, system-ui, sans-serif" : "Inter, system-ui, sans-serif",
    displayFontFamily: isDark ? "Playfair Display, serif" : "Playfair Display, serif",
    h1: isDark ? "clamp(2rem, 4vw, 3rem)" : "clamp(2rem, 4vw, 3rem)",
    h2: isDark ? "clamp(1.75rem, 3vw, 2.25rem)" : "clamp(1.75rem, 3vw, 2.25rem)",
    body: isDark ? "clamp(1rem, 1.5vw, 1.125rem)" : "clamp(1rem, 1.5vw, 1.125rem)",
    small: isDark ? "clamp(0.875rem, 1.2vw, 1rem)" : "clamp(0.875rem, 1.2vw, 1rem)",
    caption: isDark ? "clamp(0.75rem, 1vw, 0.875rem)" : "clamp(0.75rem, 1vw, 0.875rem)",
  };

  return (
    <div className="p-6 sm:p-8 max-w-[1400px] mx-auto" style={{ backgroundColor: colors.background, minHeight: "100vh" }}>
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 px-4 py-2 rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)/90] transition-colors"
        aria-label="Toggle theme"
      >
        Theme: {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>

      <SectionHeading>Design System Demo — Kaizen Livings</SectionHeading>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Colors */}
        <div>
          <PageHeader title="Color Swatches" className="mb-4" />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="block text-xs font-medium text-[555555] mb-1">Background</span>
              <div className="h-16 w-full rounded bg-[var(--background)]" />
            </div>
            <div>
              <span className="block text-xs font-medium text-[555555] mb-1">Foreground</span>
              <div className="h-16 w-full rounded bg-[var(--foreground)]" />
            </div>
            <div>
              <span className="block text-xs font-medium text-[555555] mb-1">Primary</span>
              <div className="h-16 w-full rounded bg-[var(--primary)]" />
            </div>
            <div>
              <span className="block text-xs font-medium text-[555555] mb-1">Secondary</span>
              <div className="h-16 w-full rounded bg-[var(--secondary)]" />
            </div>
            <div>
              <span className="block text-xs font-medium text-[555555] mb-1">Muted</span>
              <div className="h-16 w-full rounded bg-[var(--muted)]" />
            </div>
            <div>
              <span className="block text-xs font-medium text-[555555] mb-1">Border</span>
              <div className="h-16 w-full rounded bg-[var(--border)]" />
            </div>
          </div>
        </div>

        {/* Typography */}
        <div>
          <PageHeader title="Typography" className="mb-4" />
          <div className="space-y-4">
            <div>
              <span className="font-display text-[clamp(2rem,4vw,3rem)] block mb-1">H1 heading</span>
              <h1 className="font-display text-[clamp(2rem,4vw,3ram)]">Sample Heading</h1>
            </div>
            <div>
              <span className="small text-[555555] block mb-1">Body text</span>
              <p className="body">This is body text with normal weight.</p>
            </div>
            <div>
              <span className="small text-[555555] block mb-1">Small text</span>
              <p className="small">This is small text.</p>
            </div>
            <div>
              <span className="caption text-[750rem] text-[555555] block mb-1">Caption</span>
              <p className="caption">This is caption text.</p>
            </div>
          </div>
        </div>

        {/* Components */}
        <div>
          <PageHeader title="Component Samples" className="mb-4" />

          <div className="space-y-4">
            <div>
              <SectionHeading>Button Variants</SectionHeading>
              <div className="flex flex-wrap gap-2">
                <Button variant="default">Default</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
              <div className="mt-2 flex gap-2">
                <Button size="sm" variant="default">Sm</Button>
                <Button size="default" variant="default">Md</Button>
                <Button size="lg" variant="default">Lg</Button>
                <Button size="icon" aria-label="menu">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M3 12l2-2m0 0l2-2m-2 0l2 2m2-2l-2-2m2 0l2 2m0 0l-2 2m0 2v-2m2 0v-2m0 2v-2" />
                  </svg>
                </Button>
              </div>
            </div>

            <div>
              <SectionHeading>Input</SectionHeading>
              <Input placeholder="Type something..." />
              <Input disabled placeholder="Disabled" />
            </div>

            <div>
              <SectionHeading>Select</SectionHeading>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue />
                  <SelectContent>
                    <SelectItem value="1">Option 1</SelectItem>
                    <SelectItem value="2">Option 2</SelectItem>
                    <SelectItem value="3">Option 3</SelectItem>
                  </SelectContent>
                </SelectTrigger>
              </Select>

              <div>
                <SectionHeading>Badge</SectionHeading>
                <Badge>Default</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge className="ml-2">Secondary</Badge>
              </div>
            </div>

            <div>
              <SectionHeading>Tabs</SectionHeading>
              <Tabs defaultValue="1">
                <TabsList>
                  <TabsTrigger value="1">Tab 1</TabsTrigger>
                  <TabsTrigger value="2">Tab 2</TabsTrigger>
                  <TabsTrigger value="3">Tab 3</TabsTrigger>
                </TabsList>
                <div>Content 1</div>
                <div>Content 2</div>
                <div>Content 3</div>
              </Tabs>
            </div>

            <div>
              <SectionHeading>Skeleton</SectionHeading>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 rounded" />
              <Skeleton className="h-6 w-1/2 rounded" />
            </div>

            <div>
              <SectionHeading>Product Card Skeleton</SectionHeading>
              <ProductCardSkeleton hasImage={true} />
              <ProductCardSkeleton hasImage={false} />
            </div>

            <div>
              <SectionHeading>Empty State</SectionHeading>
              <EmptyState
                icon={() => <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /></svg>}
                title="No items found"
                description="Your cart is empty. Add some products to get started."
                actionLabel="Shop now"
                actionOnClick={() => console.log("shop")}
              />
            </div>

            <div>
              <SectionHeading>Error State</SectionHeading>
              <ErrorState
                title="Something went wrong"
                description="Please try again later."
                retryLabel="Retry"
                retryOnClick={() => console.log("retry")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}