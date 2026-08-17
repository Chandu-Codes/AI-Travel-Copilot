import React, { useState } from 'react';
import { Heart, Star, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DestinationCard as IDestinationCard } from '../types';
import { resolveDestinationImage } from '../utils/geoRegistry';

interface Props {
  destination: IDestinationCard;
}

export const DestinationCard: React.FC<Props> = ({ destination }) => {
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/plan-trip?dest=${destination.name}`)}
      className="group bg-white rounded-3xl border border-[#E8DFD3] p-3 shadow-warm-sm hover:shadow-warm hover:border-[#A23B19]/50 transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[#FAF6F0]">
        <img
          src={destination.image_url || resolveDestinationImage(destination.name)}
          alt={destination.name}
          onError={(e) => {
            const target = e.currentTarget;
            const fallback = resolveDestinationImage(destination.name);
            if (target.src !== fallback) {
              target.src = fallback;
            }
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1D1917]/80 via-transparent to-transparent opacity-85" />

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition ${
            isLiked 
              ? 'bg-[#A23B19] text-white' 
              : 'bg-white/80 text-[#1D1917] hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>

        {/* AI Score Badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#A23B19] text-white text-[11px] font-semibold flex items-center gap-1 shadow-sm">
          <Sparkles className="w-3 h-3 text-[#D97736]" />
          <span>{destination.ai_score}% Match</span>
        </div>

        {/* Card Title on Image */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="font-serif font-bold text-base leading-tight drop-shadow-sm">{destination.name}</h3>
          <p className="text-xs text-[#F2ECE4] font-medium">{destination.country}</p>
        </div>
      </div>

      {/* Card Info Footer */}
      <div className="pt-3 px-1 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-[#1D1917] font-bold">
          <Star className="w-3.5 h-3.5 fill-[#D97736] text-[#D97736]" />
          <span>{destination.rating}</span>
        </div>

        <div className="text-[#78716C] font-medium">
          Est. <span className="text-[#A23B19] font-bold text-sm">{destination.avg_cost_inr}</span>
        </div>
      </div>
    </div>
  );
};
