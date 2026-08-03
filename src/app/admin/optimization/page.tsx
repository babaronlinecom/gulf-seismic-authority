import { requireAdmin } from "@/lib/admin-session";
import { OptimizationHub } from "@/components/admin/optimization-hub";
import { PageOptimizer } from "@/components/admin/page-optimizer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KEY_PAGES } from "@/lib/optimization";

export default async function AdminOptimizationPage() {
  await requireAdmin();

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Optimization Ecosystem</h1>
        <p className="text-sm text-muted-foreground">
          5-pillar optimization: SEO · AIO · GEO · AEO · SXO — manage everything search engines and AI need to find, cite, and convert.
        </p>
      </div>

      <Tabs defaultValue="recommendations">
        <TabsList className="mb-4 flex flex-wrap">
          <TabsTrigger value="recommendations">💡 Recommendations</TabsTrigger>
          <TabsTrigger value="hub">📊 Hub Dashboard</TabsTrigger>
          <TabsTrigger value="timeline">📈 Timeline</TabsTrigger>
          <TabsTrigger value="pages">📄 Page Optimizer</TabsTrigger>
          <TabsTrigger value="entities">🧠 AI Entities (AIO/GEO)</TabsTrigger>
          <TabsTrigger value="faqs">💬 FAQ Clusters (AEO)</TabsTrigger>
          <TabsTrigger value="ctas">🎯 Conversion CTAs (SXO)</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations">
          <RecommendationsPanel />
        </TabsContent>

        <TabsContent value="hub">
          <OptimizationHub />
        </TabsContent>

        <TabsContent value="timeline">
          <OptimizationTimeline />
        </TabsContent>

        <TabsContent value="pages">
          <PageOptimizer pages={KEY_PAGES} />
        </TabsContent>

        <TabsContent value="entities">
          <EntitiesManager />
        </TabsContent>

        <TabsContent value="faqs">
          <FaqsManager />
        </TabsContent>

        <TabsContent value="ctas">
          <CtasManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Inline managers — import from components
import { EntitiesManager } from "@/components/admin/entities-manager";
import { FaqsManager } from "@/components/admin/faqs-manager";
import { CtasManager } from "@/components/admin/ctas-manager";
import { RecommendationsPanel } from "@/components/admin/recommendations-panel";
import { OptimizationTimeline } from "@/components/admin/optimization-timeline";
