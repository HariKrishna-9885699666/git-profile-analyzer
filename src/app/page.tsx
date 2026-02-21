import { SearchInput } from "@/components/dashboard/SearchInput";
import { Github } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl -z-10 animate-pulse delay-1000" />
      
      <div className="w-full max-w-2xl flex flex-col items-center text-center space-y-8 glass p-8 sm:p-12 rounded-3xl z-10">
        <div className="flex items-center justify-center p-4 bg-primary/10 rounded-full mb-2">
          <Github className="w-12 h-12 text-primary" />
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
          Git Profile <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Analyzer</span>
        </h1>
        
        <p className="text-lg sm:text-xl text-gray-400 max-w-xl">
          Instantly visualize a developer's activity, tech stack, and contribution habits without requiring any login.
        </p>
        
        <div className="w-full mt-8 flex justify-center">
          <SearchInput />
        </div>
      </div>
      
      <footer className="absolute bottom-8 text-sm text-gray-500 text-center px-4">
        We do not store your data. All analysis happens in real-time.
      </footer>
    </main>
  );
}
