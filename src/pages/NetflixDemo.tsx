import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Info, ChevronLeft, ChevronRight, Search, Bell, User, X } from "lucide-react";
import { Link } from "react-router-dom";

const allMovies = [
  { id: 1, title: "Stranger Things", image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=300&h=450&fit=crop", category: "trending" },
  { id: 2, title: "The Crown", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop", category: "trending" },
  { id: 3, title: "Dark", image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=450&fit=crop", category: "trending" },
  { id: 4, title: "Money Heist", image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=300&h=450&fit=crop", category: "trending" },
  { id: 5, title: "Breaking Bad", image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop", category: "trending" },
  { id: 6, title: "Narcos", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=450&fit=crop", category: "trending" },
  { id: 7, title: "The Witcher", image: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=300&h=450&fit=crop", category: "popular" },
  { id: 8, title: "Ozark", image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&h=450&fit=crop", category: "popular" },
  { id: 9, title: "Peaky Blinders", image: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=300&h=450&fit=crop", category: "popular" },
  { id: 10, title: "Black Mirror", image: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=300&h=450&fit=crop", category: "popular" },
  { id: 11, title: "Mindhunter", image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=450&fit=crop", category: "popular" },
  { id: 12, title: "You", image: "https://images.unsplash.com/photo-1512070679279-8988d32161be?w=300&h=450&fit=crop", category: "popular" },
  { id: 13, title: "Wednesday", image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=300&h=450&fit=crop", category: "newReleases" },
  { id: 14, title: "The Sandman", image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&h=450&fit=crop", category: "newReleases" },
  { id: 15, title: "Dahmer", image: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=300&h=450&fit=crop", category: "newReleases" },
  { id: 16, title: "Cobra Kai", image: "https://images.unsplash.com/photo-1555992336-03a23c7b20ee?w=300&h=450&fit=crop", category: "newReleases" },
  { id: 17, title: "Squid Game", image: "https://images.unsplash.com/photo-1611419010234-b5f9d3d6a3f5?w=300&h=450&fit=crop", category: "newReleases" },
  { id: 18, title: "All of Us Are Dead", image: "https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?w=300&h=450&fit=crop", category: "newReleases" },
];

const movies = {
  trending: allMovies.filter(m => m.category === "trending"),
  popular: allMovies.filter(m => m.category === "popular"),
  newReleases: allMovies.filter(m => m.category === "newReleases"),
};

const MovieRow = ({ title, movies: rowMovies }: { title: string; movies: typeof movies.trending }) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById(`row-${title.replace(/\s/g, "")}`);
    if (container) {
      const scrollAmount = direction === "left" ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setScrollPosition(container.scrollLeft + scrollAmount);
    }
  };

  return (
    <div className="mb-8 group/row">
      <h2 className="text-xl font-semibold mb-4 px-12">{title}</h2>
      <div className="relative">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-black/50 opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/70"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <div
          id={`row-${title.replace(/\s/g, "")}`}
          className="flex gap-2 overflow-x-auto scrollbar-hide px-12 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {rowMovies.map((movie) => (
            <div
              key={movie.id}
              className="flex-shrink-0 w-[200px] cursor-pointer transition-transform duration-300 hover:scale-110 hover:z-10"
            >
              <img
                src={movie.image}
                alt={movie.title}
                className="w-full h-[300px] object-cover rounded"
              />
              <p className="mt-2 text-sm text-center truncate">{movie.title}</p>
            </div>
          ))}
        </div>
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 bottom-0 z-10 w-12 bg-black/50 opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/70"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

const NetflixDemo = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return allMovies.filter(movie =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between px-12 py-4">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-[#E50914] text-3xl font-bold tracking-wider">
              STREAMFLIX
            </Link>
            <div className="hidden md:flex gap-6 text-sm">
              <a href="#" className="hover:text-gray-300 transition">Home</a>
              <a href="#" className="hover:text-gray-300 transition">TV Shows</a>
              <a href="#" className="hover:text-gray-300 transition">Movies</a>
              <a href="#" className="hover:text-gray-300 transition">New & Popular</a>
              <a href="#" className="hover:text-gray-300 transition">My List</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative flex items-center">
              {isSearchOpen ? (
                <div className="flex items-center bg-black/80 border border-white/30 rounded">
                  <Search className="w-5 h-5 ml-2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Titles, people, genres"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48 bg-transparent border-none text-white placeholder:text-gray-400 focus-visible:ring-0"
                    autoFocus
                  />
                  <button
                    onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                    className="p-2 hover:text-gray-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Search
                  className="w-5 h-5 cursor-pointer hover:text-gray-300"
                  onClick={() => setIsSearchOpen(true)}
                />
              )}
            </div>
            <Bell className="w-5 h-5 cursor-pointer hover:text-gray-300" />
            <div className="w-8 h-8 bg-[#E50914] rounded flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-[85vh] mb-8">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=1080&fit=crop')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center h-full px-12 max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">The Crown</h1>
          <p className="text-lg text-gray-200 mb-6 line-clamp-3">
            This drama follows the political rivalries and romance of Queen Elizabeth II's reign 
            and the events that shaped the second half of the twentieth century.
          </p>
          <div className="flex gap-4">
            <Button className="bg-white text-black hover:bg-white/90 text-lg px-8 py-6">
              <Play className="w-6 h-6 mr-2 fill-current" />
              Play
            </Button>
            <Button variant="secondary" className="bg-gray-500/70 hover:bg-gray-500/50 text-white text-lg px-8 py-6">
              <Info className="w-6 h-6 mr-2" />
              More Info
            </Button>
          </div>
        </div>
      </div>

      {/* Movie Rows or Search Results */}
      <div className="pb-16">
        {searchQuery.trim() ? (
          <div className="px-12">
            <h2 className="text-xl font-semibold mb-4">
              Search Results for "{searchQuery}" ({searchResults.length} found)
            </h2>
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {searchResults.map((movie) => (
                  <div
                    key={movie.id}
                    className="cursor-pointer transition-transform duration-300 hover:scale-105"
                  >
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="w-full h-[250px] object-cover rounded"
                    />
                    <p className="mt-2 text-sm text-center truncate">{movie.title}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No movies found matching your search.</p>
            )}
          </div>
        ) : (
          <>
            <MovieRow title="Trending Now" movies={movies.trending} />
            <MovieRow title="Popular on Streamflix" movies={movies.popular} />
            <MovieRow title="New Releases" movies={movies.newReleases} />
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-[#141414] border-t border-gray-800 py-8 px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm text-gray-400">
            <div className="space-y-2">
              <a href="#" className="block hover:text-white">FAQ</a>
              <a href="#" className="block hover:text-white">Investor Relations</a>
              <a href="#" className="block hover:text-white">Privacy</a>
              <a href="#" className="block hover:text-white">Speed Test</a>
            </div>
            <div className="space-y-2">
              <a href="#" className="block hover:text-white">Help Center</a>
              <a href="#" className="block hover:text-white">Jobs</a>
              <a href="#" className="block hover:text-white">Cookie Preferences</a>
              <a href="#" className="block hover:text-white">Legal Notices</a>
            </div>
            <div className="space-y-2">
              <a href="#" className="block hover:text-white">Account</a>
              <a href="#" className="block hover:text-white">Ways to Watch</a>
              <a href="#" className="block hover:text-white">Corporate Information</a>
              <a href="#" className="block hover:text-white">Only on Streamflix</a>
            </div>
            <div className="space-y-2">
              <a href="#" className="block hover:text-white">Media Center</a>
              <a href="#" className="block hover:text-white">Terms of Use</a>
              <a href="#" className="block hover:text-white">Contact Us</a>
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-8">© 2025 Streamflix Demo. A sample project.</p>
        </div>
      </footer>
    </div>
  );
};

export default NetflixDemo;
