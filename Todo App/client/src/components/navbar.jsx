import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { Dropdown, Icon, Menu } from 'semantic-ui-react'
import Cookies from 'universal-cookie';
import { logout } from '../functions/auth';
import { setAdmin, setLogins } from '../reducers/globalStates';
import './style.css'

export default function Navbar() {
  const cookie=new Cookies();
  const username = cookie.get("username");
  const dispatcher = useDispatch();
    const navigate = useNavigate();
    const [activeItem, setActiveItem] = useState("home")
    const [isAdmin, setIsAdmin] = useState(cookie.get("admin") === "true");
   
    
useEffect(() => {
  setIsAdmin(cookie.get("admin") === "true");
}, []);
    
    const destroySession = async () => {
        let flag = await logout();
        if (flag === true) {
            dispatcher(setLogins(false, null), setAdmin(false));
            navigate("/todo/authenticate");
        } else {
            return false;
        }
    };
    const State = useSelector((state) => state.globalStates);

    const handleItemClick = (e, { name }) => setActiveItem(name)
    return (
        <div>
            <Menu fixed='top'>
                {State.loggedIn ? ( isAdmin ? (<>
                    <Menu.Item
                        name='home'
                        active={activeItem === 'home'}
                        as={Link}
                        to=""
                        onClick={handleItemClick}
                        className={activeItem === 'home' ? 'active-link' : ''}
                    />
                    <Menu.Item
                        name='Assign Task'
                        as={Link}
                        to="/admin"
                        active={activeItem === 'Assign Task'}
                        onClick={handleItemClick}
                        className={activeItem === 'Assign Task' ? 'active-link' : ''}
                    />
                   
                    <Menu.Menu position="right">
        <Dropdown
          item
          trigger={
            <>
              <Icon name="user circle" />
              {username}
            </>
          }
        >
          <Dropdown.Menu>
            <Dropdown.Item onClick={destroySession}>
              <Icon name="sign-out" />
              Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Menu>
                </>):(
                    <>
                     <Menu.Item
                        name='home'
                        active={activeItem === 'home'}
                        as={Link}
                        to=""
                        onClick={handleItemClick}
                    />
                     <Menu.Item
                        name='Logout'
                        position="right"
                        active={activeItem === 'Logout'}
                        onClick={destroySession}
                    />
                    </>
)) : (<>
                    <Menu.Item
                        name='Login'
                        position='right'
                        active={activeItem === 'Login'}
                        as={Link}
                        to="/login"
                        onClick={handleItemClick}
                    />
                </>)}
            </Menu>
        </div>
    )
}
