import { getUserProfile, getUserRepos, getContributions, RateLimitError, NotFoundError } from "@/lib/github";
import { DashboardContainer } from "@/components/dashboard/DashboardContainer";
import Link from "next/link";

type PageProps = {
  params: Promise<{ username: string }>;
};

export default async function AnalyzePage({ params }: PageProps) {
  const { username } = await params;

  try {
    const profileP = getUserProfile(username);
    const reposP = getUserRepos(username);
    const contributionsP = getContributions(username);

    const [profile, repos, contributions] = await Promise.all([profileP, reposP, contributionsP]);

    return (
      <main className="min-h-screen bg-background p-4 sm:p-8 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <DashboardContainer 
            username={username}
            initialData={{ profile, repos, contributions }}
          />
        </div>
      </main>
    );

  } catch (error) {
    if (error instanceof NotFoundError) {
      return (
         <div className="min-h-screen flex items-center justify-center p-6 text-center">
            <div className="glass p-12 rounded-3xl max-w-md w-full">
              <h1 className="text-6xl font-black mb-4 text-red-500">404</h1>
              <p className="text-xl mb-8">User <b>{username}</b> not found</p>
              <Link href="/" className="px-6 py-3 bg-primary text-white rounded-xl font-medium">Try another search</Link>
            </div>
         </div>
      );
    }

    if (error instanceof RateLimitError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 text-center">
          <div className="glass p-12 rounded-3xl max-w-xl w-full text-center">
            <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
              <span className="text-orange-500">⚠</span> Rate Limit Exceeded
            </h1>
            <p className="text-gray-400 mb-8 leading-relaxed">
              GitHub API rate limit exceeded. Please check your system configuration or contact the administrator.
            </p>
            <div className="mt-8 pt-6 border-t border-border/50 text-center">
              <Link href="/" className="text-primary hover:underline font-medium">Return Home</Link>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass p-12 rounded-3xl text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Something went wrong</h1>
          <p className="text-gray-400">{(error as Error).message}</p>
          <Link href="/" className="inline-block mt-4 text-primary hover:underline">Return Home</Link>
        </div>
      </div>
    );
  }
}
