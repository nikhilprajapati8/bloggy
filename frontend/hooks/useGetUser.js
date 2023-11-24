import { useEffect, useState } from "react";
import useShowToast from "./useShowToast";

const useGetUser = (query) => {
  const [user, setUser] = useState(null)
  const showToast = useShowToast();
  const [loading, setLoading] = useState(true)



  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/getuser/${query}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", `${data.error}`, "error")
          return
        }
        setUser(data);
      } catch (err) {
        showToast("Error", `${err}`, "error")

      } finally {
        setLoading(false)
      }

    }
    getUser();

  }, [query, showToast])


  return { user, loading }
}

export default useGetUser;