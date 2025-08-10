import "../styles/error.css"
import { Link } from "react-router-dom";

export default function Error(){

    return(

        <div className="errorPage">

            <h1 className="errorCode">404</h1>

            <p className="errorMessage">  Oops! The page you are looking for doesn't exist or has been moved.</p>

            <Link to="/" className="backHomeBtn">
            
                Go Back Home
            
            </Link>

        </div>

    );

}