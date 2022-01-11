import { Stepper, Step, StepLabel } from '@mui/material';
import { StylesContext } from '@mui/styles';
import styles from '../styles/App.module.css';

const CheckoutWizard = ({activeStep = 0}) => {
    return (
        <Stepper activeStep={activeStep} alternativeLabel className={styles.wizard}>
            {['Login', 'Shipping Address', 'Payment Method', 'Place Order'].map(step => (
                <Step key={step}><StepLabel>{step}</StepLabel></Step>
            ))}
        </Stepper>
    )
}

export default CheckoutWizard
