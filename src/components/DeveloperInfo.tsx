"use client";

import { useState, useEffect } from "react";
import { User, X, Github, Linkedin, Globe, Mail, Phone, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export function DeveloperInfo() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const links = [
    { icon: Github, label: "GitHub", url: "https://github.com/HariKrishna-9885699666" },
    { icon: Linkedin, label: "LinkedIn", url: "https://linkedin.com/in/anemharikrishna" },
    { icon: Globe, label: "Portfolio", url: "https://harikrishna.is-a-good.dev" },
    { icon: Mail, label: "Email", url: "mailto:anemharikrishna@gmail.com" },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 backdrop-blur-xl rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all"
        aria-label="Developer Info"
      >
        <User className="w-6 h-6" />
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          
          <div 
            className="glass relative w-full max-w-sm rounded-[2rem] p-8 shadow-2xl border border-white/5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
                 <User className="w-10 h-10 text-primary" />
              </div>

              <h2 className="text-2xl font-bold text-foreground mb-1">Hari Krishna Anem</h2>
              <p className="text-primary text-sm font-semibold mb-4 tracking-wide uppercase">Full Stack Developer</p>
              
              <div className="space-y-4 w-full mt-4">
                <div className="flex flex-col gap-2">
                  <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
                    <Globe className="w-3.5 h-3.5" /> Hyderabad, India • B.Tech (CSIT)
                  </p>
                </div>

                <div className="flex justify-center gap-3">
                  {links.map((link) => (
                    <a 
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5"
                      title={link.label}
                    >
                      <link.icon className="w-5 h-5 text-gray-300" />
                    </a>
                  ))}
                </div>

                <a 
                  href="tel:+919885699666"
                  className="mt-6 flex items-center justify-center gap-2 w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20"
                >
                  <Phone className="w-4 h-4" /> +91 9885699666
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
