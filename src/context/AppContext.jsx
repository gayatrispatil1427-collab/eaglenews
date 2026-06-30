import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Theme State
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('eagle_news_theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Auth State
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('eagle_news_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Bookmarks
  const [bookmarks, setBookmarks] = useState(() => {
    const savedBookmarks = localStorage.getItem('eagle_news_bookmarks');
    return savedBookmarks ? JSON.parse(savedBookmarks) : [];
  });

  // Notification Feed
  const [notifications, setNotifications] = useState([
    { id: "not-1", title: "ब्रेकिंग न्यूज", message: "पुण्यात ३०० कोटींचे ड्रग्ज जप्त. पोलिसांची मोठी कारवाई.", time: "५ मि. पूर्वी", read: false },
    { id: "not-2", title: "क्रीडा अपडेट", message: "स्नेहा पाटीलने आशियाई स्पर्धेत ८०० मी. शर्यतीत मिळवले सुवर्णपदक.", time: "२ तास पूर्वी", read: true },
    { id: "not-3", title: "हवामान इशारा", message: "कोकण किनारपट्टी भागात मुसळधार पावसाचा इशारा.", time: "५ तास पूर्वी", read: true },
  ]);

  // Weather State
  const [weather, setWeather] = useState({ temp: 32, condition: "Sunny", city: "मुंबई" });

  // Update body class and localStorage for theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('eagle_news_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('eagle_news_theme', 'light');
    }
  }, [darkMode]);

  // Handle weather fluctuations slightly to feel "live"
  useEffect(() => {
    const interval = setInterval(() => {
      setWeather(prev => ({
        ...prev,
        temp: prev.temp + (Math.random() > 0.5 ? 0.5 : -0.5)
      }));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Actions
  const toggleDarkMode = () => setDarkMode(!darkMode);

  const login = (role) => {
    let mockUser = null;
    if (role === 'reader') {
      mockUser = { name: "आनंद कुळकर्णी", email: "anand@gmail.com", role: "reader", roleLabel: "वाचक" };
    } else if (role === 'admin') {
      mockUser = { name: "प्रमोद पाटील (संपादक)", email: "pramod.editor@eaglenews.com", role: "admin", roleLabel: "संपादक/पत्रकार" };
    } else if (role === 'superadmin') {
      mockUser = { name: "रावसाहेब सावंत", email: "chief.editor@eaglenews.com", role: "superadmin", roleLabel: "मुख्य संपादक (Super Admin)" };
    }
    
    if (mockUser) {
      setUser(mockUser);
      localStorage.setItem('eagle_news_user', JSON.stringify(mockUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('eagle_news_user');
  };

  const toggleBookmark = (articleId) => {
    let updated;
    if (bookmarks.includes(articleId)) {
      updated = bookmarks.filter(id => id !== articleId);
    } else {
      updated = [...bookmarks, articleId];
    }
    setBookmarks(updated);
    localStorage.setItem('eagle_news_bookmarks', JSON.stringify(updated));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(not => ({ ...not, read: true })));
  };

  const addNotification = (title, message) => {
    const newNotObj = {
      id: `not-${Date.now()}`,
      title,
      message,
      time: "आत्ताच",
      read: false
    };
    setNotifications(prev => [newNotObj, ...prev]);
  };

  const changeWeatherCity = (cityName) => {
    const temps = {
      "मुंबई": { temp: 31, condition: "धुके / ढगाळ" },
      "पुणे": { temp: 29, condition: "थंडगार वारे" },
      "नागपूर": { temp: 38, condition: "उष्ण लाट" },
      "नाशिक": { temp: 28, condition: "सुखावह हवा" },
      "कोल्हापूर": { temp: 30, condition: "पाऊस" }
    };
    if (temps[cityName]) {
      setWeather({
        city: cityName,
        temp: temps[cityName].temp,
        condition: temps[cityName].condition
      });
    }
  };

  return (
    <AppContext.Provider value={{
      darkMode,
      toggleDarkMode,
      user,
      login,
      logout,
      bookmarks,
      toggleBookmark,
      notifications,
      markAllNotificationsAsRead,
      addNotification,
      weather,
      changeWeatherCity
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
