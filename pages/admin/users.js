import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';
import NextLink from 'next/link';

import React, { useEffect, useContext } from 'react';
import { Store } from '../../utils/Store';
import Layout from '../../components/Layout';
import {
  Card,
  List,
  ListItem,
  Button,
  Grid,
  ListItemText,
  Typography,
} from '@mui/material';
import styles from '../../styles/App.module.css';
import User from '../../models/User'
import db from '../../utils/db';
import { useSnackbar } from 'notistack';
import { getError } from '../../utils/formatError';
import axios from 'axios';




const UsersAdmin = ({users}) => {

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const { state: { user } } = useContext(Store);
  const router = useRouter();


  useEffect(() => {
    if (!user.isAdmin) {
      return router.push('/');
    }

  }, []);



const deleteUser = id => {


  const action = key => (
    <React.Fragment>
        <Button  color='error' onClick={() => removeUserConfirmed(id) }>
            Remove User
        </Button>
        <Button className={styles.whiteColor} onClick={() => { closeSnackbar(key) }}>
            Cancel
        </Button>
    </React.Fragment>
  );
  enqueueSnackbar("Confirm Delete", {
    variant: 'warning',
    autoHideDuration: 3000,
    action,
  });

}

const removeUserConfirmed = async id => {
  closeSnackbar();
  try{
    const {data} = await axios.post(`/api/admin/deleteUser`, {id},{
      headers:{authorization: `Bearer ${user.token}`}
    });

    enqueueSnackbar(data.message, { variant: 'success', autoHideDuration:2000 })

}catch(error){
    enqueueSnackbar(getError(error), { variant: 'error', autoHideDuration:4000 })
}
}


  const newPassword = async userEmail => {
    closeSnackbar();
    try{
      const {data} = await axios.post(`/api/users/forgot`, {email:userEmail});

      enqueueSnackbar(data.message, { variant: 'success', autoHideDuration:2000 })

  }catch(error){
      enqueueSnackbar(getError(error), { variant: 'error', autoHideDuration:4000 })
  }
  }

  return (
    <Layout title="Admin Products">
      <Grid container spacing={1} marginTop={4}>
        <Grid item md={2} xs={12}>
          <Card className={styles.section}>
              <List>
                  <NextLink href={'/admin/dashboard'} passHref>
                      <ListItem button  component='a'>
                          <ListItemText primary='Orders'></ListItemText>
                      </ListItem>
                  </NextLink>
                  <NextLink href={'/admin/products'} passHref>
                      <ListItem button component='a'>
                          <ListItemText primary='Products'></ListItemText>
                      </ListItem>
                  </NextLink>
                  <NextLink href={'/admin/users'} passHref>
                      <ListItem button component='a' selected>
                          <ListItemText primary='Users'></ListItemText>
                      </ListItem>
                  </NextLink>
              </List>
          </Card>
        </Grid>

        <Grid item md={10} xs={12}>
         
          {users.map(u => (
            <Grid container key={u._id} margin={1}>
              <Grid item md={1}>
              <Typography component={'p'}>{u.fullName}</Typography>
              </Grid>
              <Grid item md={2}>
              <Typography component={'p'}>{u.email}</Typography>
              </Grid>
              <Grid item md={2}>
              <Typography component={'p'}>{new Date(u.createdAt).toLocaleString()}</Typography>
              </Grid>
              <Grid item md={3}>
              <Typography component={'p'}>{u._id}</Typography>
              </Grid>
              <Grid item md={2}>
              <Button color="info" variant='outlined' onClick={() => newPassword(u.email)}>new Password</Button>
              </Grid>
              <Grid item md={2}>
              <Button color="error" variant='outlined' onClick={() => deleteUser(u._id)}>delete User</Button>
              </Grid>
            </Grid>
          ))} 
       
        </Grid>
      </Grid>
    </Layout>
  );
};

export const getServerSideProps = async context => {
  try{
    await db.connectDb();
    const users = await User.find({}).lean();
    await db.disconnectDb();
    return{
      props: {users: users.map(u => (db.convertDocToObject(u)))}
    }
  }
  catch(e){
    if(e){
      return{
        props: {users: null}
      }
    }
  }
 
} 

export default dynamic(() => Promise.resolve(UsersAdmin), { ssr: false });
