import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'
import Cookies from 'universal-cookie';
import { logout } from '../functions/auth';
import { setAdmin, setLogins } from '../reducers/globalStates';
const cookie=new Cookies();
const isAdmin = cookie.get("role") === "true";

export default function Navbar() {
    const dispatcher = useDispatch();
    const navigate = useNavigate();
    const [activeItem, setActiveItem] = useState("home")
    
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
            <Menu>
                {State.loggedIn ? ( isAdmin ? (<>
                    <Menu.Item
                        name='home'
                        active={activeItem === 'home'}
                        as={Link}
                        to="/"
                        onClick={handleItemClick}
                    />
                    <Menu.Item
                        name='Assign Task'
                        as={Link}
                        to="/admin"
                        active={activeItem === 'Assign Task'}
                        onClick={handleItemClick}
                    />
                    <Menu.Item
                        name='Logout'
                        position="right"
                        active={activeItem === 'Logout'}
                        onClick={destroySession}
                    />
                </>):(
                    <>
                     <Menu.Item
                        name='home'
                        active={activeItem === 'home'}
                        as={Link}
                        to="/"
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
