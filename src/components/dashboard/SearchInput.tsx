"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import Image from "next/image";

export function SearchInput() {
  const [username, setUsername] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const suggestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (username.trim().length > 2) {
        setLoading(true);
        try {
          const res = await fetch(`https://api.github.com/search/users?q=${username}&per_page=5`);
          const data = await res.json();
          setSuggestions(data.items || []);
          setShowSuggestions(true);
        } catch (err) {
          console.error("Search failed", err);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [username]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      router.push(`/analyze/${username.trim()}`);
      setShowSuggestions(false);
    }
  };

  const selectUser = (login: string) => {
    router.push(`/analyze/${login}`);
    setShowSuggestions(false);
  };

  return (
    <div className="w-full relative group" ref={suggestionRef}>
      <form onSubmit={handleSearch} className="relative z-20">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
        </div>
        <input
          type="text"
          className="block w-full pl-12 pr-28 py-4 border border-border rounded-2xl leading-5 bg-card/50 text-foreground placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-ring sm:text-lg transition-all shadow-sm glass"
          placeholder="Enter GitHub username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onFocus={() => username.length > 2 && setShowSuggestions(true)}
        />
        <div className="absolute inset-y-2 right-2 flex items-center gap-2">
           {loading && <Loader2 className="w-4 h-4 animate-spin text-primary mr-2" />}
           <button 
            type="submit" 
            disabled={!username.trim()}
            className="px-6 py-2 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white rounded-xl font-medium transition-colors"
          >
            Analyze
          </button>
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 glass border border-border/50 rounded-2xl shadow-2xl overflow-hidden z-30 animate-in fade-in slide-in-from-top-2 duration-200">
          {suggestions.map((user) => (
            <button
              key={user.id}
              onClick={() => selectUser(user.login)}
              className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-border/50">
                <Image src={user.avatar_url} alt={user.login} width={40} height={40} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-foreground">{user.login}</span>
                <span className="text-xs text-gray-500">GitHub Profile</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
