import React, {Component} from 'react';

import axios from '../../axios-orders';

import Button from '../../components/UI/Button/Button';
import classes from './ContactData.css';
import Spinner from '../../components/UI/Spinner/Spinner';
import Input from '../../components/UI/Input/Input';

class ContactData extends Component {
    state = {
        orderForm: {
                name: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'Your Name'
                    },
                    value: '',
                    validation: {
                        required: true,
                    },
                    valid: false,
                    touched: false,
                    formIsValid: false
                },
                street: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'My Street'
                    },
                    value: '',
                    validation: {
                        required: true,
                    },
                    valid: false,
                    touched: false,
                    formIsValid: false
                },
                zipCode: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'Zip Code'
                    },
                    value: '',
                    validation: {
                        required: true,
                        minLength: 5,
                        maxLength: 5
                    },
                    valid: false,
                    touched: false,
                    formIsValid: false
                },
                country: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'Country'
                    },
                    value: '',
                    validation: {
                        required: true,
                    },
                    valid: false,
                    touched: false,
                    formIsValid: false
                },
                email: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'email',
                        placeholder: 'Your Email'
                    },
                    value: '',
                    validation: {
                        required: true,
                    },
                    valid: false,
                    touched: false,
                    formIsValid: false
                },
                deliveryMethod: {
                    elementType: 'select',
                    elementConfig: {
                        options: [
                            {value: 'fastest', displayValue: 'Fastest'},
                            {value: 'cheapest', displayValue: 'Cheapest'},
                        ]
                    },
                    value: 'fastest',
                    validation: {},
                    valid: true
                }
        },
        loading: false
    }

    orderHandler = (event)  => {
        event.preventDefault();
        console.log("Inside ContactData",this.props.ingredients);
        this.setState({loading: true});
        const formdata ={};
        for(let formElId in this.state.orderForm){
            formdata[formElId] = this.state.orderForm[formElId];
        }
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            orderData: formdata
            
        }
        axios.post('/orders.json', order)
            .then(response => {
                this.setState({loading: false, purchasing: false});
                this.props.history.push('/');
                
            })
            .catch(error => {
                this.setState({loading: false, purchasing: false});
            });
    }

    checkValidity(value, rules) {
        let isValid = true;
        if(rules.required){
            isValid = value.trim() !== '';
        }
        if(rules.minLength){
            isValid = value.length >= rules.minLength && isValid;
        }
        if(rules.maxLength){
            isValid = value.length <= rules.maxLength && isValid;
        }

        return isValid;
    }

    inputChangedHandler = (event, inputIdentifier) => {
        // Clone oredrForm data, as it doesnt deeply clone the data
        //  we need to further copy it
        const updatedOrderForm = {...this.state.orderForm};
        const updatedFormElement = {...updatedOrderForm[inputIdentifier]};
        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value,updatedFormElement.validation);
        updatedFormElement.touched = true;
        updatedOrderForm[inputIdentifier] = updatedFormElement;
        let formIsValid = true;
        for(let inputIdentifier in updatedOrderForm) {
            formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
        }
        console.log(formIsValid);
        this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid});
    }

    render() {
        let form = null;
        if(this.state.loading) {
            form = <Spinner />
        } else {
            const formElementsArray = [];
            for(let key in this.state.orderForm) {
                formElementsArray.push({
                    id: key,
                    config: this.state.orderForm[key],

                });
            }
            form = (
                <form>
                    {formElementsArray.map(formEl => (
                        <Input 
                               key={formEl.id}
                               elementType={formEl.config.elementType}
                               elementConfig= {formEl.config.elementConfig}
                               value= {formEl.config.value} 
                               invalid={!formEl.config.valid}
                               shouldValidate={formEl.config.validation}
                               touched={formEl.config.touched}
                               changed={(event) => this.inputChangedHandler(event,formEl.id)}/>
                    ))}
                    <Button btnType="Success" clicked={this.orderHandler} disabled={!this.state.formIsValid}>ORDER</Button>
                </form>
            )
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        );
    }
}

export default ContactData;