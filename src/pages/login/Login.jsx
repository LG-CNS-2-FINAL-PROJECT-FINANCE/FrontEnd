import { useParams } from "react-router-dom";
import LoginDetail_1 from "./LoginDetail_1";
import LoginDetail_2 from "./LoginDetail_2";
import LoginDetail_3 from "./LoginDetail_3";
import LoginDetail_4 from "./LoginDetail_4";
import LoginDetail_5 from "./LoginDetail_5";
import LoginDetail_6 from "./LoginDetail_6";

function Login() {
  const { id } = useParams();

  return (
    <div>
      {id === "1" && <LoginDetail_1 />}
      {id === "2" && <LoginDetail_2 />}
      {id === "3" && <LoginDetail_3 />}
      {id === "4" && <LoginDetail_4 />}
      {id === "5" && <LoginDetail_5 />}
      {id === "6" && <LoginDetail_6 />}
    </div>
  );
}

export default Login;
