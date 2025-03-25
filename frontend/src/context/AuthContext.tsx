/* eslint-disable react-refresh/only-export-components */
import { useEffect, ReactNode } from "react";
import { createContext, useReducer } from "react";
import axios from "axios";

export const AuthContext = createContext({});

type userState = {
  user: unknown;
  token: string;
  loading: boolean;
  isAuthenticated: boolean;
};

type AuthAction =
  | { type: "LOGIN"; payload: { user: unknown; token: string } }
  | { type: "LOGOUT" }
  | { type: "LOADING" };

const initialState: userState = {
  user: null,
  token: "",
  loading: false,
  isAuthenticated: false,
};

const authReducer = (state: userState, action: AuthAction) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload?.user,
        token: action.payload?.token,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: "",
      };
    case "LOADING":
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const fetchUserStatus = async (token: string) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/auth/isAuthenticated`,
        { token: token },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status == 200) {
        dispatch({ type: "LOGIN", payload: response.data });
      } else {
        dispatch({ type: "LOGOUT" });
      }
    } catch (err) {
      console.log(err);
      dispatch({ type: "LOGOUT" });
    }
  };

  useEffect(() => {
    try {
      dispatch({ type: "LOADING" });
      const token = localStorage.getItem("token");
      if (token) {
        fetchUserStatus(token);
      } else {
        dispatch({ type: "LOGOUT" });
      }
    } catch (err) {
      console.log(err);
    }
  }, []);
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
