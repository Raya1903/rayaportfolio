import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Play, Info, ChevronLeft, ChevronRight, Search, Bell, User, X, Plus, ThumbsUp, Volume2 } from "lucide-react";
import { Link } from "react-router-dom";

type Movie = {
  id: number;
  title: string;
  image: string;
  year?: string;
  rating?: string;
  duration?: string;
  description?: string;
  genres?: string[];
};

const movies: { trending: Movie[]; popular: Movie[]; newReleases: Movie[] } = {
  trending: [
    { id: 1, title: "Stranger Things", image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=300&h=450&fit=crop", year: "2016", rating: "TV-14", duration: "4 Seasons", description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.", genres: ["Sci-Fi", "Horror", "Drama"] },
    { id: 2, title: "The Crown", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop", year: "2016", rating: "TV-MA", duration: "6 Seasons", description: "This drama follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the twentieth century.", genres: ["Drama", "History", "Biography"] },
    { id: 3, title: "Dark", image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=450&fit=crop", year: "2017", rating: "TV-MA", duration: "3 Seasons", description: "A family saga with a supernatural twist, set in a German town where the disappearance of two young children exposes the relationships among four families.", genres: ["Sci-Fi", "Thriller", "Mystery"] },
    { id: 4, title: "Money Heist", image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=300&h=450&fit=crop", year: "2017", rating: "TV-MA", duration: "5 Seasons", description: "Eight thieves take hostages and lock themselves in the Royal Mint of Spain as a criminal mastermind manipulates the police to carry out his plan.", genres: ["Action", "Crime", "Thriller"] },
    { id: 5, title: "Breaking Bad", image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop", year: "2008", rating: "TV-MA", duration: "5 Seasons", description: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine to secure his family's future.", genres: ["Crime", "Drama", "Thriller"] },
    { id: 6, title: "Narcos", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=450&fit=crop", year: "2015", rating: "TV-MA", duration: "3 Seasons", description: "A chronicled look at the criminal exploits of Colombian drug lord Pablo Escobar, as well as the many other drug kingpins who plagued the country.", genres: ["Biography", "Crime", "Drama"] },
  ],
  popular: [
    { id: 7, title: "The Witcher", image: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=300&h=450&fit=crop", year: "2019", rating: "TV-MA", duration: "3 Seasons", description: "Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.", genres: ["Action", "Adventure", "Fantasy"] },
    { id: 8, title: "Ozark", image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&h=450&fit=crop", year: "2017", rating: "TV-MA", duration: "4 Seasons", description: "A financial advisor drags his family from Chicago to the Missouri Ozarks, where he must launder money to appease a drug boss.", genres: ["Crime", "Drama", "Thriller"] },
    { id: 9, title: "Peaky Blinders", image: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=300&h=450&fit=crop", year: "2013", rating: "TV-MA", duration: "6 Seasons", description: "A gangster family epic set in 1900s England, centering on a gang who sew razor blades in the peaks of their caps.", genres: ["Crime", "Drama"] },
    { id: 10, title: "Black Mirror", image: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=300&h=450&fit=crop", year: "2011", rating: "TV-MA", duration: "6 Seasons", description: "An anthology series exploring a twisted, high-tech multiverse where humanity's greatest innovations and darkest instincts collide.", genres: ["Drama", "Sci-Fi", "Thriller"] },
    { id: 11, title: "Mindhunter", image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=450&fit=crop", year: "2017", rating: "TV-MA", duration: "2 Seasons", description: "In the late 1970s, two FBI agents expand criminal science by delving into the psychology of murder and getting dangerously close to all-too-real monsters.", genres: ["Crime", "Drama", "Thriller"] },
    { id: 12, title: "You", image: "https://images.unsplash.com/photo-1512070679279-8988d32161be?w=300&h=450&fit=crop", year: "2018", rating: "TV-MA", duration: "4 Seasons", description: "A dangerously charming, intensely obsessive young man goes to extreme measures to insert himself into the lives of those he is transfixed by.", genres: ["Crime", "Drama", "Romance"] },
  ],
  newReleases: [
    { id: 13, title: "Wednesday", image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=300&h=450&fit=crop", year: "2022", rating: "TV-14", duration: "1 Season", description: "Follows Wednesday Addams' years as a student at Nevermore Academy, where she attempts to master her emerging psychic ability.", genres: ["Comedy", "Crime", "Fantasy"] },
    { id: 14, title: "The Sandman", image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&h=450&fit=crop", year: "2022", rating: "TV-MA", duration: "1 Season", description: "A wizard attempting to capture Death to bargain for eternal life traps her younger brother Dream instead.", genres: ["Drama", "Fantasy", "Horror"] },
    { id: 15, title: "Dahmer", image: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=300&h=450&fit=crop", year: "2022", rating: "TV-MA", duration: "Limited Series", description: "The story of serial killer Jeffrey Dahmer, exploring how he evaded capture for over a decade.", genres: ["Biography", "Crime", "Drama"] },
    { id: 16, title: "Cobra Kai", image: "https://images.unsplash.com/photo-1555992336-03a23c7b20ee?w=300&h=450&fit=crop", year: "2018", rating: "TV-14", duration: "6 Seasons", description: "Decades after their 1984 All Valley Karate Tournament bout, Johnny Lawrence and Daniel LaRusso find themselves martial arts rivals again.", genres: ["Action", "Comedy", "Drama"] },
    { id: 17, title: "Squid Game", image: "https://images.unsplash.com/photo-1611419010234-b5f9d3d6a3f5?w=300&h=450&fit=crop", year: "2021", rating: "TV-MA", duration: "1 Season", description: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games for a tempting prize, but the stakes are deadly.", genres: ["Action", "Drama", "Mystery"] },
    { id: 18, title: "All of Us Are Dead", image: "https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?w=300&h=450&fit=crop", year: "2022", rating: "TV-MA", duration: "1 Season", description: "A high school becomes ground zero for a zombie virus outbreak. Trapped students must fight their way out or turn into one of the rabid infected.", genres: ["Action", "Drama", "Horror"] },
  ],
};

const MovieModal = ({ movie, open, onClose }: { movie: Movie | null; open: boolean; onClose: () => void }) => {
  if (!movie) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 bg-[#181818] border-none overflow-hidden">
        <div className="relative">
          <div
            className="h-[400px] bg-cover bg-center"
            style={{ backgroundImage: `url('${movie.image.replace("w=300&h=450", "w=800&h=450")}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#181818] flex items-center justify-center hover:bg-[#282828] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h2 className="text-4xl font-bold mb-4">{movie.title}</h2>
            <div className="flex gap-3 mb-4">
              <Button className="bg-white text-black hover:bg-white/90 px-8">
                <Play className="w-5 h-5 mr-2 fill-current" />
                Play
              </Button>
              <button className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-white transition">
                <Plus className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-white transition">
                <ThumbsUp className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-white transition ml-auto">
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-8 pt-4">
          <div className="flex gap-4 text-sm mb-4">
            <span className="text-green-500 font-semibold">98% Match</span>
            <span className="text-gray-400">{movie.year}</span>
            <span className="border border-gray-400 px-1 text-xs">{movie.rating}</span>
            <span className="text-gray-400">{movie.duration}</span>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <p className="text-gray-200 leading-relaxed">{movie.description}</p>
            </div>
            <div className="text-sm">
              <p className="text-gray-400 mb-2">
                <span className="text-gray-500">Genres: </span>
                {movie.genres?.join(", ")}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const MovieRow = ({ 
  title, 
  movies: rowMovies, 
  onMovieClick 
}: { 
  title: string; 
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
}) => {
  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById(`row-${title.replace(/\s/g, "")}`);
    if (container) {
      const scrollAmount = direction === "left" ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
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
              onClick={() => onMovieClick(movie)}
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
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const allMovies = [...movies.trending, ...movies.popular, ...movies.newReleases];
  
  const filteredMovies = searchQuery.trim()
    ? allMovies.filter(movie => 
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

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
              <div className={`flex items-center transition-all duration-300 ${searchOpen ? 'bg-black/90 border border-white' : ''}`}>
                <button
                  onClick={() => {
                    setSearchOpen(!searchOpen);
                    if (searchOpen) {
                      setSearchQuery("");
                    }
                  }}
                  className="p-2 hover:text-gray-300"
                >
                  <Search className="w-5 h-5" />
                </button>
                {searchOpen && (
                  <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Titles, people, genres"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-[200px] md:w-[250px] bg-transparent border-none text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                )}
                {searchOpen && searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="p-2 hover:text-gray-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <Bell className="w-5 h-5 cursor-pointer hover:text-gray-300" />
            <div className="w-8 h-8 bg-[#E50914] rounded flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
          </div>
        </div>
      </nav>


      {/* Search Results */}
      {searchQuery.trim() && (
        <div className="pt-24 pb-16 px-12">
          <h2 className="text-2xl font-semibold mb-6">
            Search results for "{searchQuery}"
          </h2>
          {filteredMovies.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredMovies.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => setSelectedMovie(movie)}
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
            <p className="text-gray-400">No results found for "{searchQuery}"</p>
          )}
        </div>
      )}

      {/* Movie Rows - Hidden when searching */}
      {!searchQuery.trim() && (
        <>
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
                <Button 
                  variant="secondary" 
                  className="bg-gray-500/70 hover:bg-gray-500/50 text-white text-lg px-8 py-6"
                  onClick={() => setSelectedMovie(movies.trending[1])}
                >
                  <Info className="w-6 h-6 mr-2" />
                  More Info
                </Button>
              </div>
            </div>
          </div>

          <div className="pb-16">
            <MovieRow title="Trending Now" movies={movies.trending} onMovieClick={setSelectedMovie} />
            <MovieRow title="Popular on Streamflix" movies={movies.popular} onMovieClick={setSelectedMovie} />
            <MovieRow title="New Releases" movies={movies.newReleases} onMovieClick={setSelectedMovie} />
          </div>
        </>
      )}

      {/* Movie Detail Modal */}
      <MovieModal 
        movie={selectedMovie} 
        open={!!selectedMovie} 
        onClose={() => setSelectedMovie(null)} 
      />

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
