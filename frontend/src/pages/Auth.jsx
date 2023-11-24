import Signup from "../components/Signup"
import { useRecoilValue } from "recoil"
import Login from "../components/Login"
import { authAtom } from "../../atoms/authAtom"

const Auth = () => {
  const authScreen = useRecoilValue(authAtom);
  return (
    <>
       
    {authScreen === "login"?<Login />:<Signup/>}
 
      

    </>
  )
}

export default Auth