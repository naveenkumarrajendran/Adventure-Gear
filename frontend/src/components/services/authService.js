export const saveUser = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
  };
  
  export const saveToken = (token) => {
    localStorage.setItem("token", token);
  };
  
  export const removeUser = () => {
    localStorage.removeItem("user");
  };
  
  export const getUser = () => {
    const user = localStorage.getItem("user");
    return JSON.parse(user);
  };
  
  export const getToken = () => {
    const token = localStorage.getItem("token");
    return token;
  };