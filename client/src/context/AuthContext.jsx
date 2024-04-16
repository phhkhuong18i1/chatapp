import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/service";
import useDebounce from "../hooks/useDebounce";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  //login
  const [loginError, setLoginError] = useState(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState();

  const debounce = useDebounce(search, 500);

  console.log("searchResult", searchResult);
  useEffect(() => {
    const user = localStorage.getItem("User");
    setUser(JSON.parse(user));
  }, []);

  const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo(info);
  }, []);

  const updateLoginInfo = useCallback((info) => {
    setLoginInfo(info);
  }, []);

  const updateSearch = useCallback((search) => {
    if(!search){
    setSearchResult([]);
    return;
    }
    
    setSearch(search);
  }, []);

  const registerUser = useCallback(
    async (e) => {
      e.preventDefault();
      setIsRegisterLoading(true);
      setRegisterError(null);
      const response = await postRequest(
        `${baseUrl}/users/register`,
        JSON.stringify(registerInfo)
      );

      setIsRegisterLoading(false);
      if (response.error) {
        return setRegisterError(response);
      }
      localStorage.setItem("User", JSON.stringify(response));
      setUser(response);
    },
    [registerInfo]
  );

  const loginUser = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoginLoading(true);
      setLoginError(null);
      const response = await postRequest(
        `${baseUrl}/users/login`,
        JSON.stringify(loginInfo)
      );

      setIsLoginLoading(false);
      if (response.error) {
        return setLoginError(response);
      }

      localStorage.setItem("User", JSON.stringify(response));
      setUser(response);
    },
    [loginInfo]
  );

  const logoutUser = useCallback(() => {
    localStorage.removeItem("User");
    setUser(null);
  });

   useEffect( () => {

    if (!debounce.trim()) {
      setSearchResult([]);
      return;
  }
    const getUserSearch = async() => {
      if(!search) return;
      setLoadingSearch(true);
      const response = await getRequest(
        `${baseUrl}/users/search?search=${search}`
      );
      setLoadingSearch(false);
      setSearchResult(response);
    }
    getUserSearch()
  }, [debounce]);

  
  return (
    <AuthContext.Provider
      value={{
        user,
        registerInfo,
        updateRegisterInfo,
        registerUser,
        registerError,
        isRegisterLoading,
        logoutUser,
        updateLoginInfo,
        loginUser,
        loginError,
        isLoginLoading,
        loginInfo,
        updateSearch,
        searchResult, 
        loadingSearch
       
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
