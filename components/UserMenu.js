import { Button, Menu, MenuItem } from '@mui/material';
import {useState, useContext} from 'react';
import {Store} from '../utils/Store';
import Cookies from 'js-cookie';
import styles from '../styles/App.module.css';
import { useRouter } from 'next/router';

const UserMenu = ({ userInfo }) => {

    const {dispatch} = useContext(Store);
    const [anchorEl, setAnchorEl] = useState(null);
    
    const router = useRouter();

    const loginClickHandler = (e) => setAnchorEl(e.currentTarget)
    
    const loginMenuCloseHandler = (e, redirect) => {
     
        setAnchorEl(null);
        if (redirect) {
          router.push(redirect);
        }
      };

    const logoutClickHandler = () => {
        setAnchorEl(null);
        dispatch({type:'USER_LOGOUT'});
        Cookies.remove('user');
        dispatch({type:'CART_CLEAR'})
        router.push('/');
    }


  return (
    <>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={loginClickHandler}
        className={styles.navButton}
        
      >
        {userInfo.fullName}
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={(e) => loginMenuCloseHandler(e)}
    
        
      >
        <MenuItem onClick={(e) => loginMenuCloseHandler(e, '/user/profile')}>
          Profile
        </MenuItem>
        <MenuItem onClick={(e) => loginMenuCloseHandler(e, '/order/order-history')}>
          Order Hisotry
        </MenuItem>
        {userInfo.isAdmin && (
          <MenuItem
            onClick={(e) => loginMenuCloseHandler(e, '/admin/dashboard')}
          >
            Admin Dashboard
          </MenuItem>
        )}
        <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
