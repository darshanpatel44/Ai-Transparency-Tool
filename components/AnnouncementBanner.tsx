"use client";

import React, { useEffect, useState } from 'react';

interface AnnouncementBannerProps {
  message: string | string[];
}

export default function AnnouncementBanner({ message }: AnnouncementBannerProps) {
  const messages = Array.isArray(message) ? message : [message];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [opacity, setOpacity] = useState(1);
  
  useEffect(() => {
    if (messages.length <= 1) return;
    
    const rotationInterval = 2500; // Time each message is displayed (5 seconds)
    const fadeTime = 500; // Time for fade transition (0.5 seconds)
    
    const intervalId = setInterval(() => {
      // Start fade out
      setOpacity(0);
      
      // After fade out completes, change to next message and fade in
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
        setOpacity(1);
      }, fadeTime);
      
    }, rotationInterval);
    
    return () => clearInterval(intervalId);
  }, [messages]);
  
  return (
    <div className="w-full bg-blue-100 dark:bg-blue-950 p-3 text-center">
      <div className="flex justify-center items-center">
        <div className="text-blue-800 dark:text-blue-200 font-medium">
          <span 
            className="inline-block min-h-6"
            style={{
              opacity: opacity,
              transition: 'opacity 0.5s ease-in-out'
            }}
          >
            {messages[currentIndex]}
          </span>
        </div>
      </div>
    </div>
  );
}