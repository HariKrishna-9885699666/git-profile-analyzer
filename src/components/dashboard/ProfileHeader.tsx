import Image from "next/image";
import { MapPin, Link as LinkIcon, Building, Calendar, Users } from "lucide-react";
import { GitHubUser } from "@/lib/types";
import { format } from "date-fns";

export function ProfileHeader({ profile }: { profile: GitHubUser }) {
  return (
    <div className="glass rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
      
      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-card shrink-0 relative shadow-xl">
        <Image
          src={profile.avatar_url}
          alt={`${profile.login}'s avatar`}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{profile.name || profile.login}</h1>
          <a
            href={profile.html_url}
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline text-lg font-medium"
          >
            @{profile.login}
          </a>
        </div>

        {profile.bio && (
          <p className="text-gray-400 max-w-2xl text-base sm:text-lg">{profile.bio}</p>
        )}

        <div className="flex flex-wrap gap-4 text-sm sm:text-base text-gray-500 font-medium">
          {profile.company && (
            <div className="flex items-center gap-1.5 text-foreground/80">
              <Building className="w-4 h-4" />
              <span>{profile.company}</span>
            </div>
          )}
          {profile.location && (
            <div className="flex items-center gap-1.5 text-foreground/80">
              <MapPin className="w-4 h-4" />
              <span>{profile.location}</span>
            </div>
          )}
          {profile.blog && (
            <div className="flex items-center gap-1.5 text-foreground/80">
              <LinkIcon className="w-4 h-4" />
              <a href={profile.blog.startsWith("http") ? profile.blog : `https://${profile.blog}`} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                {profile.blog}
              </a>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-foreground/80">
            <Calendar className="w-4 h-4" />
            <span>Joined {format(new Date(profile.created_at), "MMMM yyyy")}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-row md:flex-col gap-4 w-full md:w-auto shrink-0 justify-around md:justify-center border-t md:border-t-0 md:border-l border-border/50 pt-4 md:pt-0 md:pl-8">
        <div className="flex flex-col items-center md:items-start">
          <span className="text-gray-500 text-sm font-medium flex items-center gap-1.5"><Users className="w-4 h-4" /> Followers</span>
          <span className="text-2xl font-bold">{profile.followers.toLocaleString()}</span>
        </div>
        <div className="flex flex-col items-center md:items-start">
          <span className="text-gray-500 text-sm font-medium">Following</span>
          <span className="text-2xl font-bold">{profile.following.toLocaleString()}</span>
        </div>
        <div className="flex flex-col items-center md:items-start">
          <span className="text-gray-500 text-sm font-medium">Public Repos</span>
          <span className="text-2xl font-bold">{profile.public_repos.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
