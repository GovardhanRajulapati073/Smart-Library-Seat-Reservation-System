import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const userId = localStorage.getItem("userId");

  useEffect(() => {

    if (userId) {

      axios
        .get(`http://localhost:5000/api/auth/profile/${userId}`)
        .then((res) => {

          setUser(res.data);

        });

    }

  }, [userId]);

  return (

    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>

  );

};