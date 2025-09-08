import { useEffect, useState } from 'react';
import { BrowserRouter as Router , Routes , Route , Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Feed from '../src/pages/feed';
import Login from './pages/login';
import Register from './pages/register';
import Navigation from './components/Navigation';
import Profile from './pages/profile';
import About from './pages/About';
import Error from './pages/Error404';

// SALAM view 
// hy 


export default function App() {

  const [isAuthenticated , setIsAuthenticated] = useState(false);
  const [isLoading , setIsLoading] = useState(true);

    useEffect(() => {

      //checking the token

      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
      setIsLoading(false);
      

      const fetchData = async () => {

        try {
          
          const res = await axios.get('http://localhost:7777/');
          console.log(res.data);
          

        } catch (error) {

          console.log(error);
          
        }


      };

      fetchData();


    } , []);

    //
    if(isLoading){

      return <div>Loading...</div>;

    }

    return (

      <Router>

        {isAuthenticated && <Navigation onLogout={() => setIsAuthenticated(false)}/>}

        <Routes>

          <Route
          
            path="/"
            element= {

              isAuthenticated ? <Feed/> : <Navigate to="/login" />

            }
          
          />

          <Route 
          
            path='/login'
            element= {

              isAuthenticated ? (

                <Navigate to="/"/>

              ) : (

                <Login onLogin= {() => setIsAuthenticated(true)}/>

              )

            }
          
          />

          <Route 
          
            path='/register'
            element= {

              isAuthenticated ? <Navigate to="/"/> : <Register />

            }
          
          />

          <Route 
          
            path='/profile/:userId'
            element= {

              isAuthenticated ? <Profile /> : <Navigate to="/login"/>

            }

          />

          <Route
          
            path='/About'
            element= {

              isAuthenticated ? <About /> : <Navigate to="/login"/>

            }
          
          />

          <Route 
          
            path='*'
            element= {

              isAuthenticated ? <Error /> : <Navigate to="/login"/>

            }
          
          />

        </Routes>

      </Router>

    );


}

