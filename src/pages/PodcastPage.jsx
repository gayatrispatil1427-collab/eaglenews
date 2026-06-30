import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { db } from '../services/db';
import { Radio, Play, Pause, Volume2, Clock, Calendar, Disc, VolumeX } from 'lucide-react';
import AdBanner from '../components/AdBanner';

export default function PodcastPage() {
  const { data: podcastList = [] } = useQuery({
    queryKey: ['podcasts'],
    queryFn: db.getPodcasts
  });

  const [activePodcast, setActivePodcast] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(null);

  // Set default podcast on load
  useEffect(() => {
    if (podcastList.length > 0 && !activePodcast) {
      setActivePodcast(podcastList[0]);
    }
  }, [podcastList, activePodcast]);

  // Handle Play/Pause trigger
  const handlePlayToggle = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => console.error("Audio playback error:", err));
    }
  };

  // Change Track
  const handleSelectTrack = (track) => {
    setActivePodcast(track);
    setIsPlaying(false);
    setCurrentTime(0);
    // Timeout to let audio src update in DOM
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.load();
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(err => console.error("Audio playback error:", err));
      }
    }, 100);
  };

  // Update Progress
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Loaded metadata (duration)
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Track ended
  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Seek slider
  const handleSeekChange = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Volume slider
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      audioRef.current.muted = newVolume === 0;
    }
  };

  // Mute click
  const handleMuteClick = () => {
    const muteState = !isMuted;
    setIsMuted(muteState);
    if (audioRef.current) {
      audioRef.current.muted = muteState;
    }
  };

  // Format time (mm:ss)
  const formatTime = (timeInSecs) => {
    if (isNaN(timeInSecs)) return "00:00";
    const minutes = Math.floor(timeInSecs / 60);
    const seconds = Math.floor(timeInSecs % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Audio Element Hidden */}
      {activePodcast && (
        <audio 
          ref={audioRef}
          src={activePodcast.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleAudioEnded}
        />
      )}

      {/* Header Bar */}
      <h1 className="font-heading font-black text-2xl md:text-3xl text-secondary dark:text-white border-b-2 border-primary pb-3 mb-8 flex items-center gap-2 text-left">
        <Radio className="w-7 h-7 text-primary animate-pulse" /> ईगल न्यूज पॉडकास्ट (Eagle News Podcast)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Active Podcast Details & Custom Player Console (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6 text-left">
          
          {activePodcast && (
            <div className="bg-white dark:bg-brandCard-dark border border-gray-100 dark:border-neutral-800 rounded-2xl p-6 md:p-8 shadow-premium flex flex-col md:flex-row gap-8 items-center">
              
              {/* Spinning Disc Cover */}
              <div className="relative shrink-0 select-none">
                <div className={`w-36 h-36 md:w-44 md:h-44 bg-neutral-900 rounded-full flex items-center justify-center shadow-lg relative border-4 border-neutral-800 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }}>
                  <Disc className="w-16 h-16 text-primary" />
                  {/* Inner center center circle */}
                  <div className="w-8 h-8 bg-white dark:bg-brandCard-dark rounded-full absolute" />
                </div>
                <span className="absolute top-2 left-2 bg-primary text-white font-black text-[9px] px-2 py-0.5 rounded uppercase tracking-wider">
                  चालू ट्रॅक
                </span>
              </div>

              {/* Player details controls */}
              <div className="flex-1 w-full flex flex-col justify-between text-left">
                <div>
                  <h2 className="font-heading font-black text-lg md:text-xl text-secondary dark:text-white mb-2 leading-snug">
                    {activePodcast.title}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                    {activePodcast.description}
                  </p>
                </div>

                {/* Progress bar seek slider */}
                <div className="flex flex-col gap-1 mb-6">
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeekChange}
                    className="w-full h-1 bg-gray-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-gray-400">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Player button controls row */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-gray-50 dark:border-neutral-800/80">
                  
                  {/* Play Button */}
                  <button
                    onClick={handlePlayToggle}
                    className="bg-primary hover:bg-primary-hover text-white p-3.5 rounded-full shadow-glow transform hover:scale-105 transition-all duration-200 flex items-center justify-center shrink-0"
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
                  </button>

                  {/* Volume Control widget */}
                  <div className="flex items-center gap-2">
                    <button onClick={handleMuteClick} className="text-gray-400 hover:text-primary transition-colors">
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-16 md:w-24 h-1 bg-gray-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>

                  {/* Date & Track duration details */}
                  <div className="flex items-center gap-3 text-[10px] text-gray-400 font-bold">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(activePodcast.date).toLocaleDateString('mr-IN')}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {activePodcast.duration} मि.</span>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* Inline Content Ad */}
          <AdBanner placement="in_article" />

        </div>

        {/* RIGHT COLUMN: Episodes Playlist list (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-brandCard-dark border border-gray-100 dark:border-neutral-800 rounded-xl p-5 shadow-premium text-left">
          
          <h3 className="font-heading font-black text-lg mb-4 text-secondary dark:text-white border-b border-gray-100 dark:border-neutral-800 pb-2">
            सर्व पॉडकास्ट एपिसोड
          </h3>
          
          <div className="flex flex-col gap-4">
            {podcastList.map(pod => {
              const isActive = activePodcast?.id === pod.id;
              return (
                <div 
                  key={pod.id}
                  onClick={() => handleSelectTrack(pod)}
                  className={`p-3.5 border rounded-lg cursor-pointer flex gap-3 items-center transition-all duration-300 ${
                    isActive 
                      ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                      : 'border-gray-100 dark:border-neutral-800/80 hover:border-primary/50'
                  }`}
                >
                  {/* Play circle indicator icon */}
                  <div className={`p-2.5 rounded-full shrink-0 ${isActive ? 'bg-primary text-white' : 'bg-gray-50 dark:bg-neutral-800 text-gray-400'}`}>
                    {isActive && isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h5 className="font-heading font-bold text-xs md:text-sm text-secondary dark:text-white truncate">{pod.title}</h5>
                    <div className="flex gap-3 text-[9px] text-gray-400 font-bold mt-1.5">
                      <span>{pod.duration} मि.</span>
                      <span>•</span>
                      <span>{pod.views?.toLocaleString('mr-IN')} वाचक</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
}
