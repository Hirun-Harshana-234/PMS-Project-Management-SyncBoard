import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
export default function Index() {

    const { user, signOut } = useAuth();

    const navigate = useNavigate();

    const handleLogout = () => {

        signOut();

        navigate("/login");

    };

    return (

        <div
            style={{
                padding: "40px",
                fontFamily: "Arial"
            }}
        >

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "40px"
                }}
            >

                <div>

                    <h1>Dashboard</h1>

                    <h2>

                        Welcome,

                        <span style={{ color: "blue" }}>
                            {" "}
                            {user.username}
                        </span>

                    </h2>

                </div>

                <button

                    onClick={handleLogout}

                    style={{
                        padding: "10px 20px",
                        cursor: "pointer"
                    }}

                >

                    Logout

                </button>

            </div>

            <hr />

            <h3>User Information</h3>

            <p>

                <strong>ID :</strong> {user.id}

            </p>

            <p>

                <strong>Username :</strong> {user.username}

            </p>

        </div>

    );

}