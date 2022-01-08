import { Button, Menu, MenuItem } from '@mui/material';
import {useState} from 'react';
import styles from '../styles/App.module.css';
import { useRouter } from 'next/router';

const UserMenu = ({ userInfo }) => {


    const [anchorEl, setAnchorEl] = useState(null);
    
    const router = useRouter();

    const loginClickHandler = (e) => setAnchorEl(e.currentTarget)
    
    const loginMenuCloseHandler = (e, redirect) => {
     
        setAnchorEl(null);
        if (redirect) {
          router.push(redirect);
        }
      };

    const logoutClickHandler = () => null


  return (
    <>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={loginClickHandler}
        className={styles.navButton}
        
      >
        {userInfo.name}
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={(e) => loginMenuCloseHandler(e)}
    
        
      >
        <MenuItem onClick={(e) => loginMenuCloseHandler(e, '/profile')}>
          Profile
        </MenuItem>
        <MenuItem onClick={(e) => loginMenuCloseHandler(e, '/order-history')}>
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
