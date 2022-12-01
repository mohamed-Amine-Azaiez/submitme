import { useState, useCallback } from "react";

import Auth from "./users/pages/Auth";
import { AuthContext } from "../../frontend/src/shared/context/auth-context";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  const login = useCallback((userId) => {
    setIsLoggedIn(true);
    setUserId(userId);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserId(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: isLoggedIn, userId: userId, login, logout }}
    >
      <main>
        <Auth />
      </main>
    </AuthContext.Provider>
  );
}

export default App;
