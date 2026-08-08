import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar(){

    const {user,signOut}=useAuth();

    const navigate=useNavigate();

    const logout=()=>{

        signOut();

        navigate("/login");

    }

    return(

        <div
        style={{
            display:"flex",
            justifyContent:"space-between",
            padding:"15px 30px",
            background:"#20232a",
            color:"white"
        }}
        >

            <h2>My Dashboard</h2>

            <div>

                Hello {user.username}

                <button

                onClick={logout}

                style={{
                    marginLeft:"20px"
                }}

                >

                Logout

                </button>

            </div>

        </div>

    );

}