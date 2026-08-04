import { requireAdmin } from "@/lib/admin-session";
import { PostsManager } from "@/components/admin/posts-manager";

export default async function AdminPostsPage() {
  await requireAdmin();
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <p className="text-sm text-muted-foreground">Manage blog posts and articles</p>
      </div>
      <PostsManager />
    </div>
  );
}
